import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";
import { CyberVisual } from "@/components/shared/CyberVisual";
import { CtaBanner } from "@/components/shared/CtaBanner";
import {
  ShieldCheck,
  Search,
  FileText,
  BellRing,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Building2,
  Rocket,
  Code2,
  Briefcase,
  Terminal,
  Cpu,
  Palette,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "SiteSecura | Website Security Should Be Simple",
  description:
    "Discover SiteSecura, a cybersecurity SaaS platform focused on understandable website security insights, practical recommendations, and accessible security awareness.",
  path: "/",
});

export default function HomePage() {
  const productFeatures = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Website Security Checks",
      description:
        "Inspect critical website security configurations including HTTPS enforcement, SSL/TLS protocol cipher support, DNS security records, and HTTP security response headers, subject to platform availability.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-secondary" />,
      title: "Security Insights",
      description:
        "Technical diagnostic findings are translated into clear, contextual explanations that help website owners understand why a configuration matters without overwhelming jargon.",
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-400" />,
      title: "Reports and Recommendations",
      description:
        "Access structured posture summaries and practical, prioritized remediation guidance designed to help technical teams or site administrators take confident next steps.",
    },
    {
      icon: <BellRing className="h-6 w-6 text-cyan-400" />,
      title: "Monitoring and Awareness",
      description:
        "Ongoing product evolution focused on tracking configuration changes over time, helping website operators maintain vigilance and digital posture awareness.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Understand",
      description:
        "Start with a clearer view of important website security configurations and how external clients encounter your domain.",
    },
    {
      number: "02",
      title: "Identify",
      description:
        "Understand detected issues, their operational context, and why certain misconfigurations may impact your security posture.",
    },
    {
      number: "03",
      title: "Improve",
      description:
        "Use practical, prioritized recommendations to guide the next steps for your web server, DNS provider, or hosting platform.",
    },
  ];

  const audiences = [
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: "Small Businesses",
      description:
        "Gain clear visibility into domain security fundamentals without needing an in-house security operations team or costly enterprise contracts.",
    },
    {
      icon: <Rocket className="h-6 w-6 text-secondary" />,
      title: "Startups and SaaS Teams",
      description:
        "Quickly review web configurations, ensure proper HTTPS and header enforcement, and instill trust across customers and stakeholders.",
    },
    {
      icon: <Code2 className="h-6 w-6 text-blue-400" />,
      title: "Developers & Freelancers",
      description:
        "Verify deployed web applications against modern security baselines with clear configuration suggestions for NGINX, Apache, and edge CDNs.",
    },
    {
      icon: <Briefcase className="h-6 w-6 text-cyan-400" />,
      title: "Web Agencies",
      description:
        "Deliver professional, verified client websites with clean security hygiene, proper SSL/TLS cipher suites, and documented email security records.",
    },
  ];

  const careerTracksPreview = [
    {
      icon: <Terminal className="h-6 w-6 text-primary" />,
      title: "Software Development",
      category: "Engineering",
      description:
        "Help build reliable inspection microservices, Next.js user interfaces, and resilient data processing systems.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-secondary" />,
      title: "Cybersecurity & Research",
      category: "Research",
      description:
        "Explore real-world web configurations, study modern attack vectors, and formulate evidence-based remediation advice.",
    },
    {
      icon: <Palette className="h-6 w-6 text-blue-400" />,
      title: "Design & Technical Content",
      category: "Design & Writing",
      description:
        "Craft intuitive user flows, accessible design tokens, and clear technical guides that make security approachable.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-16">
      {/* =========================================================================
          SECTION A: HERO SECTION
      ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle background glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-radial-hero opacity-80"
          aria-hidden="true"
        />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex justify-center lg:justify-start">
                <Badge variant="primary" size="sm">
                  WEBSITE SECURITY, MADE CLEARER
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Building a{" "}
                <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                  Safer Digital Future.
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-foreground-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                SiteSecura is building accessible website security tools that help businesses
                understand their digital security posture, identify configuration issues, and
                take practical steps toward a safer web presence.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  href={siteConfig.platformUrl}
                  variant="primary"
                  size="lg"
                  isExternal
                  icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Explore Our Platform
                </Button>

                <Button
                  href="/about"
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Discover SiteSecura
                </Button>
              </div>

              {/* Compact trust caption */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-foreground-subtle">
                <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                <span>Built around clarity, practical insights, and responsible security.</span>
              </div>
            </div>

            {/* Right Column: Custom Cybersecurity Visualization Preview */}
            <div className="lg:col-span-6">
              <CyberVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION B: BRAND INTRODUCTION (OUR APPROACH)
      ========================================================================= */}
      <section className="relative">
        <Container>
          <div className="rounded-2xl border border-border/80 bg-background-secondary/60 p-8 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <Badge variant="secondary" size="sm">
                  OUR APPROACH
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  Security should be understandable, not overwhelming.
                </h2>
                <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
                  Technical security information is often dense, intimidating, and difficult for
                  small business owners, developers, and non-specialists to interpret. SiteSecura
                  replaces ambiguity with clarity, helping teams focus on what matters most.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-border/60 bg-background-card/70 space-y-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="font-semibold text-foreground text-sm">Clear Security Insights</div>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    Plain-language breakdowns of technical diagnostics so anyone on your team can
                    grasp your site’s status.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-border/60 bg-background-card/70 space-y-2">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <div className="font-semibold text-foreground text-sm">Practical Recommendations</div>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    Actionable, step-by-step guidance tailored to remediate identified configuration
                    gaps effectively.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-border/60 bg-background-card/70 space-y-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <div className="font-semibold text-foreground text-sm">Accessible Reporting</div>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    Structured, clean overviews without unnecessary fear-driven marketing or inflated
                    vulnerability claims.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-border/60 bg-background-card/70 space-y-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div className="font-semibold text-foreground text-sm">Ongoing Posture Awareness</div>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    A sustained commitment to helping web administrators maintain vigilance over
                    evolving web baselines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION C: PRODUCT OVERVIEW
      ========================================================================= */}
      <section id="platform-overview">
        <Container>
          <SectionHeader
            eyebrow="THE PLATFORM"
            title="Clarity for your website security journey."
            description="SiteSecura is developing tools that help website owners understand important security configurations and make more informed decisions."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productFeatures.map((feature, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-background-secondary border border-border/60 mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-medium text-secondary flex items-center gap-1">
                  <span>Core capability</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              href={siteConfig.platformUrl}
              variant="secondary"
              size="md"
              isExternal
              icon={<ArrowUpRight className="h-4 w-4" />}
            >
              Explore the Main Platform
            </Button>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION D: HOW SITESECURA APPROACHES SECURITY (3-STEP PROCESS)
      ========================================================================= */}
      <section className="relative">
        <Container>
          <SectionHeader
            title="A clearer path to better website security."
            description="A methodical, transparent approach to understanding and enhancing your web presence step-by-step."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line on desktop */}
            <div
              className="hidden md:block absolute top-7 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-primary/30 via-secondary/40 to-primary/30 z-0"
              aria-hidden="true"
            />

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left bg-background-card/40 border border-border/60 rounded-xl p-6 sm:p-7 backdrop-blur-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/15 border border-primary/40 font-mono text-lg font-bold text-secondary mb-5 shadow-lg shadow-primary/10">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-foreground-subtle max-w-xl mx-auto">
            Note: Security review tools provide diagnostic posture insights and guidance; they do
            not guarantee immunity from all cyber threats or eliminate every vulnerability.
          </p>
        </Container>
      </section>

      {/* =========================================================================
          SECTION E: WHO SITESECURA IS FOR
      ========================================================================= */}
      <section>
        <Container>
          <SectionHeader
            eyebrow="AUDIENCE"
            title="Designed for modern web owners and operators."
            description="Whether running a storefront, building client projects, or launching SaaS products, accessible security posture belongs in your toolkit."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((item, index) => (
              <Card key={index} className="flex flex-col">
                <div className="p-3 w-fit rounded-xl bg-background-secondary border border-border/60 mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed flex-1">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION F: OUR MISSION
      ========================================================================= */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-b from-background-secondary via-background-card/80 to-background-secondary border-y border-border">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-full max-w-4xl bg-primary/10 blur-3xl rounded-full"
          aria-hidden="true"
        />

        <Container className="relative z-10 text-center max-w-3xl">
          <Badge variant="secondary" size="sm" className="mb-4">
            OUR MISSION
          </Badge>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Making website security more accessible.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-foreground-muted leading-relaxed">
            Our mission is to make website security information easier to understand and act on,
            especially for teams that do not have a dedicated cybersecurity department.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-widest text-secondary">
            <span>Clarity</span>
            <span>•</span>
            <span>Responsibility</span>
            <span>•</span>
            <span>Continuous Improvement</span>
          </div>

          <div className="mt-8">
            <Button href="/about" variant="primary" size="md">
              Learn About Us
            </Button>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION G: CAREERS PREVIEW
      ========================================================================= */}
      <section>
        <Container>
          <SectionHeader
            eyebrow="GROW WITH US"
            title="Help us build a safer web."
            description="We welcome people who are curious about technology, thoughtful problem-solving, and making digital security easier to understand."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerTracksPreview.map((track, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-background-secondary border border-border/60">
                      {track.icon}
                    </div>
                    <Badge variant="neutral" size="sm">
                      {track.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {track.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {track.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40 text-xs text-foreground-subtle">
                  Interest Area • Early Opportunities
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/careers" variant="outline" size="md">
              Explore Careers
            </Button>
            <Button href="/internships" variant="secondary" size="md">
              Explore Internships
            </Button>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION H: FINAL CTA
      ========================================================================= */}
      <section>
        <Container>
          <CtaBanner
            title="Let's make website security simpler."
            description="Explore the SiteSecura platform and learn more about our approach to accessible website security."
            primaryCtaText="Visit SiteSecura Platform"
            primaryCtaHref={siteConfig.platformUrl}
            secondaryCtaText="Contact Us"
            secondaryCtaHref="/contact"
          />
        </Container>
      </section>
    </div>
  );
}
