import { NextRequest, NextResponse } from "next/server";
import { getHrSessionFromCookies, validateCsrfOrigin } from "@/lib/auth";
import { revokeCertificate } from "@/lib/storage/intern-store";

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
    const identifier = (body.certificateNumber || body.internId || "").trim();
    const reason = (body.reason || "").trim();

    if (!identifier) {
      return NextResponse.json(
        { error: "Certificate number or Intern ID is required." },
        { status: 400 }
      );
    }

    if (!reason || reason.length < 5) {
      return NextResponse.json(
        { error: "An internal revocation reason (minimum 5 characters) is required for audit compliance." },
        { status: 400 }
      );
    }

    const updated = await revokeCertificate(identifier, reason, session.username);

    return NextResponse.json({
      success: true,
      message: `Certificate ${updated.certificateNumber} has been officially revoked.`,
      certificateNumber: updated.certificateNumber,
      intern: updated,
    });
  } catch (error: any) {
    console.error("[SiteSecura Certificate Revocation] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to revoke certificate." },
      { status: 400 }
    );
  }
}
