"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import {
  FileCheck2,
  ExternalLink,
  Mail,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

function ApplyContent() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track") || "";
  const [copied, setCopied] = React.useState(false);

  const formUrl =
    siteConfig.forms.generalApplicationUrl ||
    process.env.NEXT_PUBLIC_APPLICATION_FORM_URL;
  const isFormConfigured = Boolean(formUrl && formUrl.trim().length > 0);

  const careersEmail = siteConfig.contact.careersEmail;
  const emailSubject = trackParam
    ? `Expression of Interest: ${trackParam} - SiteSecura`
    : `Expression of Interest - SiteSecura Careers / Internships`;

  const emailBodyTemplate = `Hello SiteSecura Team,

I would like to express my interest in collaborating with SiteSecura${
    trackParam ? ` for the ${trackParam} track` : ""
  }.

Name: [Your Full Name]
Area of Interest: [Engineering / Security / Design / Content]
Key Skills: [e.g. Next.js, TypeScript, Python, DNS/TLS]
Portfolio / GitHub / LinkedIn: [Links]

Brief Motivation:
[Tell us a bit about yourself and what you're excited to build or learn]

Best regards,
[Your Name]`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(emailBodyTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex flex-col gap-12 pb-16 pt-6 sm:pt-10">
      <Container size="narrow">
        <Breadcrumbs
          items={[
            { label: "Careers", href: "/careers" },
            { label: "Expression of Interest" },
          ]}
        />

        <div className="text-center space-y-4">
          <Badge variant="primary" size="sm">
            APPLICANT PORTAL
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Express Your Interest in SiteSecura
          </h1>
          <p className="text-base text-foreground-muted max-w-xl mx-auto leading-relaxed">
            We welcome curious engineers, researchers, designers, and students to share what they
            love building.
          </p>
          {trackParam && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-xs font-semibold text-secondary">
                Selected Track: {trackParam}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic State: Configured External Form vs Graceful Fallback */}
        <div className="mt-8 rounded-2xl border border-border bg-background-card/90 p-6 sm:p-10 shadow-2xl space-y-6">
          {isFormConfigured ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary">
                <FileCheck2 className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  Official Application Form
                </h2>
                <p className="text-sm text-foreground-muted max-w-md mx-auto">
                  Please complete our official application form hosted securely via Google Forms. It
                  takes approximately 5–7 minutes.
                </p>
              </div>

              <div>
                <Button
                  href={formUrl!}
                  variant="primary"
                  size="lg"
                  isExternal
                  icon={<ExternalLink className="h-4 w-4" />}
                >
                  Open Application Form
                </Button>
              </div>

              <div className="pt-4 border-t border-border/50 text-xs text-foreground-subtle max-w-sm mx-auto">
                Your submission goes directly to our recruitment review panel. No applicant data is
                stored in your browser.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background-secondary border border-border/60">
                <AlertCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-semibold text-foreground">
                    Online Intake Form Under Preparation
                  </div>
                  <p className="text-foreground-muted leading-relaxed">
                    Our external Google Form intake link is currently being finalized. In the
                    interim, we invite you to express your interest directly via email to our team.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-foreground">
                  Direct Email Submission
                </h2>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                  Send your portfolio, GitHub profile, and a brief note describing your technical
                  interests to our dedicated careers mailbox:
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={`mailto:${careersEmail}?subject=${encodeURIComponent(
                      emailSubject
                    )}&body=${encodeURIComponent(emailBodyTemplate)}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send Email to {careersEmail}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background-secondary hover:bg-background-card px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span>Template Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-secondary" />
                        <span>Copy Submission Template</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background-secondary/80 border border-border/60 font-mono text-xs text-foreground-muted whitespace-pre-wrap leading-relaxed">
                {emailBodyTemplate}
              </div>
            </div>
          )}

          {/* Privacy & Safety Notice */}
          <div className="pt-4 border-t border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldAlert className="h-4 w-4 text-secondary" />
              <span>Safety & Fair Review Standards</span>
            </div>
            <ul className="text-xs text-foreground-muted space-y-1 pl-6 list-disc">
              <li>Do not include passwords, payment information, or sensitive identity IDs.</li>
              <li>Only submit public links to code repositories, design files, or articles.</li>
              <li>Submissions are treated with confidentiality per our Privacy Policy.</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <Container size="narrow" className="py-24 text-center text-foreground-muted">
          Loading application portal...
        </Container>
      }
    >
      <ApplyContent />
    </Suspense>
  );
}
