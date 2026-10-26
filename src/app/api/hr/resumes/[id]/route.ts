import { NextRequest, NextResponse } from "next/server";
import { getHrSessionFromCookies } from "@/lib/auth";
import { getInternById } from "@/lib/storage/intern-store";
import { getResumeBuffer } from "@/lib/storage/drive-store";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const internId = params.id;
  const intern = await getInternById(internId);

  if (!intern) {
    return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
  }

  const buffer = await getResumeBuffer(
    intern.resumeLocalFileName,
    intern.resumeDriveFileId
  );

  if (!buffer) {
    return NextResponse.json(
      { error: "Resume document is unavailable or has not been uploaded." },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${intern.id}-resume.pdf"`,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
