import { NextResponse } from "next/server";
import { getHrSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      role: session.role,
      expiresAt: session.exp,
    },
  });
}
