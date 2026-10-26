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
} from "lucide-react";

interface InternLookupResult {
  internId: string;
  internName: string;
  role: string;
  startDate: string;
  endDate: string;
  status: string;
  certificateAvailable: boolean;
  certificateNumber?: string;
  certificateIssueDate?: string;
  downloadUrl?: string;
}

export default function InternPortalPage() {
  const [internIdInput, setInternIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InternLookupResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const cleanId = internIdInput.trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg("Please enter your Intern ID.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/intern/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId: cleanId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.error || "No record found matching the specified Intern ID."
        );
        setIsLoading(false);
        return;
      }

      setResult(data.intern);
    } catch {
      setErrorMsg("Lookup network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-16 pb-16 pt-6 sm:pt-10">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Intern Portal" }]} />

        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="primary" size="sm">
              SELF-SERVICE CREDENTIAL PORTAL
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Intern Credential & Status Portal
          </h1>
          <p className="text-base text-foreground-muted max-w-xl mx-auto leading-relaxed">
            Enter your official SiteSecura Intern ID to view your enrollment status and access your
            completion certificate when issued.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="mt-8 rounded-2xl border border-border bg-background-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
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
                  placeholder="e.g. SS-INT-2026-A7K92P"
                  required
                  className="block w-full rounded-xl border border-border bg-background-secondary py-3 pl-10 pr-4 font-mono text-sm sm:text-base text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-wider"
                />
              </div>
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
                  <span>Looking up record...</span>
                </span>
              ) : (
                <span>Check Credential Status</span>
              )}
            </Button>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results Card */}
          {result && (
            <div className="mt-6 p-6 rounded-2xl border border-secondary/30 bg-background-secondary/70 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div>
                  <div className="text-[11px] font-mono text-secondary uppercase tracking-widest font-bold">
                    {result.internId}
                  </div>
                  <h2 className="text-xl font-bold text-foreground mt-0.5">
                    {result.internName}
                  </h2>
                  <div className="text-xs text-foreground-muted">
                    {result.role}
                  </div>
                </div>

                <div>
                  <StatusBadge status={result.status} />
                </div>
              </div>

              {/* Status & Tenure Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-foreground-muted">
                <div>
                  <span className="text-foreground-subtle">Internship Period:</span>
                  <div className="text-foreground font-medium mt-0.5">
                    {result.startDate} to {result.endDate}
                  </div>
                </div>

                <div>
                  <span className="text-foreground-subtle">Certificate Availability:</span>
                  <div className="mt-0.5">
                    {result.certificateAvailable ? (
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Ready for Download</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Pending Completion & Issuance</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificate Download Panel */}
              {result.certificateAvailable && result.downloadUrl ? (
                <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Award className="h-5 w-5" />
                    <span>Official Certificate of Completion</span>
                  </div>

                  <p className="text-xs text-foreground-muted">
                    Certificate Number:{" "}
                    <strong className="text-foreground font-mono">
                      {result.certificateNumber}
                    </strong>{" "}
                    • Issued on {result.certificateIssueDate}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-3">
                    <a
                      href={result.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Certificate PDF</span>
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
              ) : (
                <div className="p-4 rounded-xl border border-border/60 bg-background-card/50 text-xs text-foreground-muted space-y-1">
                  <div className="font-semibold text-foreground">
                    Notice on Certificate Issuance
                  </div>
                  <p>
                    Certificates are formally issued by SiteSecura HR upon successful completion of
                    the internship tenure and project deliverables. If you have completed your tenure,
                    please contact your mentor or HR coordinator.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="pt-4 border-t border-border/60 text-center text-xs text-foreground-subtle flex items-center justify-center gap-2">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            <span>
              This lookup is strictly rate-limited and protects personal candidate privacy.
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}
