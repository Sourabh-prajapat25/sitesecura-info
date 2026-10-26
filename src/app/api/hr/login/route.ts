import { NextRequest, NextResponse } from "next/server";
import {
  verifyHrCredentials,
  createSessionToken,
  attachSessionCookie,
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIdentifier(request);

    // Rate limit login attempts: 5 attempts per 15 minutes
    const rateCheck = checkRateLimit(`login_${clientIp}`, 5, 15 * 60, 15 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many failed attempts. Please wait before trying again.",
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.passkey !== "string") {
      return NextResponse.json(
        { error: "Passkey is required." },
        { status: 400 }
      );
    }

    const isMatch = verifyHrCredentials(body.passkey);
    if (!isMatch) {
      return NextResponse.json(
        {
          error: "Invalid HR credentials.",
          remainingAttempts: rateCheck.remaining,
        },
        { status: 401 }
      );
    }

    // Generate secure signed session token
    const token = createSessionToken("hr_admin");
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
    });

    attachSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[SiteSecura Auth] Login error:", error);
    return NextResponse.json(
      { error: "Authentication service error." },
      { status: 500 }
    );
  }
}
