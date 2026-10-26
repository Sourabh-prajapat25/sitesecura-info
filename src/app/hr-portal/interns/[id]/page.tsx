"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge, StatusBadge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { InternRecord, InternshipStatus } from "@/types/intern";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  ExternalLink,
  FileText,
  Award,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function InternDetailPage() {
  const params = useParams();
  const router = useRouter();
  const internId = params.id as string;

  const [intern, setIntern] = useState<InternRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusVal, setStatusVal] = useState<InternshipStatus>("Registered");
  const [hrNotesVal, setHrNotesVal] = useState("");
  const [offerLetterVal, setOfferLetterVal] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isIssuingCert, setIsIssuingCert] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchIntern = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/hr/interns/${internId}`);
      if (res.ok) {
        const data = await res.json();
        setIntern(data.intern);
        setStatusVal(data.intern.status);
        setHrNotesVal(data.intern.hrNotes || "");
        setOfferLetterVal(data.intern.offerLetterRef || "");
      } else {
        setMessage({ type: "error", text: "Intern record not found." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error loading record." });
    } finally {
      setIsLoading(false);
    }
  }, [internId]);

  useEffect(() => {
    if (internId) {
      fetchIntern();
    }
  }, [internId, fetchIntern]);

  async function handleUpdateStatusAndNotes(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/hr/interns/${internId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusVal,
          hrNotes: hrNotesVal,
          offerLetterRef: offerLetterVal,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIntern(data.intern);
        setMessage({ type: "success", text: "Record updated successfully." });
      } else {
        setMessage({ type: "error", text: data.error || "Update failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to submit updates." });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleIssueCertificate() {
    if (!intern) return;
    if (intern.status !== "Completed") {
      setMessage({
        type: "error",
        text: "Internship must be marked 'Completed' before issuing a certificate. Please update status first.",
      });
      return;
    }

    const confirmIssue = window.confirm(
      `Issue an official SiteSecura Certificate of Completion for ${intern.fullName}? This will generate a unique certificate number and immutable PDF.`
    );
    if (!confirmIssue) return;

    setIsIssuingCert(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/hr/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId: intern.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `Certificate ${data.certificateNumber} successfully issued!`,
        });
        fetchIntern();
      } else {
        setMessage({ type: "error", text: data.error || "Certificate issuance failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to issue certificate." });
    } finally {
      setIsIssuingCert(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-foreground-muted">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs sm:text-sm">Loading intern record...</span>
        </div>
      </div>
    );
  }

  if (!intern) {
    return (
      <Container size="narrow" className="py-16 text-center space-y-4">
        <div className="text-red-400 font-bold">Record Not Found</div>
        <p className="text-sm text-foreground-muted">
          The requested intern ID could not be located in the register.
        </p>
        <Button href="/hr-portal/interns" variant="outline">
          Back to Directory
        </Button>
      </Container>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Container>
        <Breadcrumbs
          items={[
            { label: "HR Portal", href: "/hr-portal" },
            { label: "Intern Directory", href: "/hr-portal/interns" },
            { label: intern.id },
          ]}
        />

        {/* Top Header Card */}
        <div className="rounded-2xl border border-border bg-background-card/90 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-secondary/15 text-secondary border border-secondary/30 font-bold">
                {intern.id}
              </span>
              <StatusBadge status={intern.status} />
              {intern.certificateNumber && (
                <Badge variant="success" size="sm">
                  <Award className="h-3 w-3" />
                  <span>Certificate Issued</span>
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {intern.fullName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-foreground-muted">
              <span className="text-primary font-semibold">
                {intern.customRole || intern.role}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-foreground-subtle" />
                {intern.city}, {intern.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-foreground-subtle" />
                {intern.startDate} to {intern.endDate}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/api/hr/resumes/${intern.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background-secondary hover:bg-background-card border border-border text-xs sm:text-sm font-semibold text-foreground transition-colors shadow-sm"
            >
              <FileText className="h-4 w-4 text-secondary" />
              <span>View Resume PDF</span>
            </a>

            <Link
              href="/hr-portal/interns"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-foreground-muted hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to List</span>
            </Link>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Candidate Full Profile */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact & Demographics */}
            <div className="rounded-2xl border border-border bg-background-card/80 p-6 space-y-4 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-border/50 pb-2">
                Candidate Contact & Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <div className="text-foreground-subtle text-[11px]">Email Address</div>
                  <div className="text-foreground font-medium mt-0.5 break-all">
                    {intern.email}
                  </div>
                </div>
                <div>
                  <div className="text-foreground-subtle text-[11px]">Phone Number</div>
                  <div className="text-foreground font-medium mt-0.5">{intern.phone}</div>
                </div>
                <div>
                  <div className="text-foreground-subtle text-[11px]">Location</div>
                  <div className="text-foreground font-medium mt-0.5">
                    {intern.city}, {intern.state}
                  </div>
                </div>
                <div>
                  <div className="text-foreground-subtle text-[11px]">Offer Letter Ref #</div>
                  <div className="text-foreground font-medium mt-0.5">
                    {intern.offerLetterRef || "None documented"}
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Profiles */}
            <div className="rounded-2xl border border-border bg-background-card/80 p-6 space-y-4 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-border/50 pb-2">
                Education & Web Profiles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <div className="text-foreground-subtle text-[11px]">College / University</div>
                  <div className="text-foreground font-medium mt-0.5">
                    {intern.college || "Not specified"}
                  </div>
                </div>
                <div>
                  <div className="text-foreground-subtle text-[11px]">Course & Year</div>
                  <div className="text-foreground font-medium mt-0.5">
                    {intern.courseYear || "Not specified"}
                  </div>
                </div>

                {intern.linkedinUrl && (
                  <div>
                    <div className="text-foreground-subtle text-[11px]">LinkedIn</div>
                    <a
                      href={intern.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {intern.portfolioUrl && (
                  <div>
                    <div className="text-foreground-subtle text-[11px]">Portfolio / GitHub</div>
                    <a
                      href={intern.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>View Code / Projects</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Audit History */}
            <div className="rounded-2xl border border-border bg-background-card/80 p-6 space-y-4 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-muted border-b border-border/50 pb-2 flex items-center justify-between">
                <span>Administrative Audit Log</span>
                <Clock className="h-3.5 w-3.5" />
              </h2>
              <div className="space-y-2.5">
                {(intern.auditLog || []).map((log, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-background-secondary border border-border/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-foreground-subtle text-[10px]">
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      <span className="font-mono">By: {log.actor}</span>
                    </div>
                    <div className="font-semibold text-foreground">{log.action}</div>
                    {log.details && (
                      <div className="text-foreground-muted">{log.details}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Status & Certificate Management */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status & Notes Editor */}
            <div className="rounded-2xl border border-border bg-background-card/80 p-6 space-y-4 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-border/50 pb-2">
                Status & Administrative Controls
              </h2>

              <form onSubmit={handleUpdateStatusAndNotes} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground-muted">
                    Internship Status
                  </label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as InternshipStatus)}
                    className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Registered">Registered</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Certificate Issued">Certificate Issued</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground-muted">
                    Offer Letter / Ref #
                  </label>
                  <input
                    type="text"
                    value={offerLetterVal}
                    onChange={(e) => setOfferLetterVal(e.target.value)}
                    placeholder="e.g. SS-OFFER-2026-081"
                    className="block w-full rounded-xl border border-border bg-background-secondary p-2 text-xs sm:text-sm text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground-muted">
                    Internal HR Notes
                  </label>
                  <textarea
                    rows={3}
                    value={hrNotesVal}
                    onChange={(e) => setHrNotesVal(e.target.value)}
                    placeholder="Performance reviews, project deliveries, completion notes..."
                    className="block w-full rounded-xl border border-border bg-background-secondary p-2 text-xs sm:text-sm text-foreground"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isUpdating}
                  className="w-full"
                  icon={<Save className="h-4 w-4" />}
                >
                  {isUpdating ? "Saving Changes..." : "Save Status & Notes"}
                </Button>
              </form>
            </div>

            {/* Certificate Issuance Section */}
            <div
              id="certificate"
              className="rounded-2xl border border-secondary/30 bg-background-card/90 p-6 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-sm font-bold uppercase tracking-wider text-secondary">
                  Completion Certificate
                </span>
                <Award className="h-5 w-5 text-secondary" />
              </div>

              {intern.certificateNumber ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                    <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      Official Certificate Number
                    </div>
                    <div className="font-mono text-base font-bold text-foreground">
                      {intern.certificateNumber}
                    </div>
                    <div className="text-[11px] text-foreground-muted">
                      Issued on: {intern.certificateIssueDate}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`/api/certificates/${intern.certificateNumber}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary/15 hover:bg-secondary/25 border border-secondary/40 text-secondary py-2.5 text-xs font-semibold transition-colors"
                    >
                      <Award className="h-4 w-4" />
                      <span>Download Certificate PDF</span>
                    </a>

                    <Link
                      href={`/verify-internship?cert=${intern.certificateNumber}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1.5 py-1.5 text-xs text-foreground-muted hover:text-white"
                    >
                      <span>Public Verification Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    Certificates can be generated once the intern has fulfilled their tenure and the
                    status is marked <strong className="text-foreground">Completed</strong>.
                  </p>

                  <div className="text-[11px] text-foreground-subtle">
                    Current Status: <strong className="text-secondary">{intern.status}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleIssueCertificate}
                    disabled={isIssuingCert || intern.status !== "Completed"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none py-2.5 text-xs font-semibold text-white shadow-lg transition-colors"
                  >
                    {isIssuingCert ? (
                      <span>Generating Certificate & Signing...</span>
                    ) : (
                      <>
                        <Award className="h-4 w-4" />
                        <span>Issue Completion Certificate</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
