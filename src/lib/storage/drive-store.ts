import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Readable } from "stream";
import { getGoogleDriveClient } from "@/lib/google/client";

const DATA_DIR = path.join(process.cwd(), ".data");
const RESUMES_DIR = path.join(DATA_DIR, "resumes");
const CERTS_DIR = path.join(DATA_DIR, "certificates");

// Ensure local fallback directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(RESUMES_DIR)) {
    fs.mkdirSync(RESUMES_DIR, { recursive: true });
  }
  if (!fs.existsSync(CERTS_DIR)) {
    fs.mkdirSync(CERTS_DIR, { recursive: true });
  }
}

export interface UploadResult {
  fileId: string;
  driveLink: string;
  localFileName: string;
}

/**
 * Uploads a validated PDF resume.
 * Uses Google Drive if configured, otherwise persists to protected local storage.
 */
export async function storeResume(
  buffer: Buffer,
  internId: string
): Promise<UploadResult> {
  ensureDirectories();

  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const safeFileName = `${internId}-resume-${randomSuffix}.pdf`;
  const localFilePath = path.join(RESUMES_DIR, safeFileName);

  // Always write to local fallback first for reliability and quick local serving
  fs.writeFileSync(localFilePath, buffer);

  const drive = getGoogleDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_RESUME_FOLDER_ID;

  if (drive && folderId) {
    try {
      const stream = Readable.from(buffer);
      const response = await drive.files.create({
        requestBody: {
          name: safeFileName,
          parents: [folderId],
          description: `SiteSecura Internship Resume - ${internId}`,
        },
        media: {
          mimeType: "application/pdf",
          body: stream,
        },
        fields: "id, webViewLink, webContentLink",
      });

      const fileId = response.data.id || "";
      const driveLink = response.data.webViewLink || "";

      return {
        fileId,
        driveLink,
        localFileName: safeFileName,
      };
    } catch (error) {
      console.error("[SiteSecura Drive] Failed to upload resume to Google Drive:", error);
      // Fallback to local file store
    }
  }

  return {
    fileId: `local-${crypto.randomBytes(8).toString("hex")}`,
    driveLink: "",
    localFileName: safeFileName,
  };
}

/**
 * Uploads a generated PDF certificate.
 * Uses Google Drive if configured, otherwise persists to local storage.
 */
export async function storeCertificate(
  buffer: Buffer,
  certNumber: string
): Promise<UploadResult> {
  ensureDirectories();

  const safeFileName = `${certNumber}.pdf`;
  const localFilePath = path.join(CERTS_DIR, safeFileName);

  fs.writeFileSync(localFilePath, buffer);

  const drive = getGoogleDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_CERTIFICATE_FOLDER_ID;

  if (drive && folderId) {
    try {
      const stream = Readable.from(buffer);
      const response = await drive.files.create({
        requestBody: {
          name: safeFileName,
          parents: [folderId],
          description: `SiteSecura Internship Certificate - ${certNumber}`,
        },
        media: {
          mimeType: "application/pdf",
          body: stream,
        },
        fields: "id, webViewLink",
      });

      return {
        fileId: response.data.id || "",
        driveLink: response.data.webViewLink || "",
        localFileName: safeFileName,
      };
    } catch (error) {
      console.error("[SiteSecura Drive] Failed to upload certificate to Google Drive:", error);
    }
  }

  return {
    fileId: `local-${crypto.randomBytes(8).toString("hex")}`,
    driveLink: "",
    localFileName: safeFileName,
  };
}

/**
 * Reads a stored resume buffer by filename or Drive file ID.
 */
export async function getResumeBuffer(
  localFileName?: string,
  driveFileId?: string
): Promise<Buffer | null> {
  ensureDirectories();

  // Try local file first
  if (localFileName) {
    const localPath = path.join(RESUMES_DIR, localFileName);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  }

  // Try Google Drive if available
  const drive = getGoogleDriveClient();
  if (drive && driveFileId && !driveFileId.startsWith("local-")) {
    try {
      const res = await drive.files.get(
        { fileId: driveFileId, alt: "media" },
        { responseType: "arraybuffer" }
      );
      return Buffer.from(res.data as ArrayBuffer);
    } catch (error) {
      console.error("[SiteSecura Drive] Failed to download resume from Google Drive:", error);
    }
  }

  return null;
}

/**
 * Reads a stored certificate buffer by filename or Drive file ID.
 */
export async function getCertificateBuffer(
  localFileName?: string,
  driveFileId?: string
): Promise<Buffer | null> {
  ensureDirectories();

  if (localFileName) {
    const localPath = path.join(CERTS_DIR, localFileName);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  }

  const drive = getGoogleDriveClient();
  if (drive && driveFileId && !driveFileId.startsWith("local-")) {
    try {
      const res = await drive.files.get(
        { fileId: driveFileId, alt: "media" },
        { responseType: "arraybuffer" }
      );
      return Buffer.from(res.data as ArrayBuffer);
    } catch (error) {
      console.error("[SiteSecura Drive] Failed to download certificate from Google Drive:", error);
    }
  }

  return null;
}
