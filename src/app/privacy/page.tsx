import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/shared/Badge";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | SiteSecura",
  description:
    "Learn how SiteSecura handles information collected via our informational website, contact inquiries, and external recruitment forms.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-12 pb-16 pt-6 sm:pt-10">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <div className="space-y-4">
          <Badge variant="neutral" size="sm">
            LEGAL & TRANSPARENCY
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-foreground-muted">
            Last Updated: October 2026 • Effective for sitesecura.info
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background-card/70 p-6 sm:p-10 space-y-8 text-sm sm:text-base text-foreground-muted leading-relaxed">
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              1. Overview and Scope
            </h2>
            <p>
              This Privacy Policy explains how SiteSecura (&quot;we&quot;, &quot;our&quot;, or &quot;the project&quot;)
              collects, uses, and safeguards information when you visit our primary informational
              website at <strong className="text-foreground">https://sitesecura.info</strong>.
            </p>
            <p>
              This website serves an informational purpose—communicating our product vision, sharing
              educational website security insights, publishing recruitment opportunities, and providing
              contact channels. It operates independently from our main product platform hosted at{" "}
              <strong className="text-foreground">https://sitesecura.com</strong>.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              2. Information Collected
            </h2>
            <p>
              We prioritize minimal data collection. We do not require visitors to register an account
              to browse this informational website.
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-foreground">Direct Inquiries:</strong> When you contact us via
                email, we collect your email address, your name (if provided), and the content of your
                message to respond to your inquiry.
              </li>
              <li>
                <strong className="text-foreground">Recruitment & Expressions of Interest:</strong> When
                you apply for an internship or career opportunity via our configured intake form (such as
                Google Forms) or via direct email, you may voluntarily share contact details, your
                resume, links to public repositories (e.g., GitHub), or portfolio websites.
              </li>
              <li>
                <strong className="text-foreground">Standard Server Logs:</strong> Like standard web
                services, hosting providers (such as Vercel) may log standard technical data such as
                IP addresses, browser type, referring URLs, and request timestamps strictly for
                security diagnostics and uptime monitoring.
              </li>
            </ul>
          </section>

          {/* Section 3: How We Use Information */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              3. How Information Is Used
            </h2>
            <p>We use information submitted by visitors exclusively to:</p>
            <ul className="space-y-1.5 pl-5 list-disc">
              <li>Respond to direct questions regarding the SiteSecura platform or research.</li>
              <li>Evaluate candidates who submit expressions of interest for careers or internships.</li>
              <li>Communicate updates to interested applicants regarding relevant project cohorts.</li>
              <li>Maintain the operational stability, reliability, and security of the website.</li>
            </ul>
            <p>
              We do not sell, rent, monetize, or trade applicant or visitor contact information to third
              parties for marketing purposes.
            </p>
          </section>

          {/* Section 4: External Form Providers & Third Parties */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              4. External Form Providers and Hosting
            </h2>
            <p>
              To keep recruitment processes simple and secure, we may utilize third-party form
              providers (such as Google Forms) to collect expressions of interest. Submissions made
              through these external platforms are subject to their respective privacy terms and security
              safeguards. We recommend reviewing the Google Privacy Policy when completing external forms.
            </p>
            <p>
              Our website is deployed on Vercel infrastructure, which complies with high-standard
              security practices for static asset delivery and edge routing.
            </p>
          </section>

          {/* Section 5: Data Retention & Security */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              5. Data Retention & Safeguards
            </h2>
            <p>
              Recruitment submissions are retained only as long as necessary to evaluate upcoming
              cohorts and collaborative projects. If you would like your application details removed or
              updated, you may contact our recruitment team at any time.
            </p>
            <p>
              We implement reasonable technical safeguards to protect information against unauthorized
              access. However, please remember that no transmission across the open internet is
              completely infallible. We specifically advise applicants never to transmit passwords,
              financial information, or government identification cards.
            </p>
          </section>

          {/* Section 6: Cookies and Tracking */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              6. Cookies & Tracking
            </h2>
            <p>
              This informational website does not use invasive third-party tracking pixels, cross-site
              behavioral trackers, or marketing surveillance tools. Any browser storage utilized is
              strictly limited to functional necessities (such as user interface preferences).
            </p>
          </section>

          {/* Section 7: Contact & Questions */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              7. Privacy Inquiries
            </h2>
            <p>
              If you have questions regarding this policy or wish to request deletion of any
              voluntarily submitted contact information, please reach out to:
            </p>
            <div className="p-4 rounded-xl bg-background-secondary border border-border/60 font-mono text-xs text-foreground">
              Email: {siteConfig.contact.email}
              <br />
              Subject: Privacy Inquiry — SiteSecura
            </div>
            <p className="text-xs text-foreground-subtle italic">
              Note for site administration: This policy reflects the current informational deployment
              of sitesecura.info and does not replace formal legal counsel for registered corporate
              entities.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
