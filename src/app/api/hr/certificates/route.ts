import { NextRequest, NextResponse } from "next/server";
import { getHrSessionFromCookies } from "@/lib/auth";
import { getInternById, updateIntern } from "@/lib/storage/intern-store";
import { storeCertificate } from "@/lib/storage/drive-store";
import { generateCertificateNumber } from "@/lib/id-generator";
import { generateCertificatePdf } from "@/lib/certificate";

export async function POST(request: NextRequest) {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const internId = (body.internId || "").trim();

    if (!internId) {
      return NextResponse.json({ error: "Intern ID is required." }, { status: 400 });
    }

    const intern = getInternById(internId);
    if (!intern) {
      return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
    }

    // Check if certificate already exists to prevent duplication
    if (intern.certificateNumber) {
      return NextResponse.json({
        success: true,
        message: "Certificate already issued for this intern.",
        certificateNumber: intern.certificateNumber,
        issueDate: intern.certificateIssueDate,
        alreadyIssued: true,
      });
    }

    // Verify internship is Completed
    if (intern.status !== "Completed") {
      return NextResponse.json(
        {
          error: `Certificate can only be issued for interns with status 'Completed'. Current status is '${intern.status}'. Please update status first.`,
        },
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

    // Update Intern record
    const updated = await updateIntern(
      intern.id,
      {
        certificateNumber: certNumber,
        certificateIssueDate: issueDate,
        certificateDriveFileId: uploadResult.fileId,
        certificateDriveLink: uploadResult.driveLink,
        certificateLocalFileName: uploadResult.localFileName,
        status: "Certificate Issued",
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
  } catch (error) {
    console.error("[SiteSecura Certificate] Error issuing certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate." },
      { status: 500 }
    );
  }
}
