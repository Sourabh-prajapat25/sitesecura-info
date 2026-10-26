import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Readable } from "stream";
import { getGoogleDriveClient } from "@/lib/google/client";
import { StorageMode } from "@/types/intern";

const DATA_DIR = path.join(process.cwd(), ".data");
const RESUMES_DIR = path.join(DATA_DIR, "resumes");
const CERTS_DIR = path.join(DATA_DIR, "certificates");

export function getStorageMode(): StorageMode {
  if (process.env.STORAGE_MODE === "test" || process.env.NODE_ENV === "test") {
    return "test";
  }
  if (process.env.STORAGE_MODE === "development" || process.env.NODE_ENV === "development") {
    return "development";
  }
  if (process.env.STORAGE_MODE === "local") {
    return "development";
  }
  return "production";
}

// In-memory test store for test mode
const inMemoryFiles = new Map<string, Buffer>();

export function clearInMemoryFiles(): void {
  inMemoryFiles.clear();
}

function ensureDirectories() {
  if (getStorageMode() === "test") return;
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
 * In production: Uploads to private Google Drive. Does NOT silently fallback to ephemeral disk.
 * In development: Uses Drive if configured, otherwise persists to local .data/resumes.
 * In test: Uses in-memory file store.
 */
export async function storeResume(
  buffer: Buffer,
  internId: string
): Promise<UploadResult> {
  const mode = getStorageMode();

  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const safeFileName = `${internId}-resume-${randomSuffix}.pdf`;

  if (mode === "test") {
    const fileId = `test-file-${randomSuffix}`;
    inMemoryFiles.set(fileId, buffer);
    inMemoryFiles.set(safeFileName, buffer);
    return {
      fileId,
      driveLink: `https://drive.google.com/file/d/${fileId}/view`,
      localFileName: safeFileName,
    };
  }

  ensureDirectories();

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

      if (!fileId) {
        throw new Error("Google Drive API returned an empty file ID.");
      }

      // Also cache locally if disk is writable for faster streaming
      try {
        const localFilePath = path.join(RESUMES_DIR, safeFileName);
        fs.writeFileSync(localFilePath, buffer);
      } catch {
        // Ephemeral disk write failure on Vercel is non-fatal since Drive holds the durable file
      }

      return {
        fileId,
        driveLink,
        localFileName: safeFileName,
      };
    } catch (error: any) {
      console.error("[SiteSecura Drive] Resume upload error:", error?.message || error);
      if (mode === "production") {
        throw new Error(
          `Google Drive storage failed in production mode: ${error?.message || "Upload failed"}`
        );
      }
    }
  }

  // If in production and Drive is not configured or failed, do not silently fallback!
  if (mode === "production") {
    throw new Error(
      "Production storage error: GOOGLE_DRIVE_RESUME_FOLDER_ID and credentials are required for durable resume uploads."
    );
  }

  // Development mode local fallback
  const localFilePath = path.join(RESUMES_DIR, safeFileName);
  fs.writeFileSync(localFilePath, buffer);

  return {
    fileId: `local-${crypto.randomBytes(8).toString("hex")}`,
    driveLink: "",
    localFileName: safeFileName,
  };
}

/**
 * Uploads a generated PDF certificate.
 */
export async function storeCertificate(
  buffer: Buffer,
  certNumber: string
): Promise<UploadResult> {
  const mode = getStorageMode();
  const safeFileName = `${certNumber}.pdf`;

  if (mode === "test") {
    const fileId = `test-cert-${certNumber}`;
    inMemoryFiles.set(fileId, buffer);
    inMemoryFiles.set(safeFileName, buffer);
    return {
      fileId,
      driveLink: `https://drive.google.com/file/d/${fileId}/view`,
      localFileName: safeFileName,
    };
  }

  ensureDirectories();

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

      const fileId = response.data.id || "";
      const driveLink = response.data.webViewLink || "";

      try {
        const localFilePath = path.join(CERTS_DIR, safeFileName);
        fs.writeFileSync(localFilePath, buffer);
      } catch {
        // Non-fatal if local cache cannot be written
      }

      return {
        fileId,
        driveLink,
        localFileName: safeFileName,
      };
    } catch (error: any) {
      console.error("[SiteSecura Drive] Certificate upload error:", error?.message || error);
      if (mode === "production") {
        throw new Error(`Google Drive certificate storage failed: ${error?.message || "Upload failed"}`);
      }
    }
  }

  if (mode === "production") {
    throw new Error(
      "Production storage error: GOOGLE_DRIVE_CERTIFICATE_FOLDER_ID and credentials are required."
    );
  }

  const localFilePath = path.join(CERTS_DIR, safeFileName);
  fs.writeFileSync(localFilePath, buffer);

  return {
    fileId: `local-${crypto.randomBytes(8).toString("hex")}`,
    driveLink: "",
    localFileName: safeFileName,
  };
}

/**
 * Safely deletes an uploaded file from Google Drive.
 * Used for cleanup when a multi-step operation fails.
 */
export async function deleteDriveFile(fileId: string): Promise<boolean> {
  if (!fileId || fileId.startsWith("local-") || fileId.startsWith("test-")) {
    return true;
  }
  const drive = getGoogleDriveClient();
  if (!drive) return false;

  try {
    await drive.files.delete({ fileId });
    return true;
  } catch (error: any) {
    console.error(`[SiteSecura Drive] Failed to cleanup orphaned file ${fileId}:`, error?.message || error);
    return false;
  }
}

/**
 * Reads a stored resume buffer by filename or Drive file ID.
 * Prevents path traversal and checks authorization sources.
 */
export async function getResumeBuffer(
  localFileName?: string,
  driveFileId?: string
): Promise<Buffer | null> {
  const mode = getStorageMode();

  if (mode === "test") {
    if (driveFileId && inMemoryFiles.has(driveFileId)) {
      return inMemoryFiles.get(driveFileId)!;
    }
    if (localFileName && inMemoryFiles.has(localFileName)) {
      return inMemoryFiles.get(localFileName)!;
    }
    return null;
  }

  // Prevent path traversal on localFileName
  if (localFileName) {
    const sanitizedName = path.basename(localFileName);
    const localPath = path.join(RESUMES_DIR, sanitizedName);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  }

  // Fetch from Google Drive
  const drive = getGoogleDriveClient();
  if (drive && driveFileId && !driveFileId.startsWith("local-")) {
    try {
      const res = await drive.files.get(
        { fileId: driveFileId, alt: "media" },
        { responseType: "arraybuffer" }
      );
      return Buffer.from(res.data as ArrayBuffer);
    } catch (error: any) {
      console.error(`[SiteSecura Drive] Failed to download resume from Google Drive (${driveFileId}):`, error?.message || error);
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
  const mode = getStorageMode();

  if (mode === "test") {
    if (driveFileId && inMemoryFiles.has(driveFileId)) {
      return inMemoryFiles.get(driveFileId)!;
    }
    if (localFileName && inMemoryFiles.has(localFileName)) {
      return inMemoryFiles.get(localFileName)!;
    }
    return null;
  }

  if (localFileName) {
    const sanitizedName = path.basename(localFileName);
    const localPath = path.join(CERTS_DIR, sanitizedName);
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
    } catch (error: any) {
      console.error(`[SiteSecura Drive] Failed to download certificate from Google Drive (${driveFileId}):`, error?.message || error);
    }
  }

  return null;
}
