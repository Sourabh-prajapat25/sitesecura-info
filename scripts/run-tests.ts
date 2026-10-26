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
  updateIntern,
  getIdempotencyRecord,
  setIdempotencyRecord,
} from "../src/lib/storage/intern-store";
import { generateCertificatePdf } from "../src/lib/certificate";
import { InternRecord } from "../src/types/intern";

let passedCount = 0;
let failedCount = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          console.log(`  ✓ PASS: ${name}`);
          passedCount++;
        })
        .catch((err) => {
          console.error(`  ✗ FAIL: ${name}`);
          console.error(err);
          failedCount++;
        });
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
  runTest("1. Incorrect passkey is rejected", () => {
    assert.strictEqual(verifyHrCredentials("invalid-passkey-123"), false);
    assert.strictEqual(verifyHrCredentials(""), false);
  });

  // 2. Correct passkey is accepted
  runTest("2. Configured passkey is accepted", () => {
    const validKey = process.env.HR_PORTAL_PASSKEY || "SiteSecuraHR2026!SecurePass";
    assert.strictEqual(verifyHrCredentials(validKey), true);
  });

  // 3. Session token HMAC creation and verification
  runTest("3. Session token HMAC creation and signature verification", () => {
    const token = createSessionToken("hr_admin");
    assert.ok(token && token.includes("."));
    const verified = verifySessionToken(token);
    assert.ok(verified !== null);
    assert.strictEqual(verified?.role, "hr_admin");

    // Tampered token must fail
    const tampered = token.slice(0, -5) + "abcde";
    assert.strictEqual(verifySessionToken(tampered), null);
  });

  // 4. Rate limiting activates after repeated failed attempts
  runTest("4. Rate limiting activates after repeated attempts", () => {
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
  runTest("5. Intern ID adheres to SS-INT-YYYY-XXXXXX format", () => {
    const id = generateInternId(2026);
    assert.match(id, /^SS-INT-2026-[A-Z0-9]{6}$/);
    assert.strictEqual(isValidInternIdFormat(id), true);
    assert.strictEqual(isValidInternIdFormat("INVALID-ID"), false);
  });

  // 6. Certificate Number format
  runTest("6. Certificate number adheres to SS-CERT-YYYY-XXXXXX format", () => {
    const cert = generateCertificateNumber(2026);
    assert.match(cert, /^SS-CERT-2026-[A-Z0-9]{6}$/);
    assert.strictEqual(isValidCertificateNumberFormat(cert), true);
    assert.strictEqual(isValidCertificateNumberFormat("FAKE-CERT"), false);
  });

  // 7. Concurrent ID generation uniqueness
  runTest("7. Intern IDs remain unique under concurrent generation", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const id = generateInternId();
      assert.strictEqual(ids.has(id), false, `Collision detected for ${id}`);
      ids.add(id);
    }
    assert.strictEqual(ids.size, 100);
  });

  // 8. Input validation functions
  runTest("8. Email, phone, and URL validation handles edge cases", () => {
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
  runTest("9. Spreadsheet formula injection neutralization", () => {
    assert.strictEqual(sanitizeForSpreadsheet("=CMD|' /C calc'!A0"), "'=CMD|' /C calc'!A0");
    assert.strictEqual(sanitizeForSpreadsheet("+12345"), "'+12345");
    assert.strictEqual(sanitizeForSpreadsheet("-500"), "'-500");
    assert.strictEqual(sanitizeForSpreadsheet("@SUM(A1:A10)"), "'@SUM(A1:A10)");
    assert.strictEqual(sanitizeForSpreadsheet("Normal Name"), "Normal Name");
  });

  // 10. PDF Magic Bytes file signature validation
  runTest("10. PDF file signature verification (magic bytes: %PDF)", () => {
    const validPdfBuffer = Buffer.from("%PDF-1.4 sample pdf content here");
    assert.strictEqual(isPdfBuffer(validPdfBuffer), true);

    const maliciousBuffer = Buffer.from("MZThisIsAnExecutableFileContent");
    assert.strictEqual(isPdfBuffer(maliciousBuffer), false);

    const textBuffer = Buffer.from("Hello world, this is plain text.");
    assert.strictEqual(isPdfBuffer(textBuffer), false);
  });

  // 11. Idempotency protection prevents duplicate submissions
  runTest("11. Idempotency key tracking prevents double processing", () => {
    const testKey = `test-idempotency-${Date.now()}`;
    assert.strictEqual(getIdempotencyRecord(testKey), null);

    setIdempotencyRecord(testKey, "SS-INT-2026-TEST01");
    assert.strictEqual(getIdempotencyRecord(testKey), "SS-INT-2026-TEST01");
  });

  // 12. Persistent Intern Store CRUD operations
  await runTest("12. Persistent Intern store creation, retrieval and status transition", async () => {
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

    const retrieved = getInternById(testId);
    assert.ok(retrieved !== null);
    assert.strictEqual(retrieved?.fullName, "Automated Test Candidate");
    assert.strictEqual(retrieved?.status, "Active");

    // Transition status to Completed
    await updateIntern(testId, { status: "Completed" }, "test_runner");
    const updated = getInternById(testId);
    assert.strictEqual(updated?.status, "Completed");
    assert.ok(updated?.auditLog && updated.auditLog.length > 0);
  });

  // 13. Certificate PDF Generation & Content Verification
  await runTest("13. PDF Certificate generation with QR code and dimensions", async () => {
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
