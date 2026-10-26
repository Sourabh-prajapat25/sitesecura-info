import crypto from "crypto";

const ALPHANUMERIC_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Omits visually ambiguous 0, O, 1, I

/**
 * Generates a cryptographically random uppercase alphanumeric string of given length.
 */
export function generateRandomCode(length: number = 6): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    const index = bytes[i] % ALPHANUMERIC_CHARS.length;
    result += ALPHANUMERIC_CHARS[index];
  }
  return result;
}

/**
 * Generates an Intern ID following the format: SS-INT-YYYY-XXXXXX
 * E.g., SS-INT-2026-K9P2X7
 */
export function generateInternId(year?: number): string {
  const targetYear = year || new Date().getUTCFullYear();
  const suffix = generateRandomCode(6);
  return `SS-INT-${targetYear}-${suffix}`;
}

/**
 * Generates a Certificate Number following the format: SS-CERT-YYYY-XXXXXX
 * E.g., SS-CERT-2026-B8M4Q2
 */
export function generateCertificateNumber(year?: number): string {
  const targetYear = year || new Date().getUTCFullYear();
  const suffix = generateRandomCode(6);
  return `SS-CERT-${targetYear}-${suffix}`;
}

/**
 * Validates whether a given string matches the required Intern ID structure.
 */
export function isValidInternIdFormat(id: string): boolean {
  if (!id) return false;
  return /^SS-INT-\d{4}-[A-Z0-9]{6}$/.test(id.trim().toUpperCase());
}

/**
 * Validates whether a given string matches the Certificate Number structure.
 */
export function isValidCertificateNumberFormat(certNo: string): boolean {
  if (!certNo) return false;
  return /^SS-CERT-\d{4}-[A-Z0-9]{6}$/.test(certNo.trim().toUpperCase());
}
