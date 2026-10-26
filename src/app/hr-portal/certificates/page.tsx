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
} from "lucide-react";

export default function HrCertificatesPage() {
  const [interns, setInterns] = useState<InternRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [issuingId, setIssuingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

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
    const confirm = window.confirm(
      `Issue official completion certificate for ${internName}? This action is recorded permanently.`
    );
    if (!confirm) return;

    setIssuingId(internId);
    setFeedback(null);

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

  // Filter interns
  const completedWithoutCert = interns.filter(
    (i) => i.status === "Completed" && !i.certificateNumber
  );

  const issuedCertificates = interns.filter((i) => Boolean(i.certificateNumber));

  const filteredIssued = issuedCertificates.filter((i) => {
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
        <div className="border-b border-border/60 pb-4 space-y-1">
          <Badge variant="primary" size="sm">
            CREDENTIAL ISSUANCE
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Internship Certificate Management
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Issue cryptographically verifiable completion certificates for completed internships.
          </p>
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

        {/* Pending Issuance Queue */}
        <div className="rounded-2xl border border-secondary/30 bg-background-card/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Ready for Certificate Issuance ({completedWithoutCert.length})
              </h2>
              <p className="text-xs text-foreground-muted">
                Interns whose tenure is marked as Completed but have not yet been issued a certificate.
              </p>
            </div>
            <Award className="h-5 w-5 text-secondary" />
          </div>

          {completedWithoutCert.length === 0 ? (
            <div className="py-6 text-center text-xs text-foreground-muted">
              No interns currently waiting for certificate issuance.
            </div>
          ) : (
            <div className="space-y-3">
              {completedWithoutCert.map((candidate) => (
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
                      {candidate.customRole || candidate.role} • {candidate.startDate} to{" "}
                      {candidate.endDate}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={issuingId === candidate.id}
                    onClick={() => handleIssueCertificate(candidate.id, candidate.fullName)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-xs font-semibold text-white shadow-md transition-colors"
                  >
                    {issuingId === candidate.id ? (
                      <span>Generating PDF...</span>
                    ) : (
                      <>
                        <Award className="h-4 w-4" />
                        <span>Issue Certificate Now</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issued Certificates Register */}
        <div className="rounded-2xl border border-border bg-background-card/90 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-3">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Issued Certificates Registry ({issuedCertificates.length})
              </h2>
              <p className="text-xs text-foreground-muted">
                Active certificates verifiable by employers and third parties via public portal.
              </p>
            </div>

            <div className="w-full sm:w-64 relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-foreground-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search certificate # or name..."
                className="w-full rounded-xl border border-border bg-background-secondary py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-foreground-muted">
              Loading certificates registry...
            </div>
          ) : filteredIssued.length === 0 ? (
            <div className="py-8 text-center text-xs text-foreground-muted">
              No issued certificates found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                    <th className="py-3 px-3">Certificate Number</th>
                    <th className="py-3 px-3">Recipient</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Issued Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredIssued.map((item) => (
                    <tr key={item.id} className="hover:bg-background-secondary/40">
                      <td className="py-3 px-3 font-mono font-semibold text-secondary">
                        {item.certificateNumber}
                      </td>
                      <td className="py-3 px-3 font-medium text-foreground">
                        {item.fullName}
                      </td>
                      <td className="py-3 px-3 text-foreground-muted">
                        {item.customRole || item.role}
                      </td>
                      <td className="py-3 px-3 text-foreground-muted">
                        {item.certificateIssueDate}
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <a
                          href={`/api/certificates/${item.certificateNumber}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </a>
                        <Link
                          href={`/verify-internship?cert=${item.certificateNumber}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-secondary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Verify</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
