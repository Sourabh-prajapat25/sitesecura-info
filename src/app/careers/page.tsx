import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  careerAreas,
  currentOpportunities,
  careersFaqs,
} from "@/config/careers";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/shared/Button";
import { Badge, StatusBadge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { ApplicationButton } from "@/components/shared/ApplicationButton";
import { CtaBanner } from "@/components/shared/CtaBanner";
import {
  Sparkles,
  Hammer,
  Lightbulb,
  Users,
  TrendingUp,
  Briefcase,
  ArrowRight,
  Code,
  Shield,
  Palette,
  FileText,
  MessageSquare,
  CheckCircle2,
  FileCode2,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Careers at SiteSecura | Build a Safer Digital Future",
  description:
    "Explore career areas, expressions of interest, and collaborative opportunities at SiteSecura. Join us in making website security accessible.",
  path: "/careers",
});

export default function CareersPage() {
  const whySiteSecura = [
    {
      icon: <Hammer className="h-6 w-6 text-primary" />,
      title: "Learn by Building",
      description:
        "Focus on practical challenges, shipping clean code, and experimenting with real architectural patterns in modern web infrastructure.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-secondary" />,
      title: "Solve Meaningful Problems",
      description:
        "Work on tools that demystify web security, helping small businesses and creators defend against real-world misconfigurations.",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Collaborate and Share Ideas",
      description:
        "We value thoughtful feedback, open communication, asynchronous collaboration, and mutual respect across digital workspaces.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
      title: "Grow Your Skills",
      description:
        "Expand your knowledge in modern full-stack development, DNS/TLS security research, UI design systems, and product communication.",
    },
  ];

  const recruitmentSteps = [
    {
      step: "01",
      title: "Submit Expression of Interest",
      description:
        "Share your profile, key skills, and links to your GitHub, live projects, or portfolio using our configured submission form.",
    },
    {
      step: "02",
      title: "Initial Profile Review",
      description:
        "We review submissions to evaluate your project experience, curiosity, and alignment with our current engineering or design roadmap.",
    },
    {
      step: "03",
      title: "Follow-up Conversation",
      description:
        "When an active requirement aligns with your background, we reach out to discuss your interests, availability, and expectations.",
    },
    {
      step: "04",
      title: "Role-Specific Discussion",
      description:
        "A practical, collaborative conversation or lightweight code/design walkthrough focused on relevant project needs.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-16 pt-6 sm:pt-10">
      {/* =========================================================================
          CAREERS HERO SECTION
      ========================================================================= */}
      <section className="relative overflow-hidden">
        <Container>
          <Breadcrumbs items={[{ label: "Careers" }]} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="primary" size="sm">
                CAREERS AT SITESECURA
              </Badge>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Build meaningful technology.{" "}
                <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                  Make the web safer.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
                We are interested in people who enjoy building useful products, solving technical
                problems, learning continuously, and making website security more accessible.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button href="#opportunities" variant="primary" size="md">
                  Explore Opportunities
                </Button>
                <ApplicationButton variant="outline" size="md">
                  Express Your Interest
                </ApplicationButton>
              </div>

              <div className="pt-2 text-xs text-foreground-subtle flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span>Expressions of interest reviewed as project tracks develop.</span>
              </div>
            </div>

            {/* Abstract Collaborative Workspace / Code Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-border bg-background-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-border/70 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="h-4 w-4 text-primary" />
                    <span className="text-xs font-mono text-foreground">sitesecura/collaborate</span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    Remote Digital Lab
                  </Badge>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-background-secondary border border-border/50 text-foreground-muted">
                    <span className="text-secondary">$</span> git checkout -b build-a-safer-web
                  </div>
                  <div className="p-3 rounded-lg bg-background-secondary border border-border/50 text-foreground-muted">
                    <div className="text-emerald-400">{"// Core working philosophy"}</div>
                    <div className="text-foreground mt-1">
                      clarity: true, respect: true, practicalImpact: &quot;high&quot;
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background-secondary border border-border/50 text-foreground-muted">
                    <div className="text-cyan-400">{"// Global remote collaboration"}</div>
                    <div className="text-foreground mt-1">
                      asyncFirst: true, openMinded: true
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-foreground-subtle">
                  <span>Honest recruitment standards</span>
                  <span>Zero fabricated claims</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          WHY SITESECURA (4 WORKING PRINCIPLES)
      ========================================================================= */}
      <section>
        <Container>
          <SectionHeader
            eyebrow="WHY SITESECURA"
            title="A culture built around craftsmanship and clarity."
            description="Our intended working principles emphasize practical experience, thoughtful peer feedback, and genuine problem solving."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySiteSecura.map((item, index) => (
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

          <p className="mt-8 text-center text-xs text-foreground-subtle max-w-xl mx-auto">
            These represent our core collaborative values and design philosophies, not guaranteed
            benefits or formal corporate employment commitments.
          </p>
        </Container>
      </section>

      {/* =========================================================================
          CAREER AREAS (EXPLORATION)
      ========================================================================= */}
      <section>
        <Container>
          <SectionHeader
            eyebrow="DISCIPLINES"
            title="Explore our focus areas."
            description="Discover the core technical and creative disciplines we actively develop. These outline our areas of interest as project scopes evolve."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerAreas.map((area) => (
              <Card key={area.id} className="flex flex-col justify-between">
                <div>
                  <Badge variant="neutral" size="sm" className="mb-3">
                    {area.eyebrow}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {area.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed mb-4">
                    {area.description}
                  </p>

                  <div className="space-y-1.5 border-t border-border/40 pt-4 mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                      Typical Focus
                    </div>
                    {area.focusAreas.slice(0, 3).map((focus, fIdx) => (
                      <div
                        key={fIdx}
                        className="text-xs text-foreground-muted flex items-center gap-1.5"
                      >
                        <span className="h-1 w-1 rounded-full bg-secondary" />
                        <span>{focus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
                  {area.recommendedSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-background-secondary text-[11px] text-foreground-muted border border-border/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CURRENT OPPORTUNITIES (DYNAMIC VIA CENTRAL CONFIG)
      ========================================================================= */}
      <section id="opportunities" className="relative">
        <Container>
          <SectionHeader
            eyebrow="OPPORTUNITIES"
            title="Current openings and expressions of interest."
            description="All active roles and general intake tracks are centrally configured. Roles marked 'Expression of Interest' invite candidates to submit their background for upcoming project needs."
          />

          <div className="mt-12 space-y-6">
            {currentOpportunities.map((role) => {
              const isOpen = role.status === "Open";
              const isClosed = role.status === "Closed";

              return (
                <div
                  key={role.id}
                  className="rounded-2xl border border-border/80 bg-background-card/80 p-6 sm:p-8 transition-all hover:border-primary/40 shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          {role.title}
                        </h2>
                        <StatusBadge status={role.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
                        <span>{role.category}</span>
                        <span>•</span>
                        <span>{role.employmentType}</span>
                        <span>•</span>
                        <span>{role.location}</span>
                        <span>•</span>
                        <span>{role.experienceLevel}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {!isClosed && (
                        <ApplicationButton
                          trackId={role.id}
                          trackTitle={role.title}
                          formUrl={role.applyUrl}
                          variant={isOpen ? "primary" : "secondary"}
                          size="md"
                        >
                          {isOpen ? "Apply Now" : "Express Interest"}
                        </ApplicationButton>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6 space-y-3">
                      <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                        {role.description}
                      </p>
                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                          Key Responsibilities
                        </div>
                        <ul className="space-y-1.5">
                          {role.responsibilities.map((resp, rIdx) => (
                            <li
                              key={rIdx}
                              className="text-xs text-foreground-muted flex items-start gap-2"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="lg:col-span-6 space-y-3 lg:border-l lg:border-border/60 lg:pl-6">
                      <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        Relevant Skills & Familiarity
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.skills.map((skill, sIdx) => (
                          <Badge key={sIdx} variant="neutral" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-4 text-xs text-foreground-subtle leading-relaxed">
                        Notice: We do not invent salary figures, working hours, or fixed dates
                        ahead of confirmed project requirements. All terms are communicated
                        transparently upon formal discussion.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          WHAT APPLICANTS SHOULD PREPARE & RECRUITMENT PROCESS
      ========================================================================= */}
      <section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* What to prepare */}
            <div className="lg:col-span-5 p-8 rounded-2xl border border-border bg-background-secondary/80 space-y-6">
              <Badge variant="secondary" size="sm">
                PREPARATION GUIDELINES
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                What to prepare for your application.
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                We believe in simple, respectful recruitment. You only need to provide relevant,
                public information that highlights what you enjoy building.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-foreground-muted">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <span>A concise introduction about your background and interests.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <span>Links to your GitHub profile, code repositories, or personal site.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <span>Live demos, UI prototypes, or technical articles you have written.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <span>Your primary areas of interest and anticipated availability.</span>
                </li>
              </ul>
              <div className="pt-2 text-[11px] text-foreground-subtle border-t border-border/60">
                Please never submit passwords, government ID copies, or sensitive personal data.
              </div>
            </div>

            {/* Recruitment Process */}
            <div className="lg:col-span-7 p-8 rounded-2xl border border-border bg-background-card/80 space-y-6">
              <Badge variant="primary" size="sm">
                HOW WE REVIEW
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Our collaborative review process.
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                An illustrative overview of how expressions of interest are processed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recruitmentSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl border border-border/60 bg-background-secondary/60 space-y-1.5"
                  >
                    <div className="font-mono text-xs font-bold text-secondary">
                      Step {step.step}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {step.title}
                    </div>
                    <div className="text-xs text-foreground-muted leading-relaxed">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-foreground-subtle">
                Submission of an application registers your interest but does not guarantee immediate
                selection or formal employment.
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CAREERS FAQ ACCORDION
      ========================================================================= */}
      <section id="faq">
        <Container size="narrow">
          <SectionHeader
            eyebrow="COMMON QUESTIONS"
            title="Careers and recruitment FAQ."
            description="Clear answers regarding work arrangements, eligibility, compensation transparency, and portfolio submissions."
          />

          <div className="mt-12">
            <FaqAccordion items={careersFaqs} />
          </div>
        </Container>
      </section>

      {/* =========================================================================
          FINAL CAREERS CTA
      ========================================================================= */}
      <section>
        <Container>
          <CtaBanner
            title="Interested in building with SiteSecura?"
            description="Browse our opportunities or express your interest to share what you love building with our team."
            primaryCtaText="Browse Opportunities"
            primaryCtaHref="#opportunities"
            secondaryCtaText="Express Your Interest"
            secondaryCtaHref="/apply"
          />
        </Container>
      </section>
    </div>
  );
}
