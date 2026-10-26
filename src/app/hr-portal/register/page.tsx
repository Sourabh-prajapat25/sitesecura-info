"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { INTERN_ROLES, InternRecord } from "@/types/intern";
import {
  UserPlus,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Printer,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function RegisterInternPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    role: "Frontend Developer Intern",
    customRole: "",
    startDate: "",
    endDate: "",
    linkedinUrl: "",
    instagramUrl: "",
    otherSocialUrl: "",
    portfolioUrl: "",
    college: "",
    courseYear: "",
    hrNotes: "",
    offerLetterRef: "",
    informedConsent: false,
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registeredIntern, setRegisteredIntern] = useState<InternRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize random idempotency key on mount
  useEffect(() => {
    setIdempotencyKey(
      `reg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    );
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setErrors((prev) => ({
          ...prev,
          resume: "Only PDF documents (.pdf) are permitted.",
        }));
        setResumeFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size exceeds the 5 MB maximum limit.",
        }));
        setResumeFile(null);
        return;
      }
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
      setResumeFile(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full legal name must be at least 2 characters.";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Valid email address is required.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number with country code is required (e.g. +91 9876543210).";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }
    if (formData.role === "Other" && !formData.customRole.trim()) {
      newErrors.customRole = "Please specify the custom role title.";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date cannot be prior to start date.";
    }
    if (!resumeFile) {
      newErrors.resume = "Resume PDF file is required.";
    }
    if (!formData.informedConsent) {
      newErrors.informedConsent = "Candidate consent acknowledgment is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(25);

    try {
      const data = new FormData();
      data.append("idempotencyKey", idempotencyKey);
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim());
      data.append("phone", formData.phone.trim());
      data.append("city", formData.city.trim());
      data.append("state", formData.state.trim());
      data.append("role", formData.role);
      if (formData.role === "Other") {
        data.append("customRole", formData.customRole.trim());
      }
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("linkedinUrl", formData.linkedinUrl.trim());
      data.append("instagramUrl", formData.instagramUrl.trim());
      data.append("otherSocialUrl", formData.otherSocialUrl.trim());
      data.append("portfolioUrl", formData.portfolioUrl.trim());
      data.append("college", formData.college.trim());
      data.append("courseYear", formData.courseYear.trim());
      data.append("hrNotes", formData.hrNotes.trim());
      data.append("offerLetterRef", formData.offerLetterRef.trim());
      data.append("informedConsent", "true");
      data.append("resume", resumeFile!);

      setUploadProgress(65);

      const res = await fetch("/api/hr/interns", {
        method: "POST",
        body: data,
      });

      setUploadProgress(90);
      const resData = await res.json();

      if (!res.ok) {
        if (resData.errors) {
          setErrors(resData.errors);
        } else {
          setErrors({ general: resData.error || "Failed to register intern." });
        }
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);
      setRegisteredIntern(resData.intern);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ general: "A network error occurred. Please retry." });
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  }

  function handleCopyId() {
    if (!registeredIntern) return;
    navigator.clipboard.writeText(registeredIntern.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleReset() {
    setRegisteredIntern(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      role: "Frontend Developer Intern",
      customRole: "",
      startDate: "",
      endDate: "",
      linkedinUrl: "",
      instagramUrl: "",
      otherSocialUrl: "",
      portfolioUrl: "",
      college: "",
      courseYear: "",
      hrNotes: "",
      offerLetterRef: "",
      informedConsent: false,
    });
    setResumeFile(null);
    setErrors({});
    setIdempotencyKey(`reg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <Container size="narrow">
        <Breadcrumbs
          items={[
            { label: "HR Portal", href: "/hr-portal/interns" },
            { label: "Register Intern" },
          ]}
        />

        {registeredIntern ? (
          /* ================= SUCCESS CONFIRMATION SCREEN ================= */
          <div className="rounded-2xl border border-emerald-500/30 bg-background-card p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <Badge variant="success" size="sm">
                REGISTRATION CONFIRMED
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Intern Successfully Registered
              </h1>
              <p className="text-sm text-foreground-muted max-w-md mx-auto">
                The intern has been permanently registered in the persistent store and Google Sheets
                administrative register.
              </p>
            </div>

            {/* Generated Intern ID Display Card */}
            <div className="p-6 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-secondary/10 text-center space-y-3">
              <div className="text-xs font-semibold uppercase tracking-widest text-secondary">
                Allocated Official Intern ID
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-foreground">
                {registeredIntern.id}
              </div>
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-card hover:bg-background-cardHover border border-border text-xs font-medium text-foreground transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-secondary" />
                      <span>Copy Intern ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Print-Friendly Registration Summary */}
            <div className="rounded-xl border border-border/70 bg-background-secondary/60 p-5 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <span className="font-bold uppercase tracking-wider text-foreground">
                  Registration Summary
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-white"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Summary</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-foreground-muted">
                <div>
                  <span className="text-foreground-subtle">Candidate Name:</span>{" "}
                  <strong className="text-foreground">{registeredIntern.fullName}</strong>
                </div>
                <div>
                  <span className="text-foreground-subtle">Role:</span>{" "}
                  <strong className="text-foreground">
                    {registeredIntern.customRole || registeredIntern.role}
                  </strong>
                </div>
                <div>
                  <span className="text-foreground-subtle">Email:</span> {registeredIntern.email}
                </div>
                <div>
                  <span className="text-foreground-subtle">Phone:</span> {registeredIntern.phone}
                </div>
                <div>
                  <span className="text-foreground-subtle">Location:</span>{" "}
                  {registeredIntern.city}, {registeredIntern.state}
                </div>
                <div>
                  <span className="text-foreground-subtle">Tenure:</span>{" "}
                  {registeredIntern.startDate} to {registeredIntern.endDate}
                </div>
                <div>
                  <span className="text-foreground-subtle">Registered Date:</span>{" "}
                  {new Date(registeredIntern.registrationTimestamp).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-foreground-subtle">Resume Stored:</span>{" "}
                  <span className="text-emerald-400 font-medium">Verified PDF</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-background-secondary hover:bg-background-card text-xs font-semibold text-foreground transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register Another Intern</span>
              </button>

              <Button
                href="/hr-portal/interns"
                variant="primary"
                size="md"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Go to Intern Directory
              </Button>
            </div>
          </div>
        ) : (
          /* ================= INTERN REGISTRATION FORM ================= */
          <div className="rounded-2xl border border-border bg-background-card/90 p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="space-y-2">
              <Badge variant="primary" size="sm">
                INTERNAL HR INTAKE
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Register New Intern
              </h1>
              <p className="text-xs sm:text-sm text-foreground-muted">
                Complete candidate onboarding details to allocate an official Intern ID and archive
                the verified resume.
              </p>
            </div>

            {errors.general && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {isSubmitting && (
              <div className="space-y-2 p-4 rounded-xl bg-background-secondary border border-border/60">
                <div className="flex justify-between text-xs text-foreground-muted">
                  <span>Uploading resume and saving to records...</span>
                  <span className="font-semibold text-secondary">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* --- SECTION 1: CANDIDATE IDENTITY --- */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-border/50 pb-2">
                  1. Candidate Identification (Required)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Full Legal Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alex.morgan@example.com"
                      required
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Phone (with Country Code) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 555-0199 or +91 9876543210"
                      required
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-400">{errors.phone}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-foreground-muted">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                        className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {errors.city && (
                        <p className="text-[11px] text-red-400">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-foreground-muted">
                        State <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        required
                        className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {errors.state && (
                        <p className="text-[11px] text-red-400">{errors.state}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SECTION 2: INTERNSHIP ROLE & DATES --- */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-border/50 pb-2">
                  2. Role & Tenure (Required)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Internship Role <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {INTERN_ROLES.map((roleOpt) => (
                        <option key={roleOpt} value={roleOpt} className="bg-background-card">
                          {roleOpt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.role === "Other" && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="block text-xs font-semibold text-foreground-muted">
                        Specify Custom Role Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="customRole"
                        value={formData.customRole}
                        onChange={handleInputChange}
                        placeholder="e.g. Cloud Operations Intern"
                        required
                        className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                      />
                      {errors.customRole && (
                        <p className="text-[11px] text-red-400">{errors.customRole}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Start Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                    {errors.startDate && (
                      <p className="text-[11px] text-red-400">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      End Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                    {errors.endDate && (
                      <p className="text-[11px] text-red-400">{errors.endDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* --- SECTION 3: RESUME UPLOAD (REQUIRED) --- */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-border/50 pb-2">
                  3. Resume Document (PDF, Max 5 MB) <span className="text-red-400">*</span>
                </h2>

                <div className="space-y-2">
                  <div className="relative border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-6 text-center bg-background-secondary/40 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="resume-upload"
                      required
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <UploadCloud className="h-8 w-8 text-secondary" />
                      {resumeFile ? (
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400">
                          <FileCheck2 className="h-4 w-4" />
                          <span>{resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs sm:text-sm text-foreground font-medium">
                            Drag & drop candidate resume PDF here, or click to browse
                          </p>
                          <p className="text-[11px] text-foreground-subtle mt-0.5">
                            PDF format only • Magic bytes & signatures validated on upload
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.resume && (
                    <p className="text-[11px] text-red-400">{errors.resume}</p>
                  )}
                </div>
              </div>

              {/* --- SECTION 4: OPTIONAL SOCIAL & EDUCATION --- */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-muted border-b border-border/50 pb-2">
                  4. Social & Education Profiles (Optional)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Portfolio or GitHub URL
                    </label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      College / University
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="e.g. Stanford University"
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Course & Year of Study
                    </label>
                    <input
                      type="text"
                      name="courseYear"
                      value={formData.courseYear}
                      onChange={handleInputChange}
                      placeholder="e.g. B.Tech Computer Science, 3rd Year"
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Offer Letter / Reference #
                    </label>
                    <input
                      type="text"
                      name="offerLetterRef"
                      value={formData.offerLetterRef}
                      onChange={handleInputChange}
                      placeholder="e.g. SS-OFFER-2026-081"
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground-muted">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      name="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/username"
                      className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="block text-xs font-semibold text-foreground-muted">
                    Administrative HR Notes
                  </label>
                  <textarea
                    name="hrNotes"
                    rows={2}
                    value={formData.hrNotes}
                    onChange={handleInputChange}
                    placeholder="Internal HR onboarding notes, mentor assignments, project focus..."
                    className="block w-full rounded-xl border border-border bg-background-secondary p-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* --- SECTION 5: CONSENT CONFIRMATION --- */}
              <div className="p-4 rounded-xl border border-border/80 bg-background-secondary/40 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="informedConsent"
                    checked={formData.informedConsent}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded border-border bg-background-secondary text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-foreground-muted leading-relaxed">
                    <strong className="text-foreground">Informed Consent Confirmation:</strong> I
                    verify that the candidate has been informed of and consented to the collection,
                    processing, and administrative archiving of their identity data, resume, and
                    tenure records pursuant to the SiteSecura Internship Program terms.
                  </span>
                </label>
                {errors.informedConsent && (
                  <p className="text-[11px] text-red-400 pl-7">{errors.informedConsent}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <Link
                  href="/hr-portal/interns"
                  className="text-xs text-foreground-muted hover:text-foreground"
                >
                  Cancel
                </Link>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Registering Intern...</span>
                    </span>
                  ) : (
                    <span>Register Intern & Allocate ID</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Container>
    </div>
  );
}
