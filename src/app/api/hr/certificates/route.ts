import { NextRequest, NextResponse } from "next/server";
import { getHrSessionFromCookies, validateCsrfOrigin } from "@/lib/auth";
import {
  getInternById,
  updateIntern,
  checkCertificateEligibility,
} from "@/lib/storage/intern-store";
import { storeCertificate } from "@/lib/storage/drive-store";
import { generateCertificateNumber } from "@/lib/id-generator";
import { generateCertificatePdf } from "@/lib/certificate";

export async function POST(request: NextRequest) {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  if (!validateCsrfOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin (CSRF check failed)." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const internId = (body.internId || "").trim();

    if (!internId) {
      return NextResponse.json({ error: "Intern ID is required." }, { status: 400 });
    }

    const intern = await getInternById(internId);
    if (!intern) {
      return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
    }

    // Server-enforced eligibility check (Completed tenure, valid dates, stable ID)
    const eligibility = checkCertificateEligibility(intern);
    if (!eligibility.eligible) {
      return NextResponse.json(
        { error: eligibility.reason || "Intern is not eligible for certificate issuance." },
        { status: 400 }
      );
    }

    // Generate unique Certificate Number
    const certNumber = generateCertificateNumber();
    const issueDate = new Date().toISOString().split("T")[0];

    // Generate PDF Buffer
    const pdfBuffer = await generateCertificatePdf({
      internName: intern.fullName,
      role: intern.customRole || intern.role,
      startDate: intern.startDate,
      endDate: intern.endDate,
      certificateNumber: certNumber,
      issueDate,
    });

    // Store PDF in Drive / local store
    const uploadResult = await storeCertificate(pdfBuffer, certNumber);

    // Update Intern record: preserve status as 'Completed' and record certificateStatus as 'Issued'
    const updated = await updateIntern(
      intern.id,
      {
        certificateNumber: certNumber,
        certificateIssueDate: issueDate,
        certificateStatus: "Issued",
        certificateDriveFileId: uploadResult.fileId,
        certificateDriveLink: uploadResult.driveLink,
        certificateLocalFileName: uploadResult.localFileName,
      },
      session.username
    );

    return NextResponse.json({
      success: true,
      message: "Certificate generated and issued successfully.",
      certificateNumber: certNumber,
      issueDate,
      downloadUrl: `/api/certificates/${certNumber}/download`,
      intern: updated,
    });
  } catch (error: any) {
    console.error("[SiteSecura Certificate] Error issuing certificate:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate certificate." },
      { status: 500 }
    );
  }
}
