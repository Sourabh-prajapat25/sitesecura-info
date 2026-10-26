import { NextRequest, NextResponse } from "next/server";
import { getInternByCertificateNumber } from "@/lib/storage/intern-store";
import { getCertificateBuffer } from "@/lib/storage/drive-store";
import { isValidCertificateNumberFormat } from "@/lib/id-generator";
import {
  getHrSessionFromCookies,
  verifyCertificateDownloadGrant,
} from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const certNumber = (params.id || "").trim().toUpperCase();

  if (!isValidCertificateNumberFormat(certNumber)) {
    return NextResponse.json(
      { error: "Invalid certificate number format." },
      { status: 400 }
    );
  }

  const intern = await getInternByCertificateNumber(certNumber);
  if (!intern || !intern.certificateNumber) {
    return NextResponse.json(
      { error: "Certificate record not found." },
      { status: 404 }
    );
  }

  // Reject downloads for revoked certificates
  if (
    intern.certificateStatus === "Revoked" ||
    intern.status === "Withdrawn" ||
    intern.certificateRevokedAt
  ) {
    return NextResponse.json(
      { error: "This certificate has been revoked and is no longer available for download." },
      { status: 410 }
    );
  }

  // Verify Server-Side Authorization: HR Session or Cryptographically Signed Grant
  const hrSession = getHrSessionFromCookies();
  let isAuthorized = Boolean(hrSession);

  if (!isAuthorized) {
    const { searchParams } = new URL(request.url);
    const grant = searchParams.get("grant");
    if (grant) {
      const grantRes = verifyCertificateDownloadGrant(grant, certNumber);
      if (grantRes.valid && grantRes.internId === intern.id) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      {
        error:
          "Download authorization required. Direct unauthenticated access is prohibited. Please access your credential through the SiteSecura Intern Portal.",
      },
      { status: 403 }
    );
  }

  const buffer = await getCertificateBuffer(
    intern.certificateLocalFileName,
    intern.certificateDriveFileId
  );

  if (!buffer) {
    return NextResponse.json(
      { error: "Certificate file could not be retrieved from secure storage." },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="SiteSecura-Certificate-${certNumber}.pdf"`,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
