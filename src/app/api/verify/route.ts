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
        status: "ERROR",
        error: "Verification rate limit exceeded. Please wait.",
        retryAfter: rateCheck.retryAfter,
      },
      { status: 429 }
    );
  }

  if (!certNumber || !isValidCertificateNumberFormat(certNumber)) {
    return NextResponse.json(
      {
        status: "NOT_FOUND",
        message: "Invalid or unrecognized certificate number format.",
      },
      { status: 400 }
    );
  }

  try {
    const intern = await getInternByCertificateNumber(certNumber);

    if (!intern || !intern.certificateNumber) {
      return NextResponse.json(
        {
          status: "NOT_FOUND",
          message: "No issued certificate matches the provided certificate identifier.",
        },
        { status: 404 }
      );
    }

    if (
      intern.certificateStatus === "Revoked" ||
      intern.status === "Withdrawn" ||
      intern.certificateRevokedAt
    ) {
      return NextResponse.json({
        status: "REVOKED",
        certificateNumber: intern.certificateNumber,
        issuingOrganization: "SiteSecura",
        revocationNotice:
          "This certificate is no longer valid. It has been officially revoked by SiteSecura Administration.",
        revocationDate: intern.certificateRevokedAt,
      });
    }

    return NextResponse.json({
      status: "VALID",
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
  } catch (err: any) {
    console.error("[SiteSecura Certificate Verification] Unexpected error:", err);
    return NextResponse.json(
      {
        status: "ERROR",
        error: "Verification service is temporarily unavailable. Please retry in a moment.",
      },
      { status: 500 }
    );
  }
}
