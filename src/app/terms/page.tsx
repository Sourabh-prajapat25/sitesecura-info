import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/shared/Badge";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service | SiteSecura",
  description:
    "Review the terms and conditions for accessing and using the SiteSecura informational website and educational security resources.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-12 pb-16 pt-6 sm:pt-10">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Terms of Service" }]} />

        <div className="space-y-4">
          <Badge variant="neutral" size="sm">
            LEGAL & USAGE
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-foreground-muted">
            Last Updated: October 2026 • Applicable to sitesecura.info
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background-card/70 p-6 sm:p-10 space-y-8 text-sm sm:text-base text-foreground-muted leading-relaxed">
          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and browsing <strong className="text-foreground">https://sitesecura.info</strong>,
              you acknowledge that you have read, understood, and agree to be bound by these Terms of
              Service. If you do not agree to these terms, please discontinue using this website.
            </p>
          </section>

          {/* Section 2: Informational Purpose & No Security Guarantee */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              2. Informational Purpose & Limitations of Security Guidance
            </h2>
            <p>
              All materials, articles, diagnostic overviews, and explanations published on this
              informational website are provided for general educational, conceptual, and informational
              purposes only.
            </p>
            <p className="p-4 rounded-xl bg-background-secondary border border-border/60 text-xs sm:text-sm text-foreground">
              <strong>Important Disclaimer:</strong> While SiteSecura aims to make website security
              concepts understandable and actionable, website security requires multifaceted defenses.
              No automated scan, diagnostic preview, or guidance document can guarantee complete
              protection against all vulnerabilities, targeted cyber attacks, software defects, or
              system intrusions. Content on this website does not constitute formal legal, regulatory,
              or specialized penetration-testing counsel.
            </p>
          </section>

          {/* Section 3: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              3. Intellectual Property Rights
            </h2>
            <p>
              The visual styling, custom UI layouts, text content, illustrations, and brand assets on
              this website are the intellectual property of SiteSecura and are protected by applicable
              copyright and intellectual property laws. You may not duplicate, reproduce, or resell the
              design assets or proprietary content without express prior written permission.
            </p>
          </section>

          {/* Section 4: Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              4. Acceptable Use
            </h2>
            <p>When accessing this website, you agree not to:</p>
            <ul className="space-y-1.5 pl-5 list-disc">
              <li>Engage in denial-of-service attempts or disrupt web delivery infrastructure.</li>
              <li>Attempt unauthorized penetration, probing, or vulnerability exploitation.</li>
              <li>Submit false, misleading, defamatory, or malicious application materials.</li>
              <li>Impersonate any individual, organization, or team representative.</li>
            </ul>
          </section>

          {/* Section 5: External Links & Main Product */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              5. External Links & Main Product Platform
            </h2>
            <p>
              This website links to third-party services and our primary SaaS application platform at{" "}
              <strong className="text-foreground">https://sitesecura.com</strong>. We are not
              responsible for the content, privacy practices, or availability of third-party websites or
              external form providers (such as Google Forms). Accessing external links is at your own
              discretion.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, SiteSecura, its founders, and
              contributors shall not be liable for any indirect, incidental, special, or consequential
              damages resulting from the use or inability to use this informational website or reliance
              upon any security guidance published herein.
            </p>
          </section>

          {/* Section 7: Inquiries */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              7. Contact & Questions
            </h2>
            <p>
              For inquiries regarding these terms, please contact:
            </p>
            <div className="p-4 rounded-xl bg-background-secondary border border-border/60 font-mono text-xs text-foreground">
              Email: {siteConfig.contact.email}
              <br />
              Subject: Terms Inquiry — SiteSecura
            </div>
            <p className="text-xs text-foreground-subtle italic">
              Notice: These terms represent a standard operational framework for this informational
              portal and do not replace formal jurisdiction-specific legal review for incorporated
              entities.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
