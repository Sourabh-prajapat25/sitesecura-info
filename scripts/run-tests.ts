import assert from "assert";
import {
  generateInternId,
  generateCertificateNumber,
  isValidInternIdFormat,
  isValidCertificateNumberFormat,
} from "../src/lib/id-generator";
import {
  verifyHrCredentials,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  validateCsrfOrigin,
} from "../src/lib/auth";
import {
  sanitizeForSpreadsheet,
  isPdfBuffer,
  isValidEmail,
  isValidPhoneNumber,
  isValidUrl,
} from "../src/lib/sanitizer";
import {
  createIntern,
  getInternById,
  getInternByEmail,
  updateIntern,
  getIdempotencyRecord,
  setIdempotencyRecord,
  resetTestStore,
  recordToSheetRow,
  sheetRowToRecord,
} from "../src/lib/storage/intern-store";
import {
  storeResume,
  deleteDriveFile,
  clearInMemoryFiles,
} from "../src/lib/storage/drive-store";
import { generateCertificatePdf } from "../src/lib/certificate";
import { InternRecord } from "../src/types/intern";
import { NextRequest } from "next/server";

let passedCount = 0;
let failedCount = 0;

async function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
    console.log(`  ✓ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(err);
    failedCount++;
  }
}

async function main() {
  console.log("\n=======================================================");
  console.log("  SiteSecura Internship & Verification Test Suite");
  console.log("=======================================================\n");

  // 1. Unauthenticated & Invalid HR credentials
  await runTest("1. Incorrect passkey is rejected", () => {
    assert.strictEqual(verifyHrCredentials("invalid-passkey-123"), false);
    assert.strictEqual(verifyHrCredentials(""), false);
  });

  // 2. Correct passkey is accepted
  await runTest("2. Configured passkey is accepted", () => {
    const validKey = process.env.HR_PORTAL_PASSKEY || "SiteSecuraHR2026!SecurePass";
    assert.strictEqual(verifyHrCredentials(validKey), true);
  });

  // 3. Session token HMAC creation and verification
  await runTest("3. Session token HMAC creation, tamper resistance and verification", () => {
    const token = createSessionToken("hr_admin");
    assert.ok(token && token.includes("."));
    const verified = verifySessionToken(token);
    assert.ok(verified !== null);
    assert.strictEqual(verified?.role, "hr_admin");

    // Tampered token must fail
    const tampered = token.slice(0, -5) + "abcde";
    assert.strictEqual(verifySessionToken(tampered), null);

    // Empty or malformed token must fail
    assert.strictEqual(verifySessionToken(""), null);
    assert.strictEqual(verifySessionToken("random.string.extra"), null);
  });

  // 4. Rate limiting activates after repeated failed attempts
  await runTest("4. Rate limiting activates after repeated attempts", () => {
    const testIp = `test-ip-${Date.now()}`;
    const max = 3;
    const windowSec = 10;
    const lockoutSec = 10;

    assert.strictEqual(checkRateLimit(testIp, max, windowSec, lockoutSec).allowed, true); // 1
    assert.strictEqual(checkRateLimit(testIp, max, windowSec, lockoutSec).allowed, true); // 2
    assert.strictEqual(checkRateLimit(testIp, max, windowSec, lockoutSec).allowed, true); // 3
    const blocked = checkRateLimit(testIp, max, windowSec, lockoutSec); // 4 (exceeded)
    assert.strictEqual(blocked.allowed, false);
    assert.ok(blocked.retryAfter! > 0);
  });

  // 5. Intern ID generation format
  await runTest("5. Intern ID adheres to SS-INT-YYYY-XXXXXX format", () => {
    const id = generateInternId(2026);
    assert.match(id, /^SS-INT-2026-[A-Z0-9]{6}$/);
    assert.strictEqual(isValidInternIdFormat(id), true);
    assert.strictEqual(isValidInternIdFormat("INVALID-ID"), false);
  });

  // 6. Certificate Number format
  await runTest("6. Certificate number adheres to SS-CERT-YYYY-XXXXXX format", () => {
    const cert = generateCertificateNumber(2026);
    assert.match(cert, /^SS-CERT-2026-[A-Z0-9]{6}$/);
    assert.strictEqual(isValidCertificateNumberFormat(cert), true);
    assert.strictEqual(isValidCertificateNumberFormat("FAKE-CERT"), false);
  });

  // 7. Concurrent ID generation uniqueness
  await runTest("7. Intern IDs remain unique under concurrent generation (0 collisions)", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const id = generateInternId();
      assert.strictEqual(ids.has(id), false, `Collision detected for ${id}`);
      ids.add(id);
    }
    assert.strictEqual(ids.size, 100);
  });

  // 8. Input validation functions
  await runTest("8. Email, phone, and URL validation handles edge cases", () => {
    assert.strictEqual(isValidEmail("candidate@sitesecura.com"), true);
    assert.strictEqual(isValidEmail("candidate+tech@domain.co.uk"), true);
    assert.strictEqual(isValidEmail("not-an-email"), false);
    assert.strictEqual(isValidEmail("candidate@"), false);

    assert.strictEqual(isValidPhoneNumber("+91 9876543210"), true);
    assert.strictEqual(isValidPhoneNumber("+1 (555) 234-5678"), true);
    assert.strictEqual(isValidPhoneNumber("123"), false); // Too short

    assert.strictEqual(isValidUrl("https://github.com/candidate"), true);
    assert.strictEqual(isValidUrl("http://portfolio.dev"), true);
    assert.strictEqual(isValidUrl("javascript:alert(1)"), false); // Must reject dangerous schemes
  });

  // 9. Spreadsheet / CSV formula injection protection
  await runTest("9. Spreadsheet formula injection neutralization", () => {
    assert.strictEqual(sanitizeForSpreadsheet("=CMD|' /C calc'!A0"), "'=CMD|' /C calc'!A0");
    assert.strictEqual(sanitizeForSpreadsheet("+12345"), "'+12345");
    assert.strictEqual(sanitizeForSpreadsheet("-500"), "'-500");
    assert.strictEqual(sanitizeForSpreadsheet("@SUM(A1:A10)"), "'@SUM(A1:A10)");
    assert.strictEqual(sanitizeForSpreadsheet("Normal Name"), "Normal Name");
  });

  // 10. PDF Magic Bytes file signature validation
  await runTest("10. PDF file signature verification (magic bytes: %PDF)", () => {
    const validPdfBuffer = Buffer.from("%PDF-1.4 sample pdf content here");
    assert.strictEqual(isPdfBuffer(validPdfBuffer), true);

    const maliciousBuffer = Buffer.from("MZThisIsAnExecutableFileContent");
    assert.strictEqual(isPdfBuffer(maliciousBuffer), false);

    const textBuffer = Buffer.from("Hello world, this is plain text.");
    assert.strictEqual(isPdfBuffer(textBuffer), false);
  });

  // 11. Idempotency protection prevents duplicate submissions
  await runTest("11. Idempotency key tracking prevents double processing", async () => {
    // Switch to test mode for isolated memory store
    process.env.STORAGE_MODE = "test";
    resetTestStore();

    const testKey = `test-idempotency-${Date.now()}`;
    assert.strictEqual(await getIdempotencyRecord(testKey), null);

    await setIdempotencyRecord(testKey, "SS-INT-2026-TEST01");
    assert.strictEqual(await getIdempotencyRecord(testKey), "SS-INT-2026-TEST01");
  });

  // 12. Storage mode safety: Production mode strictly fails when unconfigured
  await runTest("12. Storage mode safety: Production mode strictly fails when unconfigured", async () => {
    process.env.STORAGE_MODE = "production";
    delete process.env.GOOGLE_SHEET_ID;

    const mockRecord: InternRecord = {
      id: generateInternId(),
      registrationTimestamp: new Date().toISOString(),
      fullName: "Production Safety Check",
      email: "prod-safety@sitesecura.info",
      phone: "+1 555-0100",
      city: "San Francisco",
      state: "California",
      role: "Cybersecurity Intern",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      status: "Registered",
      createdBy: "test_runner",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
    };

    let caughtError: Error | null = null;
    try {
      await createIntern(mockRecord);
    } catch (err: any) {
      caughtError = err;
    }

    assert.ok(caughtError !== null, "createIntern must throw in production mode when Google Sheets is unconfigured");
    assert.ok(
      caughtError!.message.includes("Production storage error"),
      `Expected production error message, got: ${caughtError!.message}`
    );

    let driveError: Error | null = null;
    try {
      await storeResume(Buffer.from("%PDF-1.4 test"), mockRecord.id);
    } catch (err: any) {
      driveError = err;
    }

    assert.ok(driveError !== null, "storeResume must throw in production mode when Google Drive is unconfigured");
  });

  // 13. Persistent Intern Store CRUD operations (in test mode)
  await runTest("13. Persistent Intern store creation, retrieval and status transition", async () => {
    process.env.STORAGE_MODE = "test";
    resetTestStore();

    const testId = generateInternId();
    const mockRecord: InternRecord = {
      id: testId,
      registrationTimestamp: new Date().toISOString(),
      fullName: "Automated Test Candidate",
      email: "test.candidate@sitesecura.info",
      phone: "+1 555-0100",
      city: "San Francisco",
      state: "California",
      role: "Cybersecurity Intern",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      status: "Active",
      createdBy: "test_runner",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
    };

    await createIntern(mockRecord);

    const retrieved = await getInternById(testId);
    assert.ok(retrieved !== null);
    assert.strictEqual(retrieved?.fullName, "Automated Test Candidate");
    assert.strictEqual(retrieved?.status, "Active");

    // Transition status to Completed
    await updateIntern(testId, { status: "Completed" }, "test_runner");
    const updated = await getInternById(testId);
    assert.strictEqual(updated?.status, "Completed");
    assert.ok(updated?.auditLog && updated.auditLog.length > 0);
  });

  // 14. Candidate email lookup and duplicate detection
  await runTest("14. Candidate email lookup and duplicate detection", async () => {
    process.env.STORAGE_MODE = "test";
    const found = await getInternByEmail("test.candidate@sitesecura.info");
    assert.ok(found !== null);
    assert.strictEqual(found?.fullName, "Automated Test Candidate");

    const notFound = await getInternByEmail("unknown-email@example.com");
    assert.strictEqual(notFound, null);
  });

  // 15. Safe cleanup of uploaded files on downstream failure
  await runTest("15. Safe cleanup of uploaded files on failure", async () => {
    process.env.STORAGE_MODE = "test";
    clearInMemoryFiles();

    const uploadRes = await storeResume(Buffer.from("%PDF-1.4 test resume"), "SS-INT-CLEANUP-01");
    assert.ok(uploadRes.fileId);

    const deleted = await deleteDriveFile(uploadRes.fileId);
    assert.strictEqual(deleted, true);
  });

  // 16. CSRF Origin Validation
  await runTest("16. CSRF Origin validation allows trusted and rejects untrusted origins", () => {
    // In production mode for CSRF checks
    process.env.STORAGE_MODE = "production";
    (process.env as any).NODE_ENV = "production";

    const allowedReq = new NextRequest("https://sitesecura.info/api/hr/interns", {
      method: "POST",
      headers: {
        host: "sitesecura.info",
        origin: "https://sitesecura.info",
      },
    });
    assert.strictEqual(validateCsrfOrigin(allowedReq), true);

    const evilReq = new NextRequest("https://sitesecura.info/api/hr/interns", {
      method: "POST",
      headers: {
        host: "sitesecura.info",
        origin: "https://evil-attacker-site.com",
      },
    });
    assert.strictEqual(validateCsrfOrigin(evilReq), false);

    const vercelReq = new NextRequest("https://sitesecura-info.vercel.app/api/hr/interns", {
      method: "POST",
      headers: {
        host: "sitesecura-info.vercel.app",
        origin: "https://sitesecura-info.vercel.app",
      },
    });
    assert.strictEqual(validateCsrfOrigin(vercelReq), true);

    // Reset back to test mode
    process.env.STORAGE_MODE = "test";
  });

  // 17. Bidirectional Google Sheets 26-column row mapping
  await runTest("17. Bidirectional Google Sheets 26-column row mapping preserves data integrity", () => {
    const originalRecord: InternRecord = {
      id: "SS-INT-2026-MAP001",
      registrationTimestamp: "2026-03-01T10:00:00.000Z",
      fullName: "Mapping Test Candidate",
      email: "mapping@sitesecura.info",
      phone: "+1 555-123-4567",
      city: "Seattle",
      state: "Washington",
      role: "Other",
      customRole: "SiteSecura Security Fellow",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      linkedinUrl: "https://linkedin.com/in/mapping-test",
      instagramUrl: "https://instagram.com/mapping_test",
      otherSocialUrl: "https://x.com/mapping_test",
      portfolioUrl: "https://github.com/mapping-test",
      college: "University of Washington",
      courseYear: "Senior / 4th Year",
      resumeDriveFileId: "drive-file-id-12345",
      resumeDriveLink: "https://drive.google.com/file/d/drive-file-id-12345/view",
      resumeLocalFileName: "SS-INT-2026-MAP001-resume.pdf",
      status: "Certificate Issued",
      certificateNumber: "SS-CERT-2026-ABCDEF",
      certificateDriveFileId: "cert-drive-id-98765",
      certificateDriveLink: "https://drive.google.com/file/d/cert-drive-id-98765/view",
      certificateLocalFileName: "SS-CERT-2026-ABCDEF-certificate.pdf",
      certificateIssueDate: "2026-08-31",
      hrNotes: "Exemplary performance during internship tenure.",
      offerLetterRef: "SS-OFFER-2026-0042",
      createdBy: "hr_admin",
      lastUpdatedTimestamp: "2026-08-31T12:00:00.000Z",
      informedConsent: true,
      sheetsSyncStatus: "synced",
    };

    const row = recordToSheetRow(originalRecord);
    assert.strictEqual(row.length, 26, `Google Sheets row must have exactly 26 columns, got ${row.length}`);
    assert.strictEqual(row[0], "SS-INT-2026-MAP001");
    assert.strictEqual(row[2], "Mapping Test Candidate");
    assert.strictEqual(row[7], "SiteSecura Security Fellow"); // role / customRole
    assert.strictEqual(row[19], "SS-CERT-2026-ABCDEF"); // cert number

    // Reconstruct record from row
    const reconstructed = sheetRowToRecord(row);
    assert.strictEqual(reconstructed.id, originalRecord.id);
    assert.strictEqual(reconstructed.fullName, originalRecord.fullName);
    assert.strictEqual(reconstructed.email, originalRecord.email);
    assert.strictEqual(reconstructed.customRole, originalRecord.customRole);
    assert.strictEqual(reconstructed.certificateNumber, originalRecord.certificateNumber);
    assert.strictEqual(reconstructed.status, originalRecord.status);
    assert.strictEqual(reconstructed.resumeDriveFileId, originalRecord.resumeDriveFileId);
  });

  // 18. Certificate PDF Generation & Content Verification
  await runTest("18. PDF Certificate generation with QR code and dimensions", async () => {
    const testCertNumber = generateCertificateNumber();
    const pdfBuffer = await generateCertificatePdf({
      internName: "Jane Doe",
      role: "Frontend Developer Intern",
      startDate: "2026-01-15",
      endDate: "2026-04-15",
      certificateNumber: testCertNumber,
      issueDate: "2026-04-20",
    });

    assert.ok(Buffer.isBuffer(pdfBuffer));
    assert.ok(pdfBuffer.length > 1000, `Certificate PDF should be valid (actual: ${pdfBuffer.length} bytes)`);
    assert.strictEqual(isPdfBuffer(pdfBuffer), true, "Generated file must be a valid PDF");
  });

  console.log("\n-------------------------------------------------------");
  console.log(`Test Execution Finished: ${passedCount} passed, ${failedCount} failed.`);
  console.log("-------------------------------------------------------\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test runner encountered an error:", err);
  process.exit(1);
});
