# SiteSecura Internship Management & Certificate Verification Portal
## Comprehensive Setup, Deployment & Administration Guide

This guide provides step-by-step instructions for configuring Google Cloud APIs, Google Sheets, Google Drive, and Vercel for the SiteSecura Internship Management & Certificate Verification Portal on `https://sitesecura.info`.

---

## 1. System Architecture Overview

The system consists of:
1. **Protected HR Portal** (`/hr-portal`):
   - Secure server-authenticated access using an encrypted HttpOnly session cookie signed with HMAC SHA-256.
   - Registration form with resume upload (PDF format, magic bytes validated, max 5 MB).
   - Generates collision-safe, cryptographically unique Intern IDs (`SS-INT-YYYY-XXXXXX`).
   - Management dashboard with search, role/status filters, pagination, and CSV export.
   - Certificate issuance workflow for completed internships.
2. **Public Intern Portal** (`/intern-portal`):
   - Self-service portal where interns enter their Intern ID to review status and download their official completion certificate when issued.
   - Rate-limited and privacy-safe: masks personal details and never exposes resumes or private HR notes.
3. **Public Certificate Verification Portal** (`/verify-internship`):
   - Verifies certificate authenticity via Certificate Number (`SS-CERT-YYYY-XXXXXX`) or QR code scan.
   - Displays authenticity standing: `Valid`, `Revoked`, or `Not Found`.
4. **Public Program Information** (`/internship-program`):
   - Curriculum, mentorship model, and verification process details.
5. **Storage Layer**:
   - Primary persistent store + Google Sheets administrative register (`Interns` worksheet with 26 columns).
   - Private Google Drive folders for candidate resumes and issued PDF certificates.
   - Local storage fallback adapter for seamless local development and automated testing.

---

## 2. Google Cloud Platform (GCP) Configuration

### Step 2.1 — Create a GCP Project
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top bar and select **New Project**.
3. Name the project (e.g. `sitesecura-internship-portal`) and click **Create**.

### Step 2.2 — Enable Google Sheets API & Google Drive API
1. Navigate to **APIs & Services** > **Library**.
2. Search for **Google Sheets API** and click **Enable**.
3. Return to the Library, search for **Google Drive API**, and click **Enable**.

### Step 2.3 — Create a Dedicated Service Account
1. Navigate to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **Service Account**.
3. Name the service account (e.g. `sitesecura-hr-service`).
4. Click **Create and Continue**. (No default project-level IAM roles are needed because we share the specific spreadsheet and folders directly).
5. Click **Done**.
6. Note the generated service account email (e.g. `sitesecura-hr-service@sitesecura-internship-portal.iam.gserviceaccount.com`).

### Step 2.4 — Generate and Download Service Account Key
1. In the **Credentials** tab, click on the newly created service account.
2. Select the **Keys** tab, click **Add Key** > **Create new key**.
3. Select **JSON** format and click **Create**. The key file will download to your computer.
4. Open the JSON file. You will need:
   - `client_email` -> Maps to `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` -> Maps to `GOOGLE_PRIVATE_KEY`

---

## 3. Google Sheets Setup (Administrative Register)

### Step 3.1 — Create the Spreadsheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Rename the spreadsheet to `SiteSecura Interns Register (Internal)`.
3. Rename the first sheet tab from `Sheet1` to **`Interns`** (exact name).
4. (Optional) Paste the 26 column headers into row 1 (the system auto-creates them on first write if empty):
   1. `Intern ID`
   2. `Registration Timestamp (UTC)`
   3. `Full Name`
   4. `Email`
   5. `Phone`
   6. `City`
   7. `State`
   8. `Role`
   9. `Internship Start Date`
   10. `Internship End Date`
   11. `LinkedIn URL`
   12. `Instagram URL`
   13. `Other Social URL`
   14. `Portfolio/GitHub URL`
   15. `College`
   16. `Course/Year`
   17. `Resume Drive File ID`
   18. `Resume Drive Link`
   19. `Status`
   20. `Certificate Number`
   21. `Certificate Drive File ID`
   22. `Certificate Drive Link`
   23. `Certificate Issue Date`
   24. `HR Notes`
   25. `Created By`
   26. `Last Updated Timestamp`

### Step 3.2 — Share the Spreadsheet with the Service Account
1. Click the **Share** button in the top right.
2. In the email input, paste your service account email (`GOOGLE_SERVICE_ACCOUNT_EMAIL`).
3. Set permission role to **Editor**.
4. Uncheck "Notify people" and click **Share**.
5. Extract the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`<GOOGLE_SHEET_ID>`**`/edit`

---

## 4. Google Drive Storage Setup (Resumes & Certificates)

> **Important Storage Note**: A Google service account has limited independent Drive storage quota (0 GB for individual Gmail accounts). Therefore, create the folders inside your personal or workspace Google Drive and share them with the service account as **Editor**.

### Step 4.1 — Create Private Drive Folders
1. Open [Google Drive](https://drive.google.com/).
2. Create a folder named `SiteSecura Intern Resumes (Private)`.
3. Create a second folder named `SiteSecura Intern Certificates (Private)`.
4. Right-click each folder, choose **Share**, add the service account email, and grant **Editor** access.
5. Extract the Folder ID from the URL of each folder:
   - Open the resumes folder: URL is `https://drive.google.com/drive/folders/`**`<GOOGLE_DRIVE_RESUME_FOLDER_ID>`**
   - Open the certificates folder: URL is `https://drive.google.com/drive/folders/`**`<GOOGLE_DRIVE_CERTIFICATE_FOLDER_ID>`**

---

## 5. Environment Variables & Secret Configuration

### Variable Reference Table

| Variable Name | Required | Scope | Description & Example |
| :--- | :---: | :---: | :--- |
| `STORAGE_MODE` | No | Server | `production` (default; strictly enforces Google Sheets & Drive; fails explicitly if unconfigured), `development` (permits local JSON fallback), or `test` (in-memory) |
| `HR_PORTAL_PASSKEY` | Yes | Server | Strong passkey for `/hr-portal` login. E.g. `SiteSecura#HR2026!SecureKey` |
| `HR_SESSION_SECRET` | Yes | Server | Random string (min 32 chars) for HMAC SHA-256 session signing |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | Server | Service account email from GCP JSON |
| `GOOGLE_PRIVATE_KEY` | Yes | Server | Private key from GCP JSON (includes `-----BEGIN PRIVATE KEY-----`) |
| `GOOGLE_SHEET_ID` | Yes | Server | The Google Sheets file ID |
| `GOOGLE_DRIVE_RESUME_FOLDER_ID` | Yes | Server | Drive folder ID for resumes |
| `GOOGLE_DRIVE_CERTIFICATE_FOLDER_ID` | Yes | Server | Drive folder ID for issued certificates |
| `CERTIFICATE_SIGNATORY_NAME` | No | Server | Signatory name on certificate (default: `Sourabh K.`) |
| `CERTIFICATE_SIGNATORY_TITLE` | No | Server | Signatory title on certificate (default: `Director, People & Operations`) |
| `SITE_URL` | Yes | Server | Base URL for QR verification links: `https://sitesecura.info` |

### Setting Environment Variables in Vercel
1. Log into your [Vercel Dashboard](https://vercel.com) and open the `sitesecura-info` project.
2. Go to **Settings** > **Environment Variables**.
3. Add each variable listed above for **Production** and **Preview** environments.
4. **Formatting `GOOGLE_PRIVATE_KEY`**:
   - You can paste the multi-line string directly in the Vercel dashboard. Vercel preserves newlines.
   - If pasting with escaped newlines (`\n`), the application automatically handles conversion via `.replace(/\\n/g, "\n")`.

---

## 6. Passkey Rotation & Security Best Practices

### How to Rotate the HR Passkey
1. Generate a new strong passkey (e.g. using `openssl rand -base64 24`).
2. Update `HR_PORTAL_PASSKEY` in Vercel Project Settings.
3. (Optional) Also change `HR_SESSION_SECRET` to immediately invalidate all existing active sessions.
4. Redeploy or promote the deployment. Existing logins will expire immediately.

### Anti-Enumeration & Security Controls
- **Rate Limiting**:
  - `/api/hr/login`: 5 failed attempts per 15-minute window with 15-minute lockout.
  - `/api/intern/lookup`: 10 lookups per 10 minutes.
  - `/api/verify`: 20 verifications per 10 minutes.
- **CSRF / Origin Validation**: All state-changing mutation endpoints (`POST /api/hr/interns`, `PATCH /api/hr/interns/[id]`, `POST /api/hr/certificates`) enforce strict Origin and Referer verification against `sitesecura.info` and preview deployments.
- **Duplicate Email Prevention**: Registration performs an indexed check on candidate email addresses. Attempting to register an email already registered returns HTTP `409 Conflict` with the existing Intern ID.
- **Formula Injection Defense**: All user inputs written to Google Sheets or exported to CSV are neutralized using `sanitizeForSpreadsheet()`.
- **Private Resumes**: Resume files are accessible only via the authenticated HR route (`/api/hr/resumes/[id]`), which enforces server-side session checks.
- **Rollback on Downstream Failure**: If resume storage succeeds but downstream record persistence fails, the uploaded Drive file is automatically purged via `deleteDriveFile()`.
- **Diagnostics Health Check (`/api/hr/health`)**: Protected HR endpoint that verifies active storage mode, service account credentials, Google Sheets worksheet status, and Google Drive folder accessibility.

---

## 7. Operational Workflows

### Registering a New Intern
1. Log into `https://sitesecura.info/hr-portal`.
2. Click **Register Intern** (`/hr-portal/register`).
3. Fill in required fields: Candidate name, email, phone with country code, city, state, role, tenure start/end dates, and PDF resume.
4. Check the candidate consent box and click **Register Intern & Allocate ID**.
5. Copy the generated Intern ID (`SS-INT-YYYY-XXXXXX`) or print the registration summary for your records.

### Issuing a Completion Certificate
1. When an intern completes their tenure, go to `/hr-portal/interns/[id]`.
2. Update their status from `Active` to **`Completed`** and click Save.
3. In the Certificate section, click **Issue Completion Certificate**.
4. The system:
   - Generates an immutable Certificate Number (`SS-CERT-YYYY-XXXXXX`).
   - Produces a landscape PDF with SiteSecura branding and verification QR code.
   - Uploads the certificate to the private Drive folder.
   - Updates the intern's status to `Certificate Issued`.

### How Interns Access Their Certificate
1. The intern visits `https://sitesecura.info/intern-portal`.
2. They enter their Intern ID (`SS-INT-YYYY-XXXXXX`).
3. If their certificate is issued, a green **Download Certificate PDF** button appears.

### How Third Parties Verify a Certificate
1. Visit `https://sitesecura.info/verify-internship`.
2. Enter the Certificate Number or scan the QR code printed on the PDF.
3. The server validates the record and displays authenticity confirmation without exposing private personal information.

---

## 8. Troubleshooting Common Errors

| Issue | Likely Cause | Solution |
| :--- | :--- | :--- |
| `Cannot read properties of null (reading 'spreadsheets')` | Missing or invalid GCP credentials | Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` in environment variables. |
| `Google Sheets 403: The caller does not have permission` | Spreadsheet not shared with service account | Open the Google Sheet, click Share, add the service account email as **Editor**. |
| `Google Drive 404: File not found` when uploading | Folder ID incorrect or not shared | Check that `GOOGLE_DRIVE_RESUME_FOLDER_ID` is correct and shared with the service account. |
| `Invalid credentials` on HR login | Typo in passkey or missing variable | Check `HR_PORTAL_PASSKEY` setting. Default dev fallback is `SiteSecuraHR2026!SecurePass`. |
| `Resume upload failed: magic bytes mismatch` | Uploaded file is not a valid PDF | Ensure the file is a true PDF (starts with `%PDF-`). Rename alone is insufficient. |
| `Certificate can only be issued for status Completed` | Intern status is still `Active` or `Registered` | Update intern status to `Completed` on the intern detail page before issuing certificate. |
