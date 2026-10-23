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
  Layers,
  Sparkles,
  Compass,
  AlertTriangle,
  EyeOff,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Workflow,
  Network,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "About SiteSecura | Our Mission and Vision",
  description:
    "Learn about SiteSecura, our mission to simplify website security, and our commitment to clear, actionable digital posture insights.",
  path: "/about",
});

export default function AboutPage() {
  const problems = [
    {
      icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
      title: "Technical Complexity",
      description:
        "Modern cybersecurity terminology is frequently steeped in acronyms and opaque configurations, making it challenging for founders, agencies, and non-specialists to decipher what requires attention.",
    },
    {
      icon: <EyeOff className="h-6 w-6 text-secondary" />,
      title: "Limited Security Visibility",
      description:
        "Many website operators lack a clear, consolidated view of their domain configurations—such as SSL/TLS settings, DNS authentication records, and HTTP security response headers.",
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
      title: "Unclear Practical Next Steps",
      description:
        "Traditional automated tools often dump lengthy error logs without prioritizing risk or providing step-by-step guidance on how to fix issues on popular web hosting platforms.",
    },
  ];

  const principles = [
    {
      number: "01",
      title: "Clarity Over Unnecessary Complexity",
      description:
        "We distill intricate security configurations into straightforward, plain-language insights so anyone on your team can understand their site's security posture.",
    },
    {
      number: "02",
      title: "Practical Guidance Over Fear-Based Messaging",
      description:
        "We reject alarmist security marketing. Instead, we offer constructive, evidence-based recommendations that prioritize real-world impact and actionable remediation.",
    },
    {
      number: "03",
      title: "Responsible, Evidence-Based Communication",
      description:
        "Our analysis methodologies align with established internet standards, RFC specifications, and ethical disclosure practices, avoiding exaggerated vulnerability claims.",
    },
    {
      number: "04",
      title: "Continuous Learning & Improvement",
      description:
        "Web security standards continuously evolve. We foster an ongoing mindset of learning, adapting our tools to match current web architecture and operational realities.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-16 pt-6 sm:pt-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Container>
          <Breadcrumbs items={[{ label: "About Us" }]} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="primary" size="sm">
                ABOUT SITESECURA
              </Badge>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Making digital security{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  easier to understand.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
                We are building a more approachable way for businesses and website owners to
                understand security configurations, evaluate findings, and discover practical
                improvements.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button
                  href={siteConfig.platformUrl}
                  variant="primary"
                  size="md"
                  isExternal
                  icon={<ArrowUpRight className="h-4 w-4" />}
                >
                  Explore the Platform
                </Button>
                <Button href="/contact" variant="outline" size="md">
                  Connect With Us
                </Button>
              </div>
            </div>

            {/* Compact Shield & Abstract Network Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm p-8 rounded-2xl border border-border bg-background-card/90 shadow-2xl backdrop-blur-md text-center">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-xl pointer-events-none" />
                
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/40 shadow-inner mb-6">
                  <Shield className="h-10 w-10 text-secondary" />
                </div>

                <div className="relative space-y-3">
                  <h3 className="text-lg font-bold text-foreground">Our Guiding Principle</h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    Accessible posture evaluation paired with actionable remediation steps for every website owner.
                  </p>
                  <div className="pt-3 border-t border-border/50 flex items-center justify-center gap-4 text-xs font-mono text-secondary">
                    <span className="flex items-center gap-1">
                      <Network className="h-3.5 w-3.5" /> Clarity
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Workflow className="h-3.5 w-3.5" /> Action
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-2xl border border-primary/25 bg-background-secondary/80 flex flex-col justify-between">
              <div>
                <div className="p-3 w-fit rounded-xl bg-primary/10 border border-primary/30 text-primary mb-5">
                  <Compass className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  OUR MISSION
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Democratizing website security intelligence.
                </h2>
                <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
                  Our mission is to empower organizations, website managers, and developers with clear,
                  digestible diagnostics. By eliminating technical fog, we help web creators identify
                  vulnerabilities early and implement responsible defenses without friction.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border/60 text-xs font-semibold text-secondary">
                Simplicity • Practicality • Empowerment
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-2xl border border-secondary/25 bg-background-secondary/80 flex flex-col justify-between">
              <div>
                <div className="p-3 w-fit rounded-xl bg-secondary/10 border border-secondary/30 text-secondary mb-5">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                  OUR VISION
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  A web where better security decisions are within reach.
                </h2>
                <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
                  We envision a digital ecosystem where maintaining a secure website is as routine and
                  straightforward as managing content. Every online business should have the clarity
                  needed to safeguard its visitors and protect user trust.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border/60 text-xs font-semibold text-primary">
                A safer, more transparent web for all
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* The Problem We Address */}
      <section>
        <Container>
          <SectionHeader
            eyebrow="CHALLENGES"
            title="The common barriers to website security."
            description="Website security often breaks down not due to lack of interest, but due to friction and opacity in existing tooling."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <Card key={index}>
                <div className="p-3 w-fit rounded-xl bg-background-secondary border border-border/60 mb-5">
                  {problem.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                  {problem.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Approach & Principles */}
      <section id="principles">
        <Container>
          <SectionHeader
            eyebrow="CORE PRINCIPLES"
            title="How we approach our work."
            description="The values and standards that shape our software design, research ethics, and product philosophy."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((item, index) => (
              <div
                key={index}
                className="flex gap-5 p-6 sm:p-7 rounded-xl border border-border/70 bg-background-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/25 font-mono text-sm font-bold text-secondary">
                  {item.number}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Direction */}
      <section className="relative">
        <Container>
          <div className="p-8 sm:p-12 rounded-2xl border border-border bg-background-secondary/80 text-center max-w-4xl mx-auto space-y-6">
            <Badge variant="secondary" size="sm">
              PRODUCT ROADMAP & DIRECTION
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Built on responsible, continuous product development.
            </h2>

            <p className="text-sm sm:text-base text-foreground-muted leading-relaxed max-w-2xl mx-auto">
              Our active focus is delivering robust website checks, clear diagnostic reporting, and
              actionable security posture recommendations. As our platform expands, we aim to introduce
              monitoring capabilities that alert owners to drift in their security configuration.
            </p>

            <div className="pt-2">
              <Button
                href={siteConfig.platformUrl}
                variant="primary"
                size="md"
                isExternal
                icon={<ArrowUpRight className="h-4 w-4" />}
              >
                Explore the Main Platform
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section>
        <Container>
          <CtaBanner
            title="Interested in what we're building?"
            description="Learn how SiteSecura is simplifying website security or reach out to explore collaborative opportunities."
            primaryCtaText="Explore the Platform"
            primaryCtaHref={siteConfig.platformUrl}
            secondaryCtaText="Connect With Us"
            secondaryCtaHref="/contact"
          />
        </Container>
      </section>
    </div>
  );
}
