"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge, StatusBadge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import {
  Search,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Shield,
  FileCheck2,
  ArrowRight,
  Mail,
  Copy,
  Check,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
} from "lucide-react";

interface InternLookupResult {
  internId: string;
  internName: string;
  role: string;
  startDate: string;
  endDate: string;
  internshipStatus: "Registered" | "Onboarding" | "Active" | "Completed" | "Withdrawn";
  certificateStatus: "Not Eligible" | "Eligible" | "Issued" | "Revoked";
  certificateAvailable: boolean;
  certificateNumber?: string;
  certificateIssueDate?: string;
  downloadUrl?: string;
}

export default function InternPortalPage() {
  const [internIdInput, setInternIdInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InternLookupResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCert, setCopiedCert] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const cleanId = internIdInput.trim().toUpperCase();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanId || !cleanEmail) {
      setErrorMsg("Please enter both your Intern ID and registered email address.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/intern/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId: cleanId, email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.error ||
            "No matching record found for the provided Intern ID and registered email combination."
        );
        setIsLoading(false);
        return;
      }

      setResult(data.intern);
    } catch {
      setErrorMsg("Verification service network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopyInternId() {
    if (!result?.internId) return;
    navigator.clipboard.writeText(result.internId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  function handleCopyCertificate() {
    if (!result?.certificateNumber) return;
    navigator.clipboard.writeText(result.certificateNumber);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  }

  return (
    <div className="flex flex-col gap-16 pb-16 pt-6 sm:pt-10">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Intern Portal" }]} />

        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="primary" size="sm">
              INTERN SELF-SERVICE
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Intern Status & Certificate Portal
          </h1>
          <p className="text-base text-foreground-muted max-w-xl mx-auto leading-relaxed">
            Look up your official SiteSecura internship standing and access your cryptographically
            signed completion certificate when issued.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="mt-8 rounded-2xl border border-border bg-background-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Intern ID Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="internId"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground-muted"
                >
                  Official Intern ID
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-foreground-muted">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    id="internId"
                    type="text"
                    value={internIdInput}
                    onChange={(e) => setInternIdInput(e.target.value.toUpperCase())}
                    placeholder="SS-INT-YYYY-XXXXXX"
                    required
                    className="block w-full rounded-xl border border-border bg-background-secondary py-3 pl-10 pr-3 font-mono text-sm sm:text-base text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Registered Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="registeredEmail"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground-muted"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-foreground-muted">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="registeredEmail"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="candidate@example.com"
                    required
                    className="block w-full rounded-xl border border-border bg-background-secondary py-3 pl-10 pr-3 text-sm sm:text-base text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Helper Notice */}
            <div className="flex items-start gap-2 text-xs text-foreground-subtle bg-background-secondary/50 p-3 rounded-xl border border-border/40">
              <HelpCircle className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
              <span>
                Your Intern ID was sent to your registered email address upon enrollment confirmation
                (e.g., <code className="text-secondary font-mono">SS-INT-2026-A7K92P</code>). Both
                fields are required to protect your private record.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying identity & record...</span>
                </span>
              ) : (
                <span>Check Internship & Certificate Status</span>
              )}
            </Button>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results Card */}
          {result && (
            <div className="mt-6 p-6 rounded-2xl border border-secondary/30 bg-background-secondary/70 space-y-6 animate-fadeIn">
              {/* Header: Name, ID, Role, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-secondary uppercase tracking-widest font-bold">
                      {result.internId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyInternId}
                      aria-label="Copy Intern ID"
                      className="text-foreground-subtle hover:text-white transition-colors"
                    >
                      {copiedId ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mt-0.5">
                    {result.internName}
                  </h2>
                  <div className="text-xs text-foreground-muted font-medium">
                    {result.role}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={result.internshipStatus} />
                </div>
              </div>

              {/* Status & Tenure Details Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-foreground-muted">
                <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/50">
                  <span className="text-foreground-subtle text-[11px] uppercase tracking-wider">
                    Internship Period
                  </span>
                  <div className="text-foreground font-medium mt-0.5">
                    {result.startDate} to {result.endDate}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/50">
                  <span className="text-foreground-subtle text-[11px] uppercase tracking-wider">
                    Certificate Eligibility
                  </span>
                  <div className="mt-0.5">
                    {result.certificateStatus === "Issued" && (
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Issued & Ready to Download</span>
                      </span>
                    )}
                    {result.certificateStatus === "Eligible" && (
                      <span className="text-secondary font-semibold inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>Eligible (Pending HR Issuance)</span>
                      </span>
                    )}
                    {result.certificateStatus === "Not Eligible" && (
                      <span className="text-amber-400 font-medium inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>In Progress (Eligible upon Completion)</span>
                      </span>
                    )}
                    {result.certificateStatus === "Revoked" && (
                      <span className="text-red-400 font-semibold inline-flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Revoked by Administration</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Lifecycle Visual Milestone */}
              <div className="p-4 rounded-xl bg-background-card/60 border border-border/40 space-y-2">
                <div className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
                  Lifecycle Progression
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {["Registered", "Onboarding", "Active", "Completed"].map((stage, idx) => {
                    const stageOrder = ["Registered", "Onboarding", "Active", "Completed"];
                    const currentIdx = stageOrder.indexOf(result.internshipStatus);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = result.internshipStatus === stage;

                    return (
                      <React.Fragment key={stage}>
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] ${
                            isCurrent
                              ? "bg-primary text-white font-bold"
                              : isPassed
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-background-secondary text-foreground-subtle"
                          }`}
                        >
                          {isPassed && !isCurrent && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                          <span>{stage}</span>
                        </div>
                        {idx < 3 && <div className="h-0.5 w-3 bg-border" />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* State A: Certificate Issued & Available for Download */}
              {result.certificateStatus === "Issued" && result.downloadUrl && (
                <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Award className="h-5 w-5" />
                      <span>Official Certificate of Completion</span>
                    </div>
                    <Badge variant="success" size="sm">
                      VERIFIED CREDENTIAL
                    </Badge>
                  </div>

                  <div className="text-xs text-foreground-muted flex flex-wrap items-center gap-2">
                    <span>Certificate Identifier:</span>
                    <strong className="text-foreground font-mono font-bold">
                      {result.certificateNumber}
                    </strong>
                    <button
                      type="button"
                      onClick={handleCopyCertificate}
                      aria-label="Copy Certificate Number"
                      className="text-foreground-subtle hover:text-white"
                    >
                      {copiedCert ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    <span>• Issued {result.certificateIssueDate}</span>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-3">
                    <a
                      href={result.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Official PDF Certificate</span>
                    </a>

                    <Link
                      href={`/verify-internship?cert=${result.certificateNumber}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background-card hover:bg-background-secondary text-xs font-semibold text-foreground transition-colors"
                    >
                      <span>Public Verification Link</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* State B: Completed but Certificate Pending Issuance */}
              {result.certificateStatus === "Eligible" && (
                <div className="p-4 rounded-xl border border-secondary/40 bg-secondary/10 space-y-2 text-xs text-foreground-muted">
                  <div className="flex items-center gap-2 font-bold text-secondary text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Tenure Completed • Certificate Pending Issuance</span>
                  </div>
                  <p className="leading-relaxed">
                    Congratulations on completing your internship tenure! Your record is marked as
                    completed and is currently in the HR verification queue for final review and
                    certificate issuance. You will receive an email once your credential is signed.
                  </p>
                </div>
              )}

              {/* State C: Active Internship In Progress */}
              {result.certificateStatus === "Not Eligible" && result.internshipStatus !== "Withdrawn" && (
                <div className="p-4 rounded-xl border border-border/60 bg-background-card/50 text-xs text-foreground-muted space-y-1.5">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Internship In Progress</span>
                  </div>
                  <p className="leading-relaxed">
                    Official completion certificates are generated upon successful fulfillment of
                    your scheduled tenure ({result.startDate} to {result.endDate}) and mentor
                    sign-off. Keep up the great work!
                  </p>
                </div>
              )}

              {/* State D: Certificate Revoked */}
              {result.certificateStatus === "Revoked" && (
                <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-xs text-red-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Certificate Revoked</span>
                  </div>
                  <p className="leading-relaxed">
                    Certificate <strong className="font-mono text-white">{result.certificateNumber}</strong> has
                    been officially revoked by SiteSecura Administration. It is no longer valid for
                    professional verification and downloads are permanently disabled.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="pt-4 border-t border-border/60 text-center text-xs text-foreground-subtle flex items-center justify-center gap-2">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            <span>
              This lookup is rate-limited and enforces strict candidate data privacy protections.
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}
