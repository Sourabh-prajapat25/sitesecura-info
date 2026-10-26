/**
 * Sanitization and security validation utilities for inputs, files, and spreadsheets.
 */

/**
 * Neutralizes spreadsheet formula injection (CSV/Excel/Google Sheets injection).
 * If a value starts with '=', '+', '-', '@', tab, or carriage return, it prepends a single quote.
 */
export function sanitizeForSpreadsheet(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value).trim();
  if (str.length === 0) {
    return "";
  }

  // Dangerous leading formula trigger characters
  const dangerousChars = ["=", "+", "-", "@", "\t", "\r"];
  if (dangerousChars.some((char) => str.startsWith(char))) {
    // Prepend single quote to force spreadsheet programs to treat it as plain text
    return `'${str}`;
  }

  return str;
}

/**
 * Validates whether an uploaded file buffer is genuinely a PDF by checking
 * the file signature (magic bytes: %PDF- / 0x25 0x50 0x44 0x46).
 */
export function isPdfBuffer(buffer: Buffer | Uint8Array): boolean {
  if (!buffer || buffer.length < 5) {
    return false;
  }
  // %PDF in ASCII is [0x25, 0x50, 0x44, 0x46]
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  );
}

/**
 * Sanitizes an intern ID or string to only alphanumeric characters and hyphens.
 */
export function sanitizeIdentifier(input: string): string {
  if (!input) return "";
  return input.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

/**
 * Normalizes and validates an email address.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  // RFC 5322 compliant regex for practical email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates a phone number with reasonable flexibility for international formats (+1234567890).
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-().]/g, "");
  // Must be between 7 and 16 digits, optionally starting with +
  return /^\+?[0-9]{7,16}$/.test(cleaned);
}

/**
 * Validates an optional URL ensuring it uses http/https.
 */
export function isValidUrl(urlString?: string): boolean {
  if (!urlString || urlString.trim() === "") return true; // Optional field
  try {
    const url = new URL(urlString.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
