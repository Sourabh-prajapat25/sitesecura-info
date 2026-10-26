import { google } from "googleapis";

/**
 * Returns an authenticated Google Auth client using service account credentials
 * specified in environment variables.
 * Returns null if credentials are not configured.
 */
export function getGoogleAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    return null;
  }

  // Handle potential escaped newlines in environment variable
  const formattedKey = privateKey.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email,
    key: formattedKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
}

/**
 * Returns an authenticated Google Sheets API client, or null if unconfigured.
 */
export function getGoogleSheetsClient() {
  const auth = getGoogleAuthClient();
  if (!auth) return null;
  return google.sheets({ version: "v4", auth });
}

/**
 * Returns an authenticated Google Drive API client, or null if unconfigured.
 */
export function getGoogleDriveClient() {
  const auth = getGoogleAuthClient();
  if (!auth) return null;
  return google.drive({ version: "v3", auth });
}
