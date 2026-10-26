"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  User,
  Mail,
  ArrowRight,
} from "lucide-react";

interface VerificationData {
  status: "Valid" | "Revoked" | "Not Found";
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
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const queryCert = searchParams.get("cert") || "";

  const [certInput, setCertInput] = useState(queryCert);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function performVerification(certNumber: string) {
    if (!certNumber.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch(`/api/verify?cert=${encodeURIComponent(certNumber.trim())}`);
      const data = await res.json();

      if (res.status === 429) {
        setErrorMsg("Verification request limit reached. Please wait a moment.");
        setIsLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setErrorMsg("Verification server could not be reached. Please retry.");
    } finally {
      setIsLoading(false);
    }
  }

  // Auto-verify if `?cert=` is present in the URL on mount
  useEffect(() => {
    if (queryCert) {
      setCertInput(queryCert);
      performVerification(queryCert);
    }
  }, [queryCert]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    performVerification(certInput);
  }

  return (
    <div className="flex flex-col gap-16 pb-16 pt-6 sm:pt-10">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Verify Certificate" }]} />

        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="primary" size="sm">
              PUBLIC CREDENTIAL VERIFIER
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Certificate Authenticity Verification
          </h1>
          <p className="text-base text-foreground-muted max-w-xl mx-auto leading-relaxed">
            Verify the validity of an official SiteSecura Internship Completion Certificate. Enter
            the certificate number or scan the QR code printed on the physical credential.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="mt-8 rounded-2xl border border-border bg-background-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="certificateNumber"
                className="block text-xs font-semibold uppercase tracking-wider text-foreground-muted"
              >
                Certificate Identifier (SS-CERT-YYYY-XXXXXX)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-foreground-muted">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  id="certificateNumber"
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value.toUpperCase())}
                  placeholder="e.g. SS-CERT-2026-B8M4Q2"
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
                  <span>Validating credential signature...</span>
                </span>
              ) : (
                <span>Verify Certificate Authenticity</span>
              )}
            </Button>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
              {errorMsg}
            </div>
          )}

          {/* Verification Results Panel */}
          {result && (
            <div className="mt-6 animate-fadeIn">
              {result.status === "Valid" && (
                <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-background-secondary to-background-secondary p-6 sm:p-8 space-y-6 shadow-xl">
                  {/* Status Banner */}
                  <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Official Verification Result
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                        Authentic & Valid Certificate
                      </div>
                    </div>
                  </div>

                  {/* Verified Details Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/60">
                      <div className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                        Recipient Name
                      </div>
                      <div className="text-base font-bold text-foreground mt-0.5">
                        {result.internName}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/60">
                      <div className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                        Internship Role
                      </div>
                      <div className="text-base font-bold text-primary mt-0.5">
                        {result.role}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/60">
                      <div className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                        Tenure Duration
                      </div>
                      <div className="font-medium text-foreground mt-0.5">
                        {result.startDate} to {result.endDate}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/60">
                      <div className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                        Certificate Number
                      </div>
                      <div className="font-mono font-bold text-secondary mt-0.5">
                        {result.certificateNumber}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/60">
                      <div className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                        Issuing Organization
                      </div>
                      <div className="font-medium text-foreground mt-0.5">
                        {result.issuingOrganization}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background-card/80 border border-border/60">
                      <div className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                        Issue Date & Signatory
                      </div>
                      <div className="font-medium text-foreground mt-0.5">
                        Issued {result.issueDate} • {result.signatoryName} ({result.signatoryTitle})
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-xs text-foreground-subtle border-t border-emerald-500/20">
                    This certificate record has been verified against the official SiteSecura
                    cryptographic register.
                  </div>
                </div>
              )}

              {result.status === "Revoked" && (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-8 w-8 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Verification Status
                      </div>
                      <div className="text-xl font-bold text-foreground">
                        Certificate Revoked
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {result.revocationNotice ||
                      "This certificate was formerly issued but has since been revoked by SiteSecura Administration."}
                  </p>
                </div>
              )}

              {result.status === "Not Found" && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 sm:p-8 space-y-3 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Certificate Not Found in Official Registry
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto leading-relaxed">
                    No verified certificate matches this identifier. Please double-check the
                    characters entered or scan the physical QR code directly.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Privacy & Authenticity Policy Notice */}
          <div className="pt-6 border-t border-border/60 space-y-2 text-xs text-foreground-muted">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Mail className="h-3.5 w-3.5 text-secondary" />
              <span>Questions regarding a credential?</span>
            </div>
            <p>
              If you require formal verification assistance or have questions regarding a candidate&apos;s
              completion standing, contact our verification office at{" "}
              <strong className="text-foreground">{siteConfig.contact.email}</strong>.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function VerifyInternshipPage() {
  return (
    <Suspense
      fallback={
        <Container size="narrow" className="py-24 text-center text-foreground-muted">
          Loading certificate verifier...
        </Container>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
