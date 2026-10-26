"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge, StatusBadge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { InternRecord } from "@/types/intern";
import {
  Award,
  Search,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Eye,
  X,
  Copy,
  Check,
  Clock,
  Filter,
} from "lucide-react";

export default function HrCertificatesPage() {
  const [interns, setInterns] = useState<InternRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "issued" | "revoked">("all");
  const [issuingId, setIssuingId] = useState<string | null>(null);
  const [revokingCert, setRevokingCert] = useState<InternRecord | null>(null);
  const [previewCert, setPreviewCert] = useState<InternRecord | null>(null);
  const [revocationReason, setRevocationReason] = useState("");
  const [isSubmittingRevoke, setIsSubmittingRevoke] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [copiedCertNo, setCopiedCertNo] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/hr/interns?limit=100");
      if (res.ok) {
        const data = await res.json();
        setInterns(data.interns || []);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  async function handleIssueCertificate(internId: string, internName: string) {
    setIssuingId(internId);
    setFeedback(null);
    setPreviewCert(null);

    try {
      const res = await fetch("/api/hr/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: "success",
          text: `Certificate ${data.certificateNumber} generated and signed for ${internName}!`,
        });
        fetchRecords();
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to issue certificate." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setIssuingId(null);
    }
  }

  async function handleRevokeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!revokingCert) return;

    if (!revocationReason.trim() || revocationReason.trim().length < 5) {
      alert("Please provide an internal revocation reason (minimum 5 characters).");
      return;
    }

    setIsSubmittingRevoke(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/hr/certificates/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateNumber: revokingCert.certificateNumber,
          internId: revokingCert.id,
          reason: revocationReason.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: "success",
          text: `Certificate ${revokingCert.certificateNumber} successfully revoked.`,
        });
        setRevokingCert(null);
        setRevocationReason("");
        fetchRecords();
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to revoke certificate." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while revoking certificate." });
    } finally {
      setIsSubmittingRevoke(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCertNo(text);
    setTimeout(() => setCopiedCertNo(null), 2000);
  }

  // Filter queues
  const eligibleForIssuance = interns.filter(
    (i) => i.status === "Completed" && !i.certificateNumber
  );

  const allWithCertificates = interns.filter((i) => Boolean(i.certificateNumber));

  const activeIssued = allWithCertificates.filter((i) => i.certificateStatus !== "Revoked");
  const revokedCerts = allWithCertificates.filter((i) => i.certificateStatus === "Revoked");

  const filteredCertificates = allWithCertificates.filter((i) => {
    // Status filter
    if (statusFilter === "issued" && i.certificateStatus === "Revoked") return false;
    if (statusFilter === "revoked" && i.certificateStatus !== "Revoked") return false;

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      i.fullName.toLowerCase().includes(term) ||
      i.id.toLowerCase().includes(term) ||
      (i.certificateNumber && i.certificateNumber.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col gap-8">
      <Container>
        <Breadcrumbs
          items={[{ label: "HR Portal", href: "/hr-portal" }, { label: "Certificate Management" }]}
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <Badge variant="primary" size="sm">
              CREDENTIAL LIFECYCLE MANAGEMENT
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Internship Certificate Center
            </h1>
            <p className="text-xs sm:text-sm text-foreground-muted">
              Inspect eligibility, issue cryptographically verifiable PDF credentials, and manage
              revocations with complete audit logging.
            </p>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-secondary flex items-center justify-between">
              <span>Ready for Issuance</span>
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {eligibleForIssuance.length}
            </div>
            <p className="text-[11px] text-foreground-muted">Tenure marked Completed</p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>Active Credentials</span>
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{activeIssued.length}</div>
            <p className="text-[11px] text-foreground-muted">Publicly verifiable credentials</p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Revoked Credentials</span>
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{revokedCerts.length}</div>
            <p className="text-[11px] text-foreground-muted">Invalidated credentials</p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Section 1: Ready for Certificate Issuance Queue */}
        <div className="rounded-2xl border border-secondary/30 bg-background-card/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Eligible for Certificate Issuance ({eligibleForIssuance.length})
              </h2>
              <p className="text-xs text-foreground-muted">
                Completed interns eligible for official completion certificate generation.
              </p>
            </div>
            <Award className="h-5 w-5 text-secondary" />
          </div>

          {eligibleForIssuance.length === 0 ? (
            <div className="py-6 text-center text-xs text-foreground-muted">
              No interns currently waiting for certificate issuance.
            </div>
          ) : (
            <div className="space-y-3">
              {eligibleForIssuance.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-background-secondary/60 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">
                        {candidate.fullName}
                      </span>
                      <span className="font-mono text-[11px] text-secondary">
                        ({candidate.id})
                      </span>
                    </div>
                    <div className="text-xs text-foreground-muted">
                      {candidate.customRole || candidate.role} • Tenure: {candidate.startDate} to{" "}
                      {candidate.endDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewCert(candidate)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background-card hover:bg-background-secondary text-xs font-semibold text-foreground transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-secondary" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      disabled={issuingId === candidate.id}
                      onClick={() =>
                        handleIssueCertificate(candidate.id, candidate.fullName)
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-xs font-semibold text-white shadow-md transition-colors"
                    >
                      {issuingId === candidate.id ? (
                        <span>Generating PDF & Signing...</span>
                      ) : (
                        <>
                          <Award className="h-4 w-4" />
                          <span>Issue Certificate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Issued & Managed Certificates Registry */}
        <div className="rounded-2xl border border-border bg-background-card/90 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-3">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Certificate Registry ({allWithCertificates.length})
              </h2>
              <p className="text-xs text-foreground-muted">
                Official certificates verifiable via public portal or QR code scan.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center rounded-xl border border-border bg-background-secondary p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === "all"
                      ? "bg-primary text-white"
                      : "text-foreground-muted hover:text-white"
                  }`}
                >
                  All ({allWithCertificates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("issued")}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === "issued"
                      ? "bg-primary text-white"
                      : "text-foreground-muted hover:text-white"
                  }`}
                >
                  Active ({activeIssued.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("revoked")}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === "revoked"
                      ? "bg-primary text-white"
                      : "text-foreground-muted hover:text-white"
                  }`}
                >
                  Revoked ({revokedCerts.length})
                </button>
              </div>

              <div className="w-full sm:w-64 relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-foreground-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search cert #, intern ID, name..."
                  className="w-full rounded-xl border border-border bg-background-secondary py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-foreground-muted">
              Loading certificates registry...
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="py-8 text-center text-xs text-foreground-muted">
              No certificates found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                    <th className="py-3 px-3">Certificate Identifier</th>
                    <th className="py-3 px-3">Recipient</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Issued Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredCertificates.map((item) => {
                    const isRevoked = item.certificateStatus === "Revoked";

                    return (
                      <tr key={item.id} className="hover:bg-background-secondary/40">
                        {/* Certificate Number with Copy */}
                        <td className="py-3 px-3 font-mono font-semibold text-secondary">
                          <div className="flex items-center gap-1.5">
                            <span>{item.certificateNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.certificateNumber!)}
                              title="Copy Certificate Number"
                              className="text-foreground-subtle hover:text-white"
                            >
                              {copiedCertNo === item.certificateNumber ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Recipient Name and Intern ID */}
                        <td className="py-3 px-3 font-medium text-foreground">
                          <div>{item.fullName}</div>
                          <div className="text-[11px] font-mono text-foreground-subtle">
                            {item.id}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-3 text-foreground-muted">
                          {item.customRole || item.role}
                        </td>

                        {/* Issued Date */}
                        <td className="py-3 px-3 text-foreground-muted">
                          {item.certificateIssueDate}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3">
                          {isRevoked ? (
                            <Badge variant="error" size="sm">
                              REVOKED
                            </Badge>
                          ) : (
                            <Badge variant="success" size="sm">
                              ACTIVE
                            </Badge>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right space-x-2">
                          {!isRevoked && (
                            <a
                              href={`/api/certificates/${item.certificateNumber}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>PDF</span>
                            </a>
                          )}

                          <Link
                            href={`/verify-internship?cert=${item.certificateNumber}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-secondary hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Verify</span>
                          </Link>

                          {!isRevoked && (
                            <button
                              type="button"
                              onClick={() => setRevokingCert(item)}
                              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 hover:underline"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span>Revoke</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border border-secondary/40 bg-background-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <Award className="h-5 w-5 text-secondary" />
                <span>Certificate Data Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="text-foreground-subtle hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-foreground-muted">
              Verify the exact details that will be rendered on the immutable completion certificate
              and encoded into the QR code.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs bg-background-secondary p-4 rounded-xl border border-border/50">
              <div>
                <span className="text-foreground-subtle text-[11px]">Recipient Name:</span>
                <div className="font-bold text-foreground text-sm mt-0.5">
                  {previewCert.fullName}
                </div>
              </div>
              <div>
                <span className="text-foreground-subtle text-[11px]">Intern ID:</span>
                <div className="font-mono font-bold text-secondary mt-0.5">
                  {previewCert.id}
                </div>
              </div>
              <div>
                <span className="text-foreground-subtle text-[11px]">Internship Role:</span>
                <div className="font-semibold text-primary mt-0.5">
                  {previewCert.customRole || previewCert.role}
                </div>
              </div>
              <div>
                <span className="text-foreground-subtle text-[11px]">Tenure Period:</span>
                <div className="font-medium text-foreground mt-0.5">
                  {previewCert.startDate} to {previewCert.endDate}
                </div>
              </div>
              <div>
                <span className="text-foreground-subtle text-[11px]">Issuing Entity:</span>
                <div className="font-medium text-foreground mt-0.5">SiteSecura</div>
              </div>
              <div>
                <span className="text-foreground-subtle text-[11px]">Signatory:</span>
                <div className="font-medium text-foreground mt-0.5">
                  Sourabh K. (Director, People & Operations)
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-foreground hover:bg-background-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={issuingId === previewCert.id}
                onClick={() =>
                  handleIssueCertificate(previewCert.id, previewCert.fullName)
                }
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-md transition-colors"
              >
                Confirm & Issue Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Revocation Confirmation Dialog */}
      {revokingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-red-500/50 bg-background-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                <ShieldAlert className="h-5 w-5" />
                <span>Revoke Certificate</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRevokingCert(null);
                  setRevocationReason("");
                }}
                className="text-foreground-subtle hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-foreground-muted">
              <p>
                You are revoking certificate{" "}
                <strong className="font-mono text-white">
                  {revokingCert.certificateNumber}
                </strong>{" "}
                issued to <strong className="text-white">{revokingCert.fullName}</strong>.
              </p>
              <p className="text-red-300">
                This will immediately invalidate the credential on the public verification portal and
                block all PDF downloads. This action is permanently audited.
              </p>
            </div>

            <form onSubmit={handleRevokeSubmit} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  Internal Revocation Reason (Required)
                </label>
                <textarea
                  rows={3}
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  placeholder="e.g. Disciplinary finding, credential issued in error, candidate request..."
                  required
                  className="w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-red-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRevokingCert(null);
                    setRevocationReason("");
                  }}
                  className="px-4 py-2 rounded-xl border border-border text-xs text-foreground hover:bg-background-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRevoke}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  {isSubmittingRevoke ? "Revoking..." : "Confirm Revocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
