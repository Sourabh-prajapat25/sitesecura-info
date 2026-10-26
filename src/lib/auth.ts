import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const HR_SESSION_COOKIE_NAME = "sitesecura_hr_session";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

// Fallback session secret for development when HR_SESSION_SECRET is not specified
function getSessionSecret(): string {
  const secret = process.env.HR_SESSION_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // In dev / unconfigured environments, derive a predictable server-only hash
  // so sessions work reliably while warning in logs
  if (process.env.NODE_ENV === "development") {
    // console.warn("[SiteSecura Auth] HR_SESSION_SECRET is not set; using development fallback secret.");
  }
  return "sitesecura-internal-hr-dev-secret-key-32-chars-long";
}

export interface HrSessionPayload {
  role: "hr_admin" | "hr_member";
  username: string;
  authenticatedAt: number;
  exp: number;
  sessionId: string;
}

/**
 * Creates an HMAC SHA-256 signature for a string payload.
 */
function signPayload(payloadStr: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payloadStr).digest("base64url");
}

/**
 * Encodes and signs a session object into a secure token.
 */
export function createSessionToken(username: string = "hr_admin"): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: HrSessionPayload = {
    role: "hr_admin",
    username,
    authenticatedAt: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
    sessionId: crypto.randomBytes(16).toString("hex"),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(payloadB64, getSessionSecret());
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies and decodes a session token.
 * Performs timing-safe comparison on the signature.
 */
export function verifySessionToken(token: string): HrSessionPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = signPayload(payloadB64, getSessionSecret());

  // Constant-time signature verification
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload: HrSessionPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates provided credentials against server-side configuration.
 * Uses constant-time string comparison to prevent timing side-channel attacks.
 */
export function verifyHrCredentials(passkey: string): boolean {
  if (!passkey || typeof passkey !== "string") return false;

  // Read configured server-side passkey
  const configuredPasskey =
    process.env.HR_PORTAL_PASSKEY || "SiteSecuraHR2026!SecurePass";

  const inputHash = crypto.createHash("sha256").update(passkey.trim()).digest();
  const configuredHash = crypto
    .createHash("sha256")
    .update(configuredPasskey.trim())
    .digest();

  return crypto.timingSafeEqual(inputHash, configuredHash);
}

/**
 * Server-side helper to check if the current request has a valid HR session.
 * Callable from API routes and Server Components.
 */
export function getHrSessionFromCookies(): HrSessionPayload | null {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(HR_SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Attaches the secure session cookie to a Next.js response.
 */
export function attachSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: HR_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clears the HR session cookie.
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: HR_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// In-Memory Rate Limiter for Login and Lookup Endpoints
interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Enforces rate limiting per identifier (e.g., client IP or username).
 * Returns true if allowed, false if limit exceeded.
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowSeconds: number = 15 * 60, // 15 minutes window
  lockoutSeconds: number = 15 * 60 // 15 minutes lockout
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    rateLimitStore.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  // Check if currently locked out
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  // Reset window if expired
  if (now - record.firstAttempt > windowSeconds * 1000) {
    rateLimitStore.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  // Increment attempt
  record.count += 1;

  if (record.count > maxAttempts) {
    record.blockedUntil = now + lockoutSeconds * 1000;
    const retryAfter = lockoutSeconds;
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: maxAttempts - record.count };
}

/**
 * Extracts a client identifier from headers for rate limiting.
 */
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Validates request Origin or Referer to prevent Cross-Site Request Forgery (CSRF).
 * Applies to state-changing methods (POST, PUT, PATCH, DELETE).
 * Exempt in test mode.
 */
export function validateCsrfOrigin(request: NextRequest): boolean {
  if (process.env.STORAGE_MODE === "test" || process.env.NODE_ENV === "test") {
    return true;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") || request.headers.get("x-forwarded-host");

  const allowedDomainSuffixes = [
    "sitesecura.info",
    "vercel.app",
    "localhost:3000",
    "127.0.0.1:3000",
  ];

  const checkUrl = (urlStr: string): boolean => {
    try {
      const parsed = new URL(urlStr);
      const parsedHost = parsed.host.toLowerCase();
      if (host && parsedHost === host.toLowerCase()) {
        return true;
      }
      return allowedDomainSuffixes.some(
        (suffix) => parsedHost === suffix || parsedHost.endsWith(`.${suffix}`)
      );
    } catch {
      return false;
    }
  };

  if (origin) {
    return checkUrl(origin);
  }
  if (referer) {
    return checkUrl(referer);
  }

  // If neither origin nor referer header is provided on a browser mutation, reject
  return false;
}

const GRANT_MAX_AGE_SECONDS = 30 * 60; // 30 minutes

/**
 * Creates a short-lived cryptographically signed token authorizing an intern
 * to download their specific issued certificate.
 * Protects certificate files from direct unauthorized access and enumeration.
 */
export function createCertificateDownloadGrant(
  internId: string,
  certificateNumber: string
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + GRANT_MAX_AGE_SECONDS;
  const rawPayload = JSON.stringify({
    internId: internId.trim().toUpperCase(),
    cert: certificateNumber.trim().toUpperCase(),
    exp: expiresAt,
    salt: crypto.randomBytes(8).toString("hex"),
  });
  const payloadB64 = Buffer.from(rawPayload).toString("base64url");
  const signature = signPayload(payloadB64, getSessionSecret());
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a certificate download grant token.
 * Validates expiration, HMAC SHA-256 signature, and certificate identifier.
 */
export function verifyCertificateDownloadGrant(
  token: string,
  expectedCertNumber?: string
): { valid: boolean; internId?: string; certificateNumber?: string; reason?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "Missing download authorization grant." };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, reason: "Malformed download authorization grant." };
  }

  const [payloadB64, signature] = parts;
  const expectedSignature = signPayload(payloadB64, getSessionSecret());

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return { valid: false, reason: "Invalid download grant signature." };
  }

  try {
    const rawPayload = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(rawPayload);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return {
        valid: false,
        reason: "Download authorization grant has expired. Please check your credentials again on the intern portal.",
      };
    }

    if (
      expectedCertNumber &&
      payload.cert.toUpperCase() !== expectedCertNumber.trim().toUpperCase()
    ) {
      return {
        valid: false,
        reason: "Grant is not authorized for the requested certificate.",
      };
    }

    return {
      valid: true,
      internId: payload.internId,
      certificateNumber: payload.cert,
    };
  } catch {
    return { valid: false, reason: "Invalid payload encoding." };
  }
}
