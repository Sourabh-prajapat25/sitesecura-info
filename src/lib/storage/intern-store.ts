import fs from "fs";
import path from "path";
import { InternRecord, InternshipStatus } from "@/types/intern";
import { getGoogleSheetsClient } from "@/lib/google/client";
import { sanitizeForSpreadsheet } from "@/lib/sanitizer";

const DATA_DIR = path.join(process.cwd(), ".data");
const INTERNS_FILE = path.join(DATA_DIR, "interns.json");
const IDEMPOTENCY_FILE = path.join(DATA_DIR, "idempotency.json");

const SHEET_NAME = "Interns";
const SHEET_HEADERS = [
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

function ensureDataFile() {
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
 * Loads all intern records from persistent store.
 */
export function getAllInterns(): InternRecord[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(INTERNS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Saves all intern records to local persistent store.
 */
function saveAllInterns(records: InternRecord[]): void {
  ensureDataFile();
  fs.writeFileSync(INTERNS_FILE, JSON.stringify(records, null, 2), "utf-8");
}

/**
 * Finds an intern record by Intern ID.
 */
export function getInternById(id: string): InternRecord | null {
  if (!id) return null;
  const target = id.trim().toUpperCase();
  const all = getAllInterns();
  return all.find((item) => item.id.toUpperCase() === target) || null;
}

/**
 * Finds an intern record by Certificate Number.
 */
export function getInternByCertificateNumber(certNo: string): InternRecord | null {
  if (!certNo) return null;
  const target = certNo.trim().toUpperCase();
  const all = getAllInterns();
  return all.find((item) => item.certificateNumber?.toUpperCase() === target) || null;
}

/**
 * Checks if an intern ID already exists in the store (for collision avoidance).
 */
export function internIdExists(id: string): boolean {
  return Boolean(getInternById(id));
}

/**
 * Checks if an idempotency key was previously processed, returning the cached intern ID.
 */
export function getIdempotencyRecord(key?: string): string | null {
  if (!key) return null;
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
export function setIdempotencyRecord(key: string, internId: string): void {
  if (!key) return;
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
 * Transforms an InternRecord into an array of 26 sanitized values matching the Google Sheet columns.
 */
function recordToSheetRow(record: InternRecord): string[] {
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
 * Appends an intern row to Google Sheets if configured.
 */
async function appendToGoogleSheet(record: InternRecord): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) {
    return; // Google Sheets not configured in this environment
  }

  try {
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
      // If sheet doesn't exist or error checking header, attempt append
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
  } catch (error) {
    console.error("[SiteSecura Sheets] Failed to append record to Google Sheets:", error);
    // Don't crash the server: local primary record is already safely saved!
  }
}

/**
 * Updates a row in Google Sheets if configured.
 */
async function syncUpdateToGoogleSheet(record: InternRecord): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) return;

  try {
    // Look up row with matching Intern ID in Column A
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
    }
  } catch (error) {
    console.error("[SiteSecura Sheets] Failed to update row in Google Sheets:", error);
  }
}

/**
 * Creates and permanently stores a new intern record.
 */
export async function createIntern(record: InternRecord): Promise<InternRecord> {
  const all = getAllInterns();
  all.push(record);
  saveAllInterns(all);

  // Synchronize to Google Sheets
  await appendToGoogleSheet(record);

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
  const all = getAllInterns();
  const index = all.findIndex((item) => item.id.toUpperCase() === id.trim().toUpperCase());

  if (index === -1) return null;

  const current = all[index];
  const now = new Date().toISOString();

  // Audit trail
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

  all[index] = updated;
  saveAllInterns(all);

  // Synchronize to Google Sheets
  await syncUpdateToGoogleSheet(updated);

  return updated;
}
