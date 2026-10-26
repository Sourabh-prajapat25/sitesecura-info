import { NextRequest, NextResponse } from "next/server";
import { getInternByCertificateNumber } from "@/lib/storage/intern-store";
import { getCertificateBuffer } from "@/lib/storage/drive-store";
import { isValidCertificateNumberFormat } from "@/lib/id-generator";

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

  const intern = getInternByCertificateNumber(certNumber);
  if (!intern || !intern.certificateNumber) {
    return NextResponse.json(
      { error: "Certificate record not found." },
      { status: 404 }
    );
  }

  if (intern.status === "Withdrawn") {
    return NextResponse.json(
      { error: "This certificate has been revoked." },
      { status: 410 }
    );
  }

  const buffer = await getCertificateBuffer(
    intern.certificateLocalFileName,
    intern.certificateDriveFileId
  );

  if (!buffer) {
    return NextResponse.json(
      { error: "Certificate file could not be retrieved." },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="SiteSecura-Certificate-${certNumber}.pdf"`,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
