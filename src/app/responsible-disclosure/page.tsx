import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { ShieldAlert, ShieldCheck, Mail, AlertTriangle, FileCode2, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Responsible Disclosure Policy | SiteSecura",
  description:
    "Guidelines on reporting potential security issues and vulnerability findings responsibly to the SiteSecura team.",
  path: "/responsible-disclosure",
});

export default function ResponsibleDisclosurePage() {
  const securityEmail =
    siteConfig.contact.securityEmail || siteConfig.contact.email;

  const expectations = [
    {
      title: "Non-Destructive Testing",
      description:
        "Perform testing only to demonstrate proof-of-concept. Avoid actions that could cause denial of service, service disruption, or data alteration.",
    },
    {
      title: "Respect User Privacy",
      description:
        "Do not view, exfiltrate, alter, or destroy data belonging to any third-party user or domain. If sensitive data is inadvertently accessed, halt testing and report immediately.",
    },
    {
      title: "Detailed Reproduction Steps",
      description:
        "Provide clear step-by-step reproduction instructions, HTTP request/response transcripts, and proof-of-concept details so our team can verify and remediate promptly.",
    },
    {
      title: "Coordinated Disclosure Window",
      description:
        "Allow our engineering team reasonable time (typically 30–60 days) to validate, investigate, and roll out a patch prior to any public disclosure.",
    },
  ];

  const outOfScope = [
    "Volumetric denial-of-service (DoS/DDoS) attacks against our domains or infrastructure",
    "Physical security attacks against any facility or personnel",
    "Social engineering, phishing, or pretexting aimed at team members",
    "Reports derived solely from automated vulnerability scanners without manual proof-of-concept verification",
    "Missing rate-limiting on non-sensitive static endpoints",
    "Disclosure of known public TLS configurations that do not present a demonstrable vulnerability",
  ];

  return (
    <div className="flex flex-col gap-12 pb-16 pt-6 sm:pt-10">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Responsible Disclosure" }]} />

        <div className="space-y-4">
          <Badge variant="primary" size="sm">
            SECURITY RESEARCH & ETHICS
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Responsible Disclosure Policy
          </h1>
          <p className="text-sm text-foreground-muted">
            Guidelines for reporting security vulnerabilities to the SiteSecura project.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background-card/70 p-6 sm:p-10 space-y-8 text-sm sm:text-base text-foreground-muted leading-relaxed">
          {/* Section 1: Commitment */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              1. Our Commitment to Web Security
            </h2>
            <p>
              At SiteSecura, security and integrity are foundational to everything we build. We
              welcome constructive, ethical contributions from independent security researchers,
              students, and developers who identify potential security issues within our digital
              assets.
            </p>
            <p>
              If you believe you have discovered a security vulnerability in our informational web
              presence (<strong className="text-foreground">sitesecura.info</strong>) or related
              services, we encourage you to report it to us in accordance with this policy.
            </p>
          </section>

          {/* Section 2: Research Expectations */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              2. Research Guidelines & Expectations
            </h2>
            <p>
              To act in good faith and prevent harm to visitors or infrastructure, all research must
              strictly adhere to the following principles:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {expectations.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-border/60 bg-background-secondary/60 space-y-1.5"
                >
                  <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: How to Submit a Report */}
          <section className="space-y-4 border-t border-border/60 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              3. How to Submit a Security Report
            </h2>
            <p>
              Please submit your findings directly to our configured security intake channel:
            </p>

            <div className="p-5 rounded-xl border border-primary/30 bg-background-secondary space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>Security Reporting Inbox</span>
              </div>
              <div className="font-mono text-xs text-secondary break-all">
                {securityEmail}
              </div>
              <p className="text-xs text-foreground-muted">
                Please include a descriptive subject line (e.g. &quot;[Security Report] XSS in
                sitesecura.info&quot;) and attach reproducible proof-of-concept steps.
              </p>

              <div className="pt-2">
                <Button
                  href={`mailto:${securityEmail}?subject=${encodeURIComponent(
                    "[Security Disclosure] Potential Vulnerability Report"
                  )}`}
                  variant="primary"
                  size="sm"
                  icon={<Mail className="h-3.5 w-3.5" />}
                >
                  Draft Report Email
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="font-semibold text-foreground">What to include in your report:</div>
              <ul className="space-y-1.5 pl-5 list-disc text-foreground-muted">
                <li>Affected URL, component, or parameter</li>
                <li>Clear description of the underlying flaw and potential impact</li>
                <li>Step-by-step reproduction guide or minimal script</li>
                <li>Suggested remediation advice if known</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Out of Scope */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              4. Out-of-Scope Research & Exclusions
            </h2>
            <p>The following activities and theoretical findings are strictly out of scope:</p>
            <ul className="space-y-2 pl-5 list-disc text-xs sm:text-sm text-foreground-muted">
              {outOfScope.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 5: Bounty and Recognition Clarification */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              5. Rewards & Bounty Clarification
            </h2>
            <div className="p-4 rounded-xl bg-background-secondary border border-border/60 text-xs sm:text-sm text-foreground-muted leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Notice regarding Bug Bounties & Financial Rewards</span>
              </div>
              <p>
                SiteSecura does not currently operate a paid bug bounty program or provide monetary
                compensation for vulnerability reports. Submissions are made on a voluntary basis. We
                are grateful to ethical researchers who help us maintain a secure environment and
                offer our sincere acknowledgment for confirmed, actionable disclosures.
              </p>
            </div>
          </section>

          {/* Section 6: Safe Harbor */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              6. Safe Harbor Protection
            </h2>
            <p>
              If you conduct security research in compliance with all guidelines outlined in this
              policy, we consider your activities authorized and will not initiate legal action
              against you.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
