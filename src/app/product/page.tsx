import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CtaBanner } from "@/components/shared/CtaBanner";
import {
  Shield,
  Lock,
  Globe,
  FileCheck,
  BarChart3,
  FileText,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Key,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "SiteSecura Platform | Website Security Insights",
  description:
    "Explore the SiteSecura cybersecurity platform: website security checks, SSL/TLS analysis, DNS configuration insights, and actionable remediation guidance.",
  path: "/product",
});

export default function ProductPage() {
  const capabilities = [
    {
      id: "checks",
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "Website Security Checks",
      eyebrow: "Core Inspection",
      status: "Active Capability",
      description:
        "Comprehensive evaluations of fundamental web server endpoints, checking redirection logic, open protocol exposure, and canonical hostname handling.",
      features: [
        "Enforced HTTP to HTTPS redirection analysis",
        "Detection of mixed content risks on critical pages",
        "Server response inspection across modern protocols",
        "Non-intrusive diagnostic assessments",
      ],
    },
    {
      id: "ssl",
      icon: <Lock className="h-6 w-6 text-secondary" />,
      title: "SSL/TLS & HTTPS Visibility",
      eyebrow: "Encryption & Certificates",
      status: "Active Capability",
      description:
        "Clear visibility into cryptographic configurations, certificate validity dates, issuer authenticity, and deprecation warnings for outdated TLS versions.",
      features: [
        "Certificate expiration tracking and issuer verification",
        "Analysis of supported TLS protocol versions (TLS 1.2, TLS 1.3)",
        "Cipher suite posture evaluation against industry standards",
        "Identification of legacy SSL protocol vulnerabilities",
      ],
    },
    {
      id: "dns",
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      title: "DNS & Email-Security Configuration",
      eyebrow: "Domain Integrity",
      status: "Active Capability",
      description:
        "Review of essential DNS records that protect your domain authority, prevent domain spoofing, and safeguard outgoing communications.",
      features: [
        "SPF (Sender Policy Framework) record syntax review",
        "DKIM configuration presence checks",
        "DMARC policy alignment evaluation",
        "DNSSEC configuration visibility and zone security",
      ],
    },
    {
      id: "headers",
      icon: <FileCheck className="h-6 w-6 text-cyan-400" />,
      title: "Security Header Insights",
      eyebrow: "Browser Hardening",
      status: "Active Capability",
      description:
        "Detailed inspection of modern HTTP security headers that protect site visitors against cross-site scripting (XSS), clickjacking, and MIME confusion.",
      features: [
        "Strict-Transport-Security (HSTS) preload & max-age analysis",
        "Content-Security-Policy (CSP) directive evaluation",
        "X-Frame-Options & X-Content-Type-Options verification",
        "Referrer-Policy and Permissions-Policy recommendations",
      ],
    },
    {
      id: "scoring",
      icon: <BarChart3 className="h-6 w-6 text-emerald-400" />,
      title: "Security Scoring & Findings",
      eyebrow: "Posture Evaluation",
      status: "Active Capability",
      description:
        "Contextual categorization of detected misconfigurations, ranking findings by operational risk rather than theoretical severity.",
      features: [
        "Consolidated posture overview for rapid assessment",
        "Clear demarcation between critical gaps and hygiene suggestions",
        "Contextual explanations for non-technical stakeholders",
        "Evidence logs supporting each diagnostic finding",
      ],
    },
    {
      id: "reports",
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Reports & Practical Recommendations",
      eyebrow: "Actionable Guidance",
      status: "Active Capability",
      description:
        "Structured, human-friendly remediation guidance tailored for developers, DevOps engineers, and popular hosting control panels.",
      features: [
        "Copy-paste server configuration snippets (NGINX, Apache, Cloudflare)",
        "Prioritized checklist to resolve high-impact issues first",
        "Exportable findings summaries for development roadmaps",
        "No alarmist rhetoric—purely actionable guidance",
      ],
    },
    {
      id: "monitoring",
      icon: <Activity className="h-6 w-6 text-amber-400" />,
      title: "Monitoring & Drift Alerts",
      eyebrow: "Ongoing Vigilance",
      status: "Planned / In Development",
      description:
        "An evolving product direction focused on recurring automated checks, notifying website owners when certificates near expiration or configurations drift.",
      features: [
        "Automated scheduled re-inspections (planned)",
        "Notification on sudden certificate or DNS changes (planned)",
        "Historical posture tracking over monthly intervals (planned)",
        "Early warning against unintended misconfigurations (planned)",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-16 pt-6 sm:pt-10">
      {/* Product Hero Section */}
      <section className="relative overflow-hidden">
        <Container>
          <Breadcrumbs items={[{ label: "Product" }]} />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge variant="primary" size="sm">
                THE SITESECURA SAAS PLATFORM
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Understand your website security with{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                greater clarity.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
              Explore a developing security platform focused on useful website checks,
              understandable findings, and practical recommendations. Designed to empower teams
              without overwhelming them.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                href={siteConfig.platformUrl}
                variant="primary"
                size="lg"
                isExternal
                icon={<ArrowUpRight className="h-4 w-4" />}
              >
                Open SiteSecura
              </Button>
              <Button href="#capabilities" variant="outline" size="lg">
                Explore Capabilities
              </Button>
            </div>

            <p className="text-xs text-foreground-subtle">
              Access the live inspection platform directly at sitesecura.com
            </p>
          </div>
        </Container>
      </section>

      {/* Product Architecture Pillars */}
      <section id="capabilities" className="relative">
        <Container>
          <SectionHeader
            eyebrow="CAPABILITIES & SPECIFICATIONS"
            title="Essential website security, systematically organized."
            description="Our platform reviews key technical layers of your web perimeter, categorizing findings into understandable, actionable domains."
          />

          <div className="mt-14 space-y-8">
            {capabilities.map((item, index) => {
              const isPlanned = item.status.includes("Planned");

              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`rounded-2xl border p-6 sm:p-8 lg:p-10 transition-all duration-300 ${
                    isPlanned
                      ? "border-amber-500/30 bg-background-card/40"
                      : "border-border/80 bg-background-card/80 hover:border-primary/40 shadow-lg"
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left header */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-background-secondary border border-border/60">
                          {item.icon}
                        </div>
                        <Badge
                          variant={isPlanned ? "warning" : "secondary"}
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <div className="text-xs uppercase tracking-widest font-semibold text-foreground-muted">
                        {item.eyebrow}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        {item.title}
                      </h2>

                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Right features checklist */}
                    <div className="lg:col-span-7 bg-background-secondary/60 rounded-xl border border-border/60 p-5 sm:p-6">
                      <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
                        What this evaluates
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.features.map((feature, fIndex) => (
                          <div
                            key={fIndex}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground-muted"
                          >
                            <CheckCircle2
                              className={`h-4 w-4 shrink-0 mt-0.5 ${
                                isPlanned ? "text-amber-400" : "text-secondary"
                              }`}
                            />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Clarity & Verification Standard Notice */}
      <section>
        <Container>
          <div className="rounded-2xl border border-border bg-background-secondary/70 p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Responsible, Non-Invasive Diagnostics
            </h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              SiteSecura performs external, non-destructive configuration reviews based on public
              internet protocols (HTTP, TLS, DNS). We do not conduct aggressive penetration testing,
              exploit payloads, or intrusive scanning.
            </p>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section>
        <Container>
          <CtaBanner
            title="Ready to inspect your website posture?"
            description="Launch the SiteSecura platform at sitesecura.com to review your website's security configurations."
            primaryCtaText="Open SiteSecura Platform"
            primaryCtaHref={siteConfig.platformUrl}
            secondaryCtaText="Ask a Question"
            secondaryCtaHref="/contact"
          />
        </Container>
      </section>
    </div>
  );
}
