import fs from "fs";
import path from "path";
import { InternRecord, InternshipStatus, StorageMode, INTERN_ROLES } from "@/types/intern";
import { getGoogleSheetsClient } from "@/lib/google/client";
import { sanitizeForSpreadsheet } from "@/lib/sanitizer";
import { getStorageMode } from "@/lib/storage/drive-store";

const DATA_DIR = path.join(process.cwd(), ".data");
const INTERNS_FILE = path.join(DATA_DIR, "interns.json");
const IDEMPOTENCY_FILE = path.join(DATA_DIR, "idempotency.json");

export const SHEET_NAME = "Interns";
export const SHEET_HEADERS = [
  "Intern ID",
  "Registration Timestamp (UTC)",
  "Full Name",
  "Email",
  "Phone",
  "City",
  "State",
  "Role",
  "Internship Start Date",
  "Internship End Date",
  "LinkedIn URL",
  "Instagram URL",
  "Other Social URL",
  "Portfolio/GitHub URL",
  "College",
  "Course/Year",
  "Resume Drive File ID",
  "Resume Drive Link",
  "Status",
  "Certificate Number",
  "Certificate Drive File ID",
  "Certificate Drive Link",
  "Certificate Issue Date",
  "HR Notes",
  "Created By",
  "Last Updated Timestamp",
];

// In-Memory Test Store
let testRecords: InternRecord[] = [];
let testIdempotencyMap = new Map<string, string>();

export function resetTestStore(): void {
  testRecords = [];
  testIdempotencyMap.clear();
}

// In-Memory Cache for Sheets data (short-lived TTL: 10 seconds)
interface CacheEntry {
  data: InternRecord[];
  timestamp: number;
}
let sheetsCache: CacheEntry | null = null;
const CACHE_TTL_MS = 10 * 1000;

export function invalidateCache(): void {
  sheetsCache = null;
}

function ensureDataFile() {
  if (getStorageMode() === "test") return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(INTERNS_FILE)) {
    fs.writeFileSync(INTERNS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
  if (!fs.existsSync(IDEMPOTENCY_FILE)) {
    fs.writeFileSync(IDEMPOTENCY_FILE, JSON.stringify({}, null, 2), "utf-8");
  }
}

/**
 * Transforms an InternRecord into an array of 26 sanitized values matching the Google Sheet columns.
 */
export function recordToSheetRow(record: InternRecord): string[] {
  return [
    sanitizeForSpreadsheet(record.id),
    sanitizeForSpreadsheet(record.registrationTimestamp),
    sanitizeForSpreadsheet(record.fullName),
    sanitizeForSpreadsheet(record.email),
    sanitizeForSpreadsheet(record.phone),
    sanitizeForSpreadsheet(record.city),
    sanitizeForSpreadsheet(record.state),
    sanitizeForSpreadsheet(record.customRole || record.role),
    sanitizeForSpreadsheet(record.startDate),
    sanitizeForSpreadsheet(record.endDate),
    sanitizeForSpreadsheet(record.linkedinUrl || ""),
    sanitizeForSpreadsheet(record.instagramUrl || ""),
    sanitizeForSpreadsheet(record.otherSocialUrl || ""),
    sanitizeForSpreadsheet(record.portfolioUrl || ""),
    sanitizeForSpreadsheet(record.college || ""),
    sanitizeForSpreadsheet(record.courseYear || ""),
    sanitizeForSpreadsheet(record.resumeDriveFileId || ""),
    sanitizeForSpreadsheet(record.resumeDriveLink || ""),
    sanitizeForSpreadsheet(record.status),
    sanitizeForSpreadsheet(record.certificateNumber || ""),
    sanitizeForSpreadsheet(record.certificateDriveFileId || ""),
    sanitizeForSpreadsheet(record.certificateDriveLink || ""),
    sanitizeForSpreadsheet(record.certificateIssueDate || ""),
    sanitizeForSpreadsheet(record.hrNotes || ""),
    sanitizeForSpreadsheet(record.createdBy),
    sanitizeForSpreadsheet(record.lastUpdatedTimestamp),
  ];
}

/**
 * Parses a row array from Google Sheets back into an InternRecord.
 */
export function sheetRowToRecord(row: any[]): InternRecord {
  const unescape = (val?: any): string => {
    if (val === null || val === undefined) return "";
    const str = String(val).trim();
    return str.startsWith("'") ? str.slice(1) : str;
  };

  const id = unescape(row[0]);
  const registrationTimestamp = unescape(row[1]) || new Date().toISOString();
  const fullName = unescape(row[2]);
  const email = unescape(row[3]);
  const phone = unescape(row[4]);
  const city = unescape(row[5]);
  const state = unescape(row[6]);
  const rawRole = unescape(row[7]);
  const isStandardRole = (INTERN_ROLES as readonly string[]).includes(rawRole);
  const role = isStandardRole ? rawRole : "Other";
  const customRole = isStandardRole ? undefined : rawRole;
  const startDate = unescape(row[8]);
  const endDate = unescape(row[9]);
  const linkedinUrl = unescape(row[10]);
  const instagramUrl = unescape(row[11]);
  const otherSocialUrl = unescape(row[12]);
  const portfolioUrl = unescape(row[13]);
  const college = unescape(row[14]);
  const courseYear = unescape(row[15]);
  const resumeDriveFileId = unescape(row[16]);
  const resumeDriveLink = unescape(row[17]);
  const status = (unescape(row[18]) as InternshipStatus) || "Registered";
  const certificateNumber = unescape(row[19]);
  const certificateDriveFileId = unescape(row[20]);
  const certificateDriveLink = unescape(row[21]);
  const certificateIssueDate = unescape(row[22]);
  const hrNotes = unescape(row[23]);
  const createdBy = unescape(row[24]) || "hr_admin";
  const lastUpdatedTimestamp = unescape(row[25]) || registrationTimestamp;

  return {
    id,
    registrationTimestamp,
    fullName,
    email,
    phone,
    city,
    state,
    role,
    customRole: customRole || undefined,
    startDate,
    endDate,
    linkedinUrl: linkedinUrl || undefined,
    instagramUrl: instagramUrl || undefined,
    otherSocialUrl: otherSocialUrl || undefined,
    portfolioUrl: portfolioUrl || undefined,
    college: college || undefined,
    courseYear: courseYear || undefined,
    resumeDriveFileId: resumeDriveFileId || undefined,
    resumeDriveLink: resumeDriveLink || undefined,
    status,
    certificateNumber: certificateNumber || undefined,
    certificateDriveFileId: certificateDriveFileId || undefined,
    certificateDriveLink: certificateDriveLink || undefined,
    certificateIssueDate: certificateIssueDate || undefined,
    hrNotes: hrNotes || undefined,
    createdBy,
    lastUpdatedTimestamp,
    informedConsent: true,
    sheetsSyncStatus: "synced",
  };
}

/**
 * Verifies that the Google Spreadsheet and `Interns` sheet exist and are accessible.
 */
export async function verifySpreadsheetSetup(): Promise<{
  ok: boolean;
  message: string;
  sheetName: string;
  rowCount: number;
}> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) {
    return {
      ok: false,
      message: "Google Sheets credentials or GOOGLE_SHEET_ID are not configured.",
      sheetName: SHEET_NAME,
      rowCount: 0,
    };
  }

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = meta.data.sheets?.some(
      (s) => s.properties?.title === SHEET_NAME
    );

    if (!sheetExists) {
      // Auto-create the Interns worksheet if missing
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: SHEET_NAME },
              },
            },
          ],
        },
      });

      // Write header row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:Z1`,
        valueInputOption: "RAW",
        requestBody: { values: [SHEET_HEADERS] },
      });

      return {
        ok: true,
        message: `Worksheet '${SHEET_NAME}' created with headers.`,
        sheetName: SHEET_NAME,
        rowCount: 1,
      };
    }

    // Verify row count
    const rowsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:A`,
    });
    const rowCount = rowsRes.data.values?.length || 0;

    return {
      ok: true,
      message: `Worksheet '${SHEET_NAME}' verified successfully.`,
      sheetName: SHEET_NAME,
      rowCount,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message || "Failed to access Google Spreadsheet.",
      sheetName: SHEET_NAME,
      rowCount: 0,
    };
  }
}

/**
 * Reads all intern records according to active storage mode.
 */
export async function getAllInterns(): Promise<InternRecord[]> {
  const mode = getStorageMode();

  if (mode === "test") {
    return [...testRecords];
  }

  // Check Google Sheets in production or if configured
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (sheets && spreadsheetId) {
    const now = Date.now();
    if (sheetsCache && now - sheetsCache.timestamp < CACHE_TTL_MS) {
      return sheetsCache.data;
    }

    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET_NAME}!A2:Z`, // Skip header row
      });

      const rows = res.data.values || [];
      const records = rows
        .filter((r) => r.length > 0 && r[0]) // Filter empty rows
        .map(sheetRowToRecord);

      sheetsCache = { data: records, timestamp: now };
      return records;
    } catch (error: any) {
      console.error("[SiteSecura Sheets] Error reading records:", error?.message || error);
      if (mode === "production") {
        throw new Error(
          `Production storage error: Failed to read from Google Sheets register: ${error?.message || "Unknown error"}`
        );
      }
    }
  }

  // In production, we must NOT silently read local fallback files!
  if (mode === "production") {
    throw new Error(
      "Production configuration error: GOOGLE_SHEET_ID and Google credentials must be configured."
    );
  }

  // Development mode local file fallback
  ensureDataFile();
  try {
    const raw = fs.readFileSync(INTERNS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Finds an intern record by Intern ID.
 */
export async function getInternById(id: string): Promise<InternRecord | null> {
  if (!id) return null;
  const target = id.trim().toUpperCase();
  const all = await getAllInterns();
  return all.find((item) => item.id.toUpperCase() === target) || null;
}

/**
 * Finds an intern record by Email Address (for duplicate email prevention).
 */
export async function getInternByEmail(email: string): Promise<InternRecord | null> {
  if (!email) return null;
  const target = email.trim().toLowerCase();
  const all = await getAllInterns();
  return all.find((item) => item.email.toLowerCase() === target) || null;
}

/**
 * Finds an intern record by Certificate Number.
 */
export async function getInternByCertificateNumber(certNo: string): Promise<InternRecord | null> {
  if (!certNo) return null;
  const target = certNo.trim().toUpperCase();
  const all = await getAllInterns();
  return all.find((item) => item.certificateNumber?.toUpperCase() === target) || null;
}

/**
 * Checks if an intern ID already exists in the store (for collision avoidance).
 */
export async function internIdExists(id: string): Promise<boolean> {
  const intern = await getInternById(id);
  return Boolean(intern);
}

/**
 * Checks if an idempotency key was previously processed.
 */
export async function getIdempotencyRecord(key?: string): Promise<string | null> {
  if (!key) return null;
  const mode = getStorageMode();

  if (mode === "test") {
    return testIdempotencyMap.get(key) || null;
  }

  ensureDataFile();
  try {
    const raw = fs.readFileSync(IDEMPOTENCY_FILE, "utf-8");
    const map = JSON.parse(raw);
    return map[key] || null;
  } catch {
    return null;
  }
}

/**
 * Records an idempotency key to prevent double submissions.
 */
export async function setIdempotencyRecord(key: string, internId: string): Promise<void> {
  if (!key) return;
  const mode = getStorageMode();

  if (mode === "test") {
    testIdempotencyMap.set(key, internId);
    return;
  }

  ensureDataFile();
  try {
    const raw = fs.readFileSync(IDEMPOTENCY_FILE, "utf-8");
    const map = JSON.parse(raw);
    map[key] = internId;
    fs.writeFileSync(IDEMPOTENCY_FILE, JSON.stringify(map, null, 2), "utf-8");
  } catch (error) {
    console.error("[SiteSecura Store] Failed to save idempotency record:", error);
  }
}

/**
 * Appends a row to Google Sheets.
 */
async function appendRowToGoogleSheet(record: InternRecord): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) {
    throw new Error("Google Sheets client or GOOGLE_SHEET_ID is missing.");
  }

  // Ensure header row exists on first write
  try {
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:Z1`,
    });
    if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:Z1`,
        valueInputOption: "RAW",
        requestBody: { values: [SHEET_HEADERS] },
      });
    }
  } catch {
    // Attempt append directly
  }

  const row = recordToSheetRow(record);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });

  invalidateCache();
}

/**
 * Updates a row in Google Sheets by Intern ID.
 */
async function updateRowInGoogleSheet(record: InternRecord): Promise<boolean> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) return false;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:A`,
    });

    const rows = res.data.values || [];
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === record.id) {
        rowIndex = i + 1; // 1-based index in sheets
        break;
      }
    }

    if (rowIndex > 0) {
      const updatedRow = recordToSheetRow(record);
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A${rowIndex}:Z${rowIndex}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [updatedRow],
        },
      });
      invalidateCache();
      return true;
    }
    return false;
  } catch (error: any) {
    console.error(`[SiteSecura Sheets] Failed to update row for ${record.id}:`, error?.message || error);
    return false;
  }
}

/**
 * Creates and permanently stores a new intern record.
 * In production, writes to Google Sheets and fails if persistent write fails.
 */
export async function createIntern(record: InternRecord): Promise<InternRecord> {
  const mode = getStorageMode();

  if (mode === "test") {
    testRecords.push(record);
    return record;
  }

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (mode === "production") {
    if (!sheets || !spreadsheetId) {
      throw new Error(
        "Production storage error: GOOGLE_SHEET_ID and Google credentials are required to save records durably."
      );
    }
    // Must write to Google Sheets
    await appendRowToGoogleSheet(record);
    record.sheetsSyncStatus = "synced";

    // Cache locally if writable
    try {
      ensureDataFile();
      const raw = fs.readFileSync(INTERNS_FILE, "utf-8");
      const local = JSON.parse(raw);
      local.push(record);
      fs.writeFileSync(INTERNS_FILE, JSON.stringify(local, null, 2), "utf-8");
    } catch {
      // Non-fatal
    }

    return record;
  }

  // Development mode
  if (sheets && spreadsheetId) {
    try {
      await appendRowToGoogleSheet(record);
      record.sheetsSyncStatus = "synced";
    } catch (err: any) {
      console.warn("[SiteSecura Sheets] Could not write to Sheets in development:", err?.message || err);
      record.sheetsSyncStatus = "failed";
    }
  }

  ensureDataFile();
  try {
    const raw = fs.readFileSync(INTERNS_FILE, "utf-8");
    const all = JSON.parse(raw);
    all.push(record);
    fs.writeFileSync(INTERNS_FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[SiteSecura Store] Development write failed:", err?.message || err);
  }

  return record;
}

/**
 * Updates an existing intern record by ID.
 */
export async function updateIntern(
  id: string,
  updates: Partial<InternRecord>,
  actor: string = "hr_admin"
): Promise<InternRecord | null> {
  const mode = getStorageMode();
  const now = new Date().toISOString();

  if (mode === "test") {
    const idx = testRecords.findIndex((i) => i.id.toUpperCase() === id.trim().toUpperCase());
    if (idx === -1) return null;
    const current = testRecords[idx];
    const auditLog = current.auditLog || [];
    auditLog.push({
      timestamp: now,
      actor,
      action: "UPDATE",
      details: Object.keys(updates).join(", "),
    });
    const updated = { ...current, ...updates, auditLog, lastUpdatedTimestamp: now };
    testRecords[idx] = updated;
    return updated;
  }

  const current = await getInternById(id);
  if (!current) return null;

  const auditLog = current.auditLog || [];
  const changesSummary: string[] = [];
  if (updates.status && updates.status !== current.status) {
    changesSummary.push(`Status changed from ${current.status} to ${updates.status}`);
  }
  if (updates.certificateNumber && updates.certificateNumber !== current.certificateNumber) {
    changesSummary.push(`Certificate issued: ${updates.certificateNumber}`);
  }
  if (updates.hrNotes !== undefined && updates.hrNotes !== current.hrNotes) {
    changesSummary.push(`HR notes updated`);
  }

  if (changesSummary.length > 0) {
    auditLog.push({
      timestamp: now,
      actor,
      action: "UPDATE",
      details: changesSummary.join("; "),
    });
  }

  const updated: InternRecord = {
    ...current,
    ...updates,
    auditLog,
    lastUpdatedTimestamp: now,
  };

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (sheets && spreadsheetId) {
    const syncSuccess = await updateRowInGoogleSheet(updated);
    updated.sheetsSyncStatus = syncSuccess ? "synced" : "failed";
  }

  // Update local file cache if in dev
  if (mode !== "production") {
    try {
      ensureDataFile();
      const raw = fs.readFileSync(INTERNS_FILE, "utf-8");
      const all: InternRecord[] = JSON.parse(raw);
      const index = all.findIndex((item) => item.id.toUpperCase() === id.trim().toUpperCase());
      if (index !== -1) {
        all[index] = updated;
        fs.writeFileSync(INTERNS_FILE, JSON.stringify(all, null, 2), "utf-8");
      }
    } catch {
      // Non-fatal
    }
  }

  invalidateCache();
  return updated;
}
