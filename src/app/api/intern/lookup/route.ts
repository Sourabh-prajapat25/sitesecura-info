import { NextRequest, NextResponse } from "next/server";
import { getInternById, computeCertificateStatus } from "@/lib/storage/intern-store";
import { isValidInternIdFormat } from "@/lib/id-generator";
import { isValidEmail } from "@/lib/sanitizer";
import {
  checkRateLimit,
  getClientIdentifier,
  createCertificateDownloadGrant,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIdentifier(request);

    // Rate limiting: max 10 lookups per 10 minutes to prevent ID and credential enumeration
    const rateCheck = checkRateLimit(`intern_lookup_${clientIp}`, 10, 10 * 60, 10 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many lookup attempts. Please wait before trying again.",
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const internId = (body?.internId || "").trim().toUpperCase();
    const email = (body?.email || "").trim().toLowerCase();

    if (!internId || !isValidInternIdFormat(internId) || !email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid Intern ID (e.g. SS-INT-2026-A7K92P) and registered email address.",
        },
        { status: 400 }
      );
    }

    const intern = await getInternById(internId);

    // Constant-feedback response: do not disclose whether ID or email failed individually
    if (!intern || intern.email.trim().toLowerCase() !== email) {
      return NextResponse.json(
        {
          error:
            "No matching record found for the provided Intern ID and registered email combination. Please verify your enrollment confirmation details.",
        },
        { status: 404 }
      );
    }

    const certificateStatus = computeCertificateStatus(intern);
    const hasIssuedCertificate = certificateStatus === "Issued";

    // Generate short-lived cryptographically signed download grant for issued certificates
    let downloadUrl: string | undefined = undefined;
    if (hasIssuedCertificate && intern.certificateNumber) {
      const grant = createCertificateDownloadGrant(intern.id, intern.certificateNumber);
      downloadUrl = `/api/certificates/${intern.certificateNumber}/download?grant=${encodeURIComponent(
        grant
      )}`;
    }

    // Return strictly approved, privacy-safe status fields
    return NextResponse.json({
      success: true,
      intern: {
        internId: intern.id,
        internName: intern.fullName,
        role: intern.customRole || intern.role,
        startDate: intern.startDate,
        endDate: intern.endDate,
        internshipStatus: intern.status,
        certificateStatus,
        certificateAvailable: hasIssuedCertificate,
        certificateNumber:
          hasIssuedCertificate || certificateStatus === "Revoked"
            ? intern.certificateNumber
            : undefined,
        certificateIssueDate:
          hasIssuedCertificate || certificateStatus === "Revoked"
            ? intern.certificateIssueDate
            : undefined,
        downloadUrl,
      },
    });
  } catch (error) {
    console.error("[SiteSecura Intern Lookup] Error processing lookup:", error);
    return NextResponse.json(
      { error: "Lookup service encountered an unexpected error. Please retry shortly." },
      { status: 500 }
    );
  }
}
