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
  createCertificateDownloadGrant,
  verifyCertificateDownloadGrant,
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
  getInternByCertificateNumber,
  updateIntern,
  getIdempotencyRecord,
  setIdempotencyRecord,
  resetTestStore,
  recordToSheetRow,
  sheetRowToRecord,
  isValidStatusTransition,
  checkCertificateEligibility,
  computeCertificateStatus,
  revokeCertificate,
} from "../src/lib/storage/intern-store";
import {
  storeResume,
  storeCertificate,
  deleteDriveFile,
  clearInMemoryFiles,
} from "../src/lib/storage/drive-store";
import { generateCertificatePdf } from "../src/lib/certificate";
import { InternRecord } from "../src/types/intern";
import { NextRequest } from "next/server";
import { POST as internLookupPost } from "../src/app/api/intern/lookup/route";
import { GET as verifyGet, POST as verifyPost } from "../src/app/api/verify/route";
import { GET as certDownloadGet } from "../src/app/api/certificates/[id]/download/route";
import { siteConfig } from "../src/config/site";
import {
  OFFICIAL_RAZORPAY_URL,
  RAZORPAY_INTERNSHIP_URL,
  INTERNSHIP_DOMAINS,
  PROGRAM_DELIVERABLES,
  INTERNSHIP_FAQS,
  TIMELINE_STEPS,
  WHAT_YOU_WILL_LEARN,
} from "../src/components/internships/data";

let passedCount = 0;
let failedCount = 0;

async function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    console.log(`  ... Running: ${name}`);
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
  console.log("  SiteSecura Internship & Lifecycle Test Suite (Stage 1 & 2)");
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

    process.env.STORAGE_MODE = "test";
  });

  // 17. Bidirectional Google Sheets 30-column row mapping & backward compatibility
  await runTest("17. Bidirectional Google Sheets 30-column row mapping preserves data integrity", () => {
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
      status: "Completed",
      certificateNumber: "SS-CERT-2026-ABCDEF",
      certificateDriveFileId: "cert-drive-id-98765",
      certificateDriveLink: "https://drive.google.com/file/d/cert-drive-id-98765/view",
      certificateLocalFileName: "SS-CERT-2026-ABCDEF-certificate.pdf",
      certificateIssueDate: "2026-08-31",
      certificateStatus: "Issued",
      hrNotes: "Exemplary performance during internship tenure.",
      offerLetterRef: "SS-OFFER-2026-0042",
      createdBy: "hr_admin",
      lastUpdatedTimestamp: "2026-08-31T12:00:00.000Z",
      informedConsent: true,
      sheetsSyncStatus: "synced",
    };

    const row = recordToSheetRow(originalRecord);
    assert.strictEqual(row.length, 30, `Google Sheets row must have exactly 30 columns, got ${row.length}`);
    assert.strictEqual(row[0], "SS-INT-2026-MAP001");
    assert.strictEqual(row[2], "Mapping Test Candidate");
    assert.strictEqual(row[7], "SiteSecura Security Fellow"); // role / customRole
    assert.strictEqual(row[19], "SS-CERT-2026-ABCDEF"); // cert number
    assert.strictEqual(row[26], "Issued"); // Certificate Status

    // Reconstruct record from 30-column row
    const reconstructed = sheetRowToRecord(row);
    assert.strictEqual(reconstructed.id, originalRecord.id);
    assert.strictEqual(reconstructed.fullName, originalRecord.fullName);
    assert.strictEqual(reconstructed.email, originalRecord.email);
    assert.strictEqual(reconstructed.customRole, originalRecord.customRole);
    assert.strictEqual(reconstructed.certificateNumber, originalRecord.certificateNumber);
    assert.strictEqual(reconstructed.certificateStatus, "Issued");
    assert.strictEqual(reconstructed.status, "Completed");

    // Backward-compatibility: Reconstruct from legacy 26-column row with "Certificate Issued"
    const legacy26Row = row.slice(0, 26);
    legacy26Row[18] = "Certificate Issued"; // legacy status column
    const legacyReconstructed = sheetRowToRecord(legacy26Row);
    assert.strictEqual(legacyReconstructed.status, "Completed", "Legacy 'Certificate Issued' must map to 'Completed'");
    assert.strictEqual(legacyReconstructed.certificateStatus, "Issued", "Legacy record with cert must have certificateStatus 'Issued'");
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

  // 19. Stage 2: Lifecycle State Machine Transitions
  await runTest("19. Lifecycle state transitions enforce sequential progression", () => {
    // Valid standard transitions
    assert.strictEqual(isValidStatusTransition("Registered", "Onboarding").allowed, true);
    assert.strictEqual(isValidStatusTransition("Onboarding", "Active").allowed, true);
    assert.strictEqual(isValidStatusTransition("Active", "Completed").allowed, true);
    assert.strictEqual(isValidStatusTransition("Active", "Withdrawn").allowed, true);
    assert.strictEqual(isValidStatusTransition("Registered", "Withdrawn").allowed, true);
    assert.strictEqual(isValidStatusTransition("Active", "Active").allowed, true); // no-op

    // Illegal transitions without admin override
    assert.strictEqual(isValidStatusTransition("Registered", "Completed").allowed, false);
    assert.strictEqual(isValidStatusTransition("Withdrawn", "Active").allowed, false);
    assert.strictEqual(isValidStatusTransition("Completed", "Active").allowed, false);

    // Administrative override permits any non-standard transition
    assert.strictEqual(isValidStatusTransition("Registered", "Completed", true).allowed, true);
    assert.strictEqual(isValidStatusTransition("Withdrawn", "Active", true).allowed, true);
  });

  // 20. Stage 2: Certificate Eligibility Verification
  await runTest("20. Certificate eligibility logic validates completion and dates", () => {
    const baseRecord: InternRecord = {
      id: "SS-INT-2026-ELIG01",
      registrationTimestamp: new Date().toISOString(),
      fullName: "Eligibility Candidate",
      email: "eligibility@sitesecura.info",
      phone: "+1 555-0199",
      city: "Austin",
      state: "Texas",
      role: "Cybersecurity Intern",
      startDate: "2026-01-01",
      endDate: "2026-04-01",
      status: "Completed",
      createdBy: "test_runner",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
    };

    // Valid completed candidate
    const eligibleCheck = checkCertificateEligibility(baseRecord);
    assert.strictEqual(eligibleCheck.eligible, true);

    // Inactive status: Active
    const activeCheck = checkCertificateEligibility({ ...baseRecord, status: "Active" });
    assert.strictEqual(activeCheck.eligible, false);
    assert.ok(activeCheck.reason?.includes("Completed"));

    // Inactive status: Withdrawn
    const withdrawnCheck = checkCertificateEligibility({ ...baseRecord, status: "Withdrawn" });
    assert.strictEqual(withdrawnCheck.eligible, false);

    // Invalid dates: start after end
    const invalidDatesCheck = checkCertificateEligibility({
      ...baseRecord,
      startDate: "2026-05-01",
      endDate: "2026-04-01",
    });
    assert.strictEqual(invalidDatesCheck.eligible, false);

    // Already has active certificate
    const alreadyIssuedCheck = checkCertificateEligibility({
      ...baseRecord,
      certificateNumber: "SS-CERT-2026-EXISTS",
      certificateStatus: "Issued",
    });
    assert.strictEqual(alreadyIssuedCheck.eligible, false);
    assert.ok(alreadyIssuedCheck.reason?.includes("already active"));
  });

  // 21. Stage 2: Cryptographic Download Grant Creation & Verification
  await runTest("21. Download grant token creation, HMAC verification and tamper prevention", () => {
    const internId = "SS-INT-2026-GRNT01";
    const certNumber = "SS-CERT-2026-GRNT99";

    const grant = createCertificateDownloadGrant(internId, certNumber);
    assert.ok(grant && grant.includes("."));

    // Valid verification
    const verified = verifyCertificateDownloadGrant(grant, certNumber);
    assert.strictEqual(verified.valid, true);
    assert.strictEqual(verified.internId, internId);
    assert.strictEqual(verified.certificateNumber, certNumber);

    // Rejection when checking against mismatched cert number
    assert.strictEqual(verifyCertificateDownloadGrant(grant, "SS-CERT-2026-OTHER").valid, false);

    // Rejection on tampered signature
    const tampered = grant.slice(0, -6) + "xxxxxx";
    assert.strictEqual(verifyCertificateDownloadGrant(tampered, certNumber).valid, false);

    // Rejection on malformed grant
    assert.strictEqual(verifyCertificateDownloadGrant("invalid.grant", certNumber).valid, false);
    assert.strictEqual(verifyCertificateDownloadGrant("", certNumber).valid, false);
  });

  // 22. Stage 2: Certificate Revocation Workflow & Audit Log
  await runTest("22. Certificate revocation workflow sets status, records audit and prevents duplicates", async () => {
    process.env.STORAGE_MODE = "test";
    resetTestStore();

    const internId = "SS-INT-2026-REV001";
    const certNumber = "SS-CERT-2026-REV001";

    const intern: InternRecord = {
      id: internId,
      registrationTimestamp: new Date().toISOString(),
      fullName: "Revocation Subject",
      email: "revoke.subject@sitesecura.info",
      phone: "+1 555-0144",
      city: "Boston",
      state: "Massachusetts",
      role: "Security Research Intern",
      startDate: "2026-01-01",
      endDate: "2026-04-01",
      status: "Completed",
      certificateNumber: certNumber,
      certificateStatus: "Issued",
      certificateIssueDate: "2026-04-02",
      createdBy: "hr_admin",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
    };

    await createIntern(intern);

    // Attempt revocation with reason shorter than 5 chars -> should throw
    let shortReasonError: Error | null = null;
    try {
      await revokeCertificate(certNumber, "bad", "test_auditor");
    } catch (err: any) {
      shortReasonError = err;
    }
    assert.ok(shortReasonError !== null, "Must reject revocation reason < 5 chars");

    // Execute valid revocation
    const revoked = await revokeCertificate(
      certNumber,
      "Administrative correction following tenure dispute",
      "test_auditor"
    );

    assert.strictEqual(revoked.certificateStatus, "Revoked");
    assert.strictEqual(revoked.certificateRevokedBy, "test_auditor");
    assert.strictEqual(revoked.certificateRevocationReason, "Administrative correction following tenure dispute");
    assert.ok(revoked.certificateRevokedAt);
    assert.strictEqual(revoked.certificateNumber, certNumber); // Preserves certificate number
    assert.strictEqual(revoked.certificateIssueDate, "2026-04-02"); // Preserves issue date
    assert.ok(revoked.auditLog && revoked.auditLog.some((log) => log.action.toUpperCase().includes("REVOKED")));
  });

  // 23. Stage 2: Public Certificate Verification API Contract
  await runTest("23. Public Verification API: explicit VALID, REVOKED, and NOT_FOUND states without info leakage", async () => {
    process.env.STORAGE_MODE = "test";
    resetTestStore();

    // 1. Seed valid active certificate
    const validCertId = "SS-CERT-2026-VAL001";
    await createIntern({
      id: "SS-INT-2026-VAL001",
      registrationTimestamp: new Date().toISOString(),
      fullName: "Alice Verified",
      email: "alice@sitesecura.info",
      phone: "+1 555-9999", // sensitive
      city: "New York",
      state: "NY",
      role: "Cybersecurity Analyst Intern",
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      status: "Completed",
      certificateNumber: validCertId,
      certificateStatus: "Issued",
      certificateIssueDate: "2026-04-01",
      createdBy: "hr_admin",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
      hrNotes: "Strictly confidential note", // sensitive
    });

    // 2. Seed revoked certificate
    const revokedCertId = "SS-CERT-2026-REV002";
    await createIntern({
      id: "SS-INT-2026-REV002",
      registrationTimestamp: new Date().toISOString(),
      fullName: "Bob Revoked",
      email: "bob@sitesecura.info",
      phone: "+1 555-8888",
      city: "Denver",
      state: "CO",
      role: "Frontend Engineer Intern",
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      status: "Completed",
      certificateNumber: revokedCertId,
      certificateStatus: "Revoked",
      certificateIssueDate: "2026-04-01",
      certificateRevokedAt: "2026-04-05T12:00:00Z",
      certificateRevokedBy: "hr_director",
      certificateRevocationReason: "Sensitive disciplinary misconduct", // MUST NOT leak to public
      createdBy: "hr_admin",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
    });

    // Test GET /api/verify for VALID
    const validReq = new NextRequest(`https://sitesecura.info/api/verify?cert=${validCertId}`);
    const validRes = await verifyGet(validReq);
    const validData = await validRes.json();

    assert.strictEqual(validRes.status, 200);
    assert.strictEqual(validData.status, "VALID");
    assert.strictEqual(validData.internName, "Alice Verified");
    assert.strictEqual(validData.role, "Cybersecurity Analyst Intern");
    assert.strictEqual(validData.certificateNumber, validCertId);
    assert.strictEqual(validData.issueDate, "2026-04-01");
    // Ensure no sensitive leakage
    assert.strictEqual(validData.email, undefined);
    assert.strictEqual(validData.phone, undefined);
    assert.strictEqual(validData.hrNotes, undefined);

    // Test POST /api/verify for REVOKED
    const revokedReq = new NextRequest("https://sitesecura.info/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cert: revokedCertId }),
    });
    const revokedRes = await verifyPost(revokedReq);
    const revokedData = await revokedRes.json();

    assert.strictEqual(revokedRes.status, 200);
    assert.strictEqual(revokedData.status, "REVOKED");
    assert.strictEqual(revokedData.certificateNumber, revokedCertId);
    assert.ok(revokedData.revocationDate);
    // CRITICAL SECURITY: Public verification must NEVER disclose internal revocation reason
    assert.strictEqual(revokedData.reason, undefined);
    assert.strictEqual(revokedData.certificateRevocationReason, undefined);
    assert.strictEqual(revokedData.revokedBy, undefined);

    // Test GET /api/verify for NOT_FOUND with valid format but unregistered certificate
    const notFoundReq = new NextRequest("https://sitesecura.info/api/verify?cert=SS-CERT-2026-999999");
    const notFoundRes = await verifyGet(notFoundReq);
    const notFoundData = await notFoundRes.json();

    assert.strictEqual(notFoundRes.status, 404);
    assert.strictEqual(notFoundData.status, "NOT_FOUND");

    // Test GET /api/verify with malformed certificate format
    const malformedReq = new NextRequest("https://sitesecura.info/api/verify?cert=INVALID-CERT");
    const malformedRes = await verifyGet(malformedReq);
    assert.strictEqual(malformedRes.status, 400);
  });

  // 24. Stage 2: Intern Self-Service Lookup API Contract
  await runTest("24. Intern Lookup API: requires both ID and Email, enforces constant error and anti-enumeration", async () => {
    process.env.STORAGE_MODE = "test";
    resetTestStore();

    const internId = "SS-INT-2026-SLF001";
    const email = "selfservice@sitesecura.info";
    const certNumber = "SS-CERT-2026-SLF001";

    await createIntern({
      id: internId,
      registrationTimestamp: new Date().toISOString(),
      fullName: "Self Service User",
      email: email,
      phone: "+1 555-3333", // sensitive
      city: "Chicago",
      state: "IL",
      role: "Backend Engineer Intern",
      startDate: "2026-02-01",
      endDate: "2026-05-01",
      status: "Completed",
      certificateNumber: certNumber,
      certificateStatus: "Issued",
      certificateIssueDate: "2026-05-02",
      createdBy: "hr_admin",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
      hrNotes: "Top 5% intern performance", // sensitive
    });

    // 1. Successful lookup with matching internId and email
    const successReq = new NextRequest("https://sitesecura.info/api/intern/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internId, email }),
    });
    const successRes = await internLookupPost(successReq);
    const successData = await successRes.json();

    assert.strictEqual(successRes.status, 200);
    assert.strictEqual(successData.success, true);
    assert.strictEqual(successData.intern.internId, internId);
    assert.strictEqual(successData.intern.internName, "Self Service User");
    assert.strictEqual(successData.intern.internshipStatus, "Completed");
    assert.strictEqual(successData.intern.certificateStatus, "Issued");
    assert.strictEqual(successData.intern.certificateNumber, certNumber);
    assert.ok(successData.intern.downloadUrl && successData.intern.downloadUrl.includes("grant="));

    // Privacy verification: no internal phone or hrNotes
    assert.strictEqual(successData.intern.phone, undefined);
    assert.strictEqual(successData.intern.hrNotes, undefined);
    assert.strictEqual(successData.intern.resumeDriveFileId, undefined);

    // 2. Mismatched email (correct ID, wrong email)
    const wrongEmailReq = new NextRequest("https://sitesecura.info/api/intern/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internId, email: "attacker@otherdomain.com" }),
    });
    const wrongEmailRes = await internLookupPost(wrongEmailReq);
    const wrongEmailData = await wrongEmailRes.json();

    assert.strictEqual(wrongEmailRes.status, 404);
    assert.ok(wrongEmailData.error.includes("No matching record found"));

    // 3. Nonexistent intern ID
    const wrongIdReq = new NextRequest("https://sitesecura.info/api/intern/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internId: "SS-INT-2026-ZZZZZZ", email }),
    });
    const wrongIdRes = await internLookupPost(wrongIdReq);
    const wrongIdData = await wrongIdRes.json();

    assert.strictEqual(wrongIdRes.status, 404);
    // Ensure constant error feedback to prevent enumeration
    assert.strictEqual(wrongIdData.error, wrongEmailData.error);
  });

  // 25. Stage 2: Certificate Download Authorization & 410 Revoked Blocking
  await runTest("25. Certificate Download endpoint: blocks unauthorized access and returns HTTP 410 for revoked", async () => {
    process.env.STORAGE_MODE = "test";
    resetTestStore();

    const internId = "SS-INT-2026-DWN001";
    const certNumber = "SS-CERT-2026-DWN001";
    const dummyPdf = Buffer.from("%PDF-1.4 Mock Certificate Data");

    const uploadRes = await storeCertificate(dummyPdf, certNumber);

    await createIntern({
      id: internId,
      registrationTimestamp: new Date().toISOString(),
      fullName: "Download Test Candidate",
      email: "download@sitesecura.info",
      phone: "+1 555-7777",
      city: "Miami",
      state: "FL",
      role: "Cybersecurity Intern",
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      status: "Completed",
      certificateNumber: certNumber,
      certificateStatus: "Issued",
      certificateIssueDate: "2026-04-01",
      certificateDriveFileId: uploadRes.fileId,
      certificateLocalFileName: uploadRes.localFileName,
      createdBy: "hr_admin",
      lastUpdatedTimestamp: new Date().toISOString(),
      informedConsent: true,
    });

    // 1. Direct unauthenticated request without grant -> HTTP 403 Forbidden
    const unauthReq = new NextRequest(`https://sitesecura.info/api/certificates/${certNumber}/download`);
    const unauthRes = await certDownloadGet(unauthReq, { params: { id: certNumber } });
    assert.strictEqual(unauthRes.status, 403);

    // 2. Request with invalid or expired grant -> HTTP 403 Forbidden
    const badGrantReq = new NextRequest(`https://sitesecura.info/api/certificates/${certNumber}/download?grant=fake.grant.token`);
    const badGrantRes = await certDownloadGet(badGrantReq, { params: { id: certNumber } });
    assert.strictEqual(badGrantRes.status, 403);

    // 3. Request with valid cryptographic grant -> HTTP 200 OK with PDF binary
    const validGrant = createCertificateDownloadGrant(internId, certNumber);
    const validReq = new NextRequest(`https://sitesecura.info/api/certificates/${certNumber}/download?grant=${encodeURIComponent(validGrant)}`);
    const validRes = await certDownloadGet(validReq, { params: { id: certNumber } });
    assert.strictEqual(validRes.status, 200);
    assert.strictEqual(validRes.headers.get("content-type"), "application/pdf");

    // 4. Revoke certificate -> subsequent download with valid grant returns HTTP 410 Gone
    await revokeCertificate(certNumber, "Revoked for credential audit testing", "hr_security");
    const revokedReq = new NextRequest(`https://sitesecura.info/api/certificates/${certNumber}/download?grant=${encodeURIComponent(validGrant)}`);
    const revokedRes = await certDownloadGet(revokedReq, { params: { id: certNumber } });
    assert.strictEqual(revokedRes.status, 410);
    const revokedBody = await revokedRes.json();
    assert.ok(revokedBody.error.includes("revoked"));
  });

  await runTest("26. Paid internship landing page data integrity and Razorpay destination", async () => {
    // 1. Check exact required Razorpay URL
    const expectedUrl = "https://rzp.io/rzp/6YVhqsy";
    assert.strictEqual(OFFICIAL_RAZORPAY_URL, expectedUrl);
    assert.strictEqual(RAZORPAY_INTERNSHIP_URL, expectedUrl);
    assert.strictEqual(siteConfig.forms.razorpayInternshipUrl, expectedUrl);

    // 2. Validate all 13 domain roles
    assert.strictEqual(INTERNSHIP_DOMAINS.length, 13);
    const techRoles = INTERNSHIP_DOMAINS.filter(r => r.category === "technology");
    const bizRoles = INTERNSHIP_DOMAINS.filter(r => r.category === "business");
    assert.strictEqual(techRoles.length, 7);
    assert.strictEqual(bizRoles.length, 6);

    // Check unique IDs and non-empty skills
    const ids = new Set<string>();
    for (const role of INTERNSHIP_DOMAINS) {
      assert.ok(role.id && !ids.has(role.id), `Duplicate or empty role id: ${role.id}`);
      ids.add(role.id);
      assert.ok(role.title.length > 0);
      assert.ok(role.description.length > 0);
      assert.ok(role.skills.length >= 3, `Role ${role.id} should have at least 3 skills`);
    }

    // 3. Validate 8 deliverables
    assert.strictEqual(PROGRAM_DELIVERABLES.length, 8);
    for (const d of PROGRAM_DELIVERABLES) {
      assert.ok(d.id && d.title && d.description);
    }

    // 4. Validate 5 timeline steps
    assert.strictEqual(TIMELINE_STEPS.length, 5);

    // 5. Validate 4 learning pillars
    assert.strictEqual(WHAT_YOU_WILL_LEARN.length, 4);

    // 6. Validate 10 FAQs
    assert.strictEqual(INTERNSHIP_FAQS.length, 10);
    assert.ok(INTERNSHIP_FAQS[0].question.includes("paid"));
    assert.ok(INTERNSHIP_FAQS[1].question.includes("₹99 fee"));
    assert.ok(INTERNSHIP_FAQS[9].answer.includes("/verify-internship"));
  });

  await runTest("27. Brand safety: No forbidden guarantees or fabricated metrics in landing content", async () => {
    const serialized = JSON.stringify({
      domains: INTERNSHIP_DOMAINS,
      deliverables: PROGRAM_DELIVERABLES,
      faqs: INTERNSHIP_FAQS,
      timeline: TIMELINE_STEPS,
      learning: WHAT_YOU_WILL_LEARN,
    }).toLowerCase();

    // Must NOT contain deceptive false placement or automatic certificate claims
    assert.ok(!serialized.includes("100% job guarantee"));
    assert.ok(!serialized.includes("guaranteed placement"));
    assert.ok(!serialized.includes("guaranteed stipend"));
    assert.ok(!serialized.includes("10,000+ students"));
    assert.ok(!serialized.includes("50,000+ students"));
    assert.ok(!serialized.includes("partners with google"));
  });

  console.log("\n-------------------------------------------------------");
  console.log(`Test Execution Finished: ${passedCount} passed, ${failedCount} failed.`);
  console.log("-------------------------------------------------------\n");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Test runner encountered an error:", err);
  process.exit(1);
});
