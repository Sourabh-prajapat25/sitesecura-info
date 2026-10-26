import { NextRequest, NextResponse } from "next/server";
import { getHrSessionFromCookies, validateCsrfOrigin } from "@/lib/auth";
import {
  getAllInterns,
  getInternById,
  getInternByEmail,
  createIntern,
  internIdExists,
  getIdempotencyRecord,
  setIdempotencyRecord,
} from "@/lib/storage/intern-store";
import { storeResume, deleteDriveFile } from "@/lib/storage/drive-store";
import { generateInternId } from "@/lib/id-generator";
import {
  isValidEmail,
  isValidPhoneNumber,
  isValidUrl,
  isPdfBuffer,
} from "@/lib/sanitizer";
import { InternRecord } from "@/types/intern";

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function GET(request: NextRequest) {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const role = searchParams.get("role") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "15", 10)));

  const all = await getAllInterns();

  // Metrics computation
  const now = new Date();
  const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const stats = {
    total: all.length,
    active: all.filter((i) => i.status === "Active").length,
    completed: all.filter((i) => i.status === "Completed" || i.status === "Certificate Issued").length,
    certificatesIssued: all.filter((i) => Boolean(i.certificateNumber)).length,
    upcomingEndDates: all.filter((i) => {
      if (i.status === "Completed" || i.status === "Withdrawn") return false;
      const end = new Date(i.endDate);
      return end >= now && end <= twoWeeksLater;
    }).length,
  };

  // Filter items
  let filtered = all.filter((intern) => {
    if (search) {
      const matchId = intern.id.toLowerCase().includes(search);
      const matchName = intern.fullName.toLowerCase().includes(search);
      const matchEmail = intern.email.toLowerCase().includes(search);
      if (!matchId && !matchName && !matchEmail) return false;
    }
    if (role && intern.role !== role && intern.customRole !== role) {
      return false;
    }
    if (status && intern.status !== status) {
      return false;
    }
    return true;
  });

  // Sort descending by registration date
  filtered.sort(
    (a, b) =>
      new Date(b.registrationTimestamp).getTime() -
      new Date(a.registrationTimestamp).getTime()
  );

  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    stats,
    page,
    totalPages,
    totalResults,
    interns: paginated,
  });
}

export async function POST(request: NextRequest) {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  // CSRF Origin validation
  if (!validateCsrfOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin (CSRF check failed)." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();

    // Idempotency check
    const idempotencyKey = formData.get("idempotencyKey") as string | null;
    if (idempotencyKey) {
      const cachedId = await getIdempotencyRecord(idempotencyKey);
      if (cachedId) {
        const existing = await getInternById(cachedId);
        if (existing) {
          return NextResponse.json({
            success: true,
            message: "Record already submitted.",
            intern: existing,
          });
        }
      }
    }

    // Required Fields Validation
    const fullName = ((formData.get("fullName") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim().toLowerCase();
    const phone = ((formData.get("phone") as string) || "").trim();
    const city = ((formData.get("city") as string) || "").trim();
    const state = ((formData.get("state") as string) || "").trim();
    const role = ((formData.get("role") as string) || "").trim();
    const customRole = ((formData.get("customRole") as string) || "").trim();
    const startDate = ((formData.get("startDate") as string) || "").trim();
    const endDate = ((formData.get("endDate") as string) || "").trim();
    const informedConsent = formData.get("informedConsent") === "true";

    const errors: Record<string, string> = {};

    if (!fullName || fullName.length < 2) {
      errors.fullName = "Full legal name must be at least 2 characters.";
    }
    if (!isValidEmail(email)) {
      errors.email = "A valid email address is required.";
    }
    if (!isValidPhoneNumber(phone)) {
      errors.phone = "Valid phone number with country code is required (e.g. +1234567890).";
    }
    if (!city) {
      errors.city = "City is required.";
    }
    if (!state) {
      errors.state = "State is required.";
    }
    if (!role) {
      errors.role = "Internship role is required.";
    } else if (role === "Other" && (!customRole || customRole.length < 2)) {
      errors.customRole = "Please specify the custom role.";
    }

    if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      errors.startDate = "Valid start date (YYYY-MM-DD) is required.";
    }
    if (!endDate || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      errors.endDate = "Valid end date (YYYY-MM-DD) is required.";
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.endDate = "End date must be on or after start date.";
    }

    if (!informedConsent) {
      errors.informedConsent = "Candidate information consent confirmation is mandatory.";
    }

    // Check duplicate email
    if (isValidEmail(email)) {
      const existingCandidate = await getInternByEmail(email);
      if (existingCandidate) {
        return NextResponse.json(
          {
            error: `Candidate with email "${email}" is already registered (Intern ID: ${existingCandidate.id}). Duplicate registrations are prohibited.`,
            existingId: existingCandidate.id,
          },
          { status: 409 }
        );
      }
    }

    // Optional Fields URL Validation
    const linkedinUrl = ((formData.get("linkedinUrl") as string) || "").trim();
    const instagramUrl = ((formData.get("instagramUrl") as string) || "").trim();
    const otherSocialUrl = ((formData.get("otherSocialUrl") as string) || "").trim();
    const portfolioUrl = ((formData.get("portfolioUrl") as string) || "").trim();
    const college = ((formData.get("college") as string) || "").trim();
    const courseYear = ((formData.get("courseYear") as string) || "").trim();
    const hrNotes = ((formData.get("hrNotes") as string) || "").trim();
    const offerLetterRef = ((formData.get("offerLetterRef") as string) || "").trim();

    if (linkedinUrl && !isValidUrl(linkedinUrl)) errors.linkedinUrl = "Invalid LinkedIn URL.";
    if (instagramUrl && !isValidUrl(instagramUrl)) errors.instagramUrl = "Invalid Instagram URL.";
    if (otherSocialUrl && !isValidUrl(otherSocialUrl)) errors.otherSocialUrl = "Invalid URL.";
    if (portfolioUrl && !isValidUrl(portfolioUrl)) errors.portfolioUrl = "Invalid Portfolio/GitHub URL.";

    // Resume PDF File Validation
    const resumeFile = formData.get("resume") as File | null;
    if (!resumeFile || typeof resumeFile.arrayBuffer !== "function") {
      errors.resume = "Resume PDF file is required.";
    } else {
      if (resumeFile.size > MAX_RESUME_SIZE_BYTES) {
        errors.resume = `Resume file size exceeds the 5 MB limit (file is ${(
          resumeFile.size /
          (1024 * 1024)
        ).toFixed(2)} MB).`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });
    }

    // Validate PDF magic bytes
    const arrayBuffer = await resumeFile!.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isPdfBuffer(buffer)) {
      return NextResponse.json(
        {
          error: "Invalid file format.",
          errors: { resume: "The uploaded file is not a valid PDF document (magic bytes mismatch)." },
        },
        { status: 400 }
      );
    }

    // Generate Collision-Safe Unique Intern ID
    let internId = "";
    let attempts = 0;
    while (attempts < 5) {
      const candidate = generateInternId();
      if (!(await internIdExists(candidate))) {
        internId = candidate;
        break;
      }
      attempts++;
    }

    if (!internId) {
      return NextResponse.json(
        { error: "Could not allocate a unique intern ID. Please retry." },
        { status: 500 }
      );
    }

    // Store Resume securely
    let uploadResult;
    try {
      uploadResult = await storeResume(buffer, internId);
    } catch (uploadError: any) {
      console.error("[SiteSecura Registration] Resume storage failed:", uploadError);
      return NextResponse.json(
        { error: `Resume upload failed: ${uploadError?.message || "Storage error"}` },
        { status: 500 }
      );
    }

    const nowIso = new Date().toISOString();
    const newRecord: InternRecord = {
      id: internId,
      registrationTimestamp: nowIso,
      fullName,
      email,
      phone,
      city,
      state,
      role: role === "Other" ? "Other" : role,
      customRole: role === "Other" ? customRole : undefined,
      startDate,
      endDate,
      linkedinUrl: linkedinUrl || undefined,
      instagramUrl: instagramUrl || undefined,
      otherSocialUrl: otherSocialUrl || undefined,
      portfolioUrl: portfolioUrl || undefined,
      college: college || undefined,
      courseYear: courseYear || undefined,
      resumeDriveFileId: uploadResult.fileId,
      resumeDriveLink: uploadResult.driveLink,
      resumeLocalFileName: uploadResult.localFileName,
      status: "Registered",
      hrNotes: hrNotes || undefined,
      offerLetterRef: offerLetterRef || undefined,
      createdBy: session.username,
      lastUpdatedTimestamp: nowIso,
      informedConsent: true,
      auditLog: [
        {
          timestamp: nowIso,
          actor: session.username,
          action: "REGISTRATION",
          details: `Intern registered with ID ${internId}`,
        },
      ],
    };

    let saved: InternRecord;
    try {
      saved = await createIntern(newRecord);
    } catch (storeError: any) {
      console.error("[SiteSecura Registration] Failed to save intern record, rolling back resume:", storeError);
      if (uploadResult?.fileId) {
        try {
          await deleteDriveFile(uploadResult.fileId);
        } catch (cleanupError) {
          console.warn("[SiteSecura Registration] Drive file rollback failed:", cleanupError);
        }
      }
      return NextResponse.json(
        {
          error: `Failed to persist intern record: ${storeError?.message || "Storage error"}`,
        },
        { status: 500 }
      );
    }

    if (idempotencyKey) {
      await setIdempotencyRecord(idempotencyKey, internId);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Intern registered successfully.",
        intern: saved,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[SiteSecura Registration] Error processing registration:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving the registration." },
      { status: 500 }
    );
  }
}
