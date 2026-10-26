export type InternshipStatus =
  | "Registered"
  | "Onboarding"
  | "Active"
  | "Completed"
  | "Withdrawn";

export type CertificateStatus =
  | "Not Eligible"
  | "Eligible"
  | "Issued"
  | "Revoked";

export type StorageMode = "production" | "development" | "test";

export const INTERN_ROLES = [
  "HR Intern",
  "Social Media Intern",
  "Marketing Intern",
  "Content Writer Intern",
  "Product Research Intern",
  "Full-Stack Developer Intern",
  "Frontend Developer Intern",
  "Backend Developer Intern",
  "Cybersecurity Intern",
  "UI/UX Design Intern",
  "Business Development Intern",
  "AI/ML Intern",
  "Data Analyst Intern",
  "Graphic Design Intern",
  "Other",
] as const;

export type InternRole = (typeof INTERN_ROLES)[number];

export interface AuditLogEntry {
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
}

export interface InternRecord {
  id: string; // SS-INT-YYYY-XXXXXX
  registrationTimestamp: string; // ISO UTC
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  role: string;
  customRole?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  linkedinUrl?: string;
  instagramUrl?: string;
  otherSocialUrl?: string;
  portfolioUrl?: string;
  college?: string;
  courseYear?: string;
  resumeDriveFileId?: string;
  resumeDriveLink?: string;
  resumeLocalFileName?: string;
  status: InternshipStatus;
  certificateNumber?: string; // SS-CERT-YYYY-XXXXXX
  certificateDriveFileId?: string;
  certificateDriveLink?: string;
  certificateLocalFileName?: string;
  certificateIssueDate?: string;
  certificateStatus?: CertificateStatus;
  certificateRevokedAt?: string;
  certificateRevokedBy?: string;
  certificateRevocationReason?: string;
  hrNotes?: string;
  offerLetterRef?: string;
  createdBy: string;
  lastUpdatedTimestamp: string;
  informedConsent: boolean;
  sheetsSyncStatus?: "synced" | "pending" | "failed";
  auditLog?: AuditLogEntry[];
}

export interface InternRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  role: string;
  customRole?: string;
  startDate: string;
  endDate: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  otherSocialUrl?: string;
  portfolioUrl?: string;
  college?: string;
  courseYear?: string;
  hrNotes?: string;
  offerLetterRef?: string;
  informedConsent: boolean;
  idempotencyKey?: string;
}

export type VerificationStatus = "VALID" | "REVOKED" | "NOT_FOUND" | "ERROR";

export interface CertificateVerificationResult {
  status: "Valid" | "Revoked" | "Not Found" | "VALID" | "REVOKED" | "NOT_FOUND" | "ERROR";
  certificateNumber?: string;
  internName?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  issueDate?: string;
  issuingOrganization?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  revocationNotice?: string;
  revocationDate?: string;
  error?: string;
}

export interface InternLookupResponse {
  internId: string;
  internName: string;
  role: string;
  startDate: string;
  endDate: string;
  internshipStatus: InternshipStatus;
  certificateStatus: CertificateStatus;
  certificateNumber?: string;
  certificateIssueDate?: string;
  downloadUrl?: string;
}

export interface CertificateRevocationInput {
  internId?: string;
  certificateNumber?: string;
  reason: string;
}
