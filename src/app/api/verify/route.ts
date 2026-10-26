import { NextRequest, NextResponse } from "next/server";
import { getInternByCertificateNumber } from "@/lib/storage/intern-store";
import { isValidCertificateNumberFormat } from "@/lib/id-generator";
import { checkRateLimit, getClientIdentifier } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const certNumber = (searchParams.get("cert") || "").trim().toUpperCase();
  return handleVerification(request, certNumber);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const certNumber = (body?.cert || body?.certificateNumber || "").trim().toUpperCase();
  return handleVerification(request, certNumber);
}

async function handleVerification(request: NextRequest, certNumber: string) {
  const clientIp = getClientIdentifier(request);

  // Rate limiting: 20 verification checks per 10 minutes to prevent brute-force enumeration
  const rateCheck = checkRateLimit(`verify_${clientIp}`, 20, 10 * 60, 10 * 60);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        status: "Error",
        error: "Verification rate limit exceeded. Please wait.",
        retryAfter: rateCheck.retryAfter,
      },
      { status: 429 }
    );
  }

  if (!certNumber || !isValidCertificateNumberFormat(certNumber)) {
    return NextResponse.json(
      {
        status: "Not Found",
        message: "Invalid or unrecognized certificate number format.",
      },
      { status: 400 }
    );
  }

  const intern = await getInternByCertificateNumber(certNumber);

  if (!intern || !intern.certificateNumber) {
    return NextResponse.json(
      {
        status: "Not Found",
        message: "No issued certificate matches the provided certificate identifier.",
      },
      { status: 404 }
    );
  }

  if (intern.status === "Withdrawn") {
    return NextResponse.json({
      status: "Revoked",
      certificateNumber: intern.certificateNumber,
      internName: intern.fullName,
      role: intern.customRole || intern.role,
      startDate: intern.startDate,
      endDate: intern.endDate,
      issueDate: intern.certificateIssueDate,
      issuingOrganization: "SiteSecura",
      revocationNotice: "This certificate has been revoked by SiteSecura Administration.",
    });
  }

  return NextResponse.json({
    status: "Valid",
    certificateNumber: intern.certificateNumber,
    internName: intern.fullName,
    role: intern.customRole || intern.role,
    startDate: intern.startDate,
    endDate: intern.endDate,
    issueDate: intern.certificateIssueDate,
    issuingOrganization: "SiteSecura",
    signatoryName: process.env.CERTIFICATE_SIGNATORY_NAME || "Sourabh K.",
    signatoryTitle: process.env.CERTIFICATE_SIGNATORY_TITLE || "Director, People & Operations",
  });
}
