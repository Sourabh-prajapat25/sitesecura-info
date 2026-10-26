import { NextResponse } from "next/server";
import { getHrSessionFromCookies } from "@/lib/auth";
import { getStorageMode } from "@/lib/storage/drive-store";
import { verifySpreadsheetSetup } from "@/lib/storage/intern-store";
import { getGoogleDriveClient, isGoogleConfigured } from "@/lib/google/client";

export async function GET() {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized access to diagnostics endpoint." },
      { status: 401 }
    );
  }

  const mode = getStorageMode();
  const hasGcpCredentials = isGoogleConfigured();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const resumeFolderId = process.env.GOOGLE_DRIVE_RESUME_FOLDER_ID;
  const certFolderId = process.env.GOOGLE_DRIVE_CERTIFICATE_FOLDER_ID;
  const sessionSecretConfigured = Boolean(
    process.env.HR_SESSION_SECRET && process.env.HR_SESSION_SECRET.length >= 16
  );
  const passkeyConfigured = Boolean(
    process.env.HR_PORTAL_PASSKEY && process.env.HR_PORTAL_PASSKEY.length >= 8
  );

  const configStatus = {
    storageMode: mode,
    hasGcpCredentials,
    sheetIdConfigured: Boolean(sheetId),
    resumeFolderConfigured: Boolean(resumeFolderId),
    certFolderConfigured: Boolean(certFolderId),
    sessionSecretConfigured,
    passkeyConfigured,
  };

  // Test Sheets connectivity
  const sheetsResult = await verifySpreadsheetSetup();

  // Test Drive connectivity
  let driveStatus = {
    ok: false,
    message: "Google Drive is not configured.",
  };

  if (hasGcpCredentials && resumeFolderId) {
    const drive = getGoogleDriveClient();
    if (drive) {
      try {
        const folderRes = await drive.files.get({
          fileId: resumeFolderId,
          fields: "id, name, mimeType",
          supportsAllDrives: true,
        });
        driveStatus = {
          ok: true,
          message: `Drive folder verified: "${folderRes.data.name || folderRes.data.id}"`,
        };
      } catch (err: any) {
        driveStatus = {
          ok: false,
          message: `Failed to access Drive resume folder: ${err?.message || "Unknown error"}`,
        };
      }
    }
  } else if (mode === "test") {
    driveStatus = {
      ok: true,
      message: "Test in-memory drive storage active.",
    };
  }

  const isHealthy =
    mode === "test" ||
    (mode === "production"
      ? sheetsResult.ok && driveStatus.ok
      : true);

  return NextResponse.json({
    status: isHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    config: configStatus,
    sheets: sheetsResult,
    drive: driveStatus,
  });
}
