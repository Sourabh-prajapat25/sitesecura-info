import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { internshipTracks, internshipFaqs } from "@/config/careers";
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
  GraduationCap,
  Sparkles,
  BookOpen,
  Code2,
  FolderGit2,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Compass,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "SiteSecura Internships | Learn, Build and Grow",
  description:
    "Explore internship tracks in frontend, backend, cybersecurity research, UI/UX, and technical writing. Turn your curiosity into practical experience.",
  path: "/internships",
});

export default function InternshipsPage() {
  const whoCanApply = [
    {
      title: "University & College Students",
      description:
        "Students pursuing computer science, cybersecurity, software engineering, design, or related fields looking for hands-on project exposure.",
    },
    {
      title: "Recent Graduates",
      description:
        "Early-career graduates seeking to bridge academic theory and production-grade software development practices.",
    },
    {
      title: "Self-Taught Developers",
      description:
        "Passionate individuals building independent projects who want practical experience in a collaborative digital team setting.",
    },
    {
      title: "Early-Career Designers & Writers",
      description:
        "Emerging product designers and technical communicators who want to craft real-world interfaces and accessible educational guides.",
    },
  ];

  const whatToInclude = [
    {
      title: "Contact & Introduction",
      detail: "Your full name, preferred contact email, and a concise 2-3 sentence introduction.",
    },
    {
      title: "Track of Interest",
      detail: "Which internship discipline (Frontend, Backend, Security, UI/UX, Content, Product) aligns best.",
    },
    {
      title: "Public Project Links",
      detail: "Links to your GitHub profile, public repositories, Figma files, or personal portfolio.",
    },
    {
      title: "Short Motivation Note",
      detail: "A brief statement on what you hope to learn and what excites you about website security.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-16 pt-6 sm:pt-10">
      {/* =========================================================================
          INTERNSHIP HERO SECTION
      ========================================================================= */}
      <section className="relative overflow-hidden">
        <Container>
          <Breadcrumbs items={[{ label: "Internships" }]} />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge variant="primary" size="sm">
                LEARN. BUILD. GROW.
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Turn your curiosity into{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                practical experience.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
              Explore opportunities to learn about product development, website security, software
              engineering, design, and technical communication. Build real portfolio projects while
              contributing to accessible web tools.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button href="#tracks" variant="primary" size="lg">
                Explore Internship Tracks
              </Button>
              <ApplicationButton
                variant="outline"
                size="lg"
                formUrl={siteConfig.forms.internshipApplicationUrl}
              >
                Apply / Express Interest
              </ApplicationButton>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2 text-xs text-foreground-subtle">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span>
                Transparent guidelines • Cohort schedules confirmed upon formal posting
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          INTERNSHIP TRACKS (6 DETAILED TRACK CARDS)
      ========================================================================= */}
      <section id="tracks" className="relative">
        <Container>
          <SectionHeader
            eyebrow="LEARNING TRACKS"
            title="Choose your area of focus."
            description="Our structured tracks outline the technical topics, foundational skills, and hands-on portfolio projects you can develop."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internshipTracks.map((track) => (
              <div
                key={track.id}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background-card/80 p-6 sm:p-7 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral" size="sm">
                      {track.eyebrow}
                    </Badge>
                    <StatusBadge status={track.status} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {track.title}
                    </h2>
                    <p className="text-xs font-medium text-secondary mt-1">
                      {track.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {track.description}
                  </p>

                  {/* Areas of Learning */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Example Learning Focus
                    </div>
                    <ul className="space-y-1.5">
                      {track.learningAreas.map((area, aIdx) => (
                        <li
                          key={aIdx}
                          className="text-xs text-foreground-muted flex items-start gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Foundational Skills */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Helpful Starting Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {track.foundationalSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-background-secondary text-[11px] text-foreground-muted border border-border/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Projects */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Suggested Portfolio Projects
                    </div>
                    <ul className="space-y-1">
                      {track.suggestedProjects.map((proj, pIdx) => (
                        <li
                          key={pIdx}
                          className="text-xs text-foreground-subtle italic flex items-start gap-1.5"
                        >
                          <span>•</span>
                          <span>{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <ApplicationButton
                    trackId={track.id}
                    trackTitle={track.title}
                    formUrl={track.applyUrl || siteConfig.forms.internshipApplicationUrl}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Express Interest in Track
                  </ApplicationButton>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-foreground-subtle">
            Note: Requirements and project assignments depend on each confirmed cohort. Tracks
            describe learning areas and do not guarantee active vacancies at all times.
          </div>
        </Container>
      </section>

      {/* =========================================================================
          WHO CAN APPLY & APPLICATION PREPARATION
      ========================================================================= */}
      <section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Who can apply */}
            <div className="lg:col-span-6 p-8 rounded-2xl border border-border bg-background-secondary/80 space-y-6">
              <Badge variant="primary" size="sm">
                ELIGIBILITY & DIVERSITY
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Who can apply for our internship tracks?
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                We believe curiosity, discipline, and building real projects matter far more than
                rigid credentials. No specific degree or university affiliation is mandatory.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whoCanApply.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-border/60 bg-background-card/60 space-y-1.5"
                  >
                    <div className="text-sm font-semibold text-foreground">
                      {item.title}
                    </div>
                    <div className="text-xs text-foreground-muted leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to include */}
            <div className="lg:col-span-6 p-8 rounded-2xl border border-border bg-background-card/80 space-y-6">
              <Badge variant="secondary" size="sm">
                APPLICATION DETAILS
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                What to include in your submission.
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                We keep the application concise and respectful of your time. Only include information
                directly relevant to evaluating your technical curiosity.
              </p>

              <div className="space-y-3">
                {whatToInclude.map((item, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-border/60 bg-background-secondary/60 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        {item.title}
                      </div>
                      <div className="text-xs text-foreground-muted mt-0.5">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-foreground-subtle border-t border-border/50">
                Safety note: Never submit passwords, credit card numbers, or government ID numbers.
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          INTERNSHIP FAQ ACCORDION
      ========================================================================= */}
      <section id="faq">
        <Container size="narrow">
          <SectionHeader
            eyebrow="STUDENT FAQ"
            title="Internship program FAQ."
            description="Answers to common questions regarding cohorts, remote collaboration, compensation transparency, and feedback."
          />

          <div className="mt-12">
            <FaqAccordion items={internshipFaqs} />
          </div>
        </Container>
      </section>

      {/* =========================================================================
          FINAL INTERNSHIP CTA
      ========================================================================= */}
      <section>
        <Container>
          <CtaBanner
            title="Start with curiosity. Build with purpose."
            description="Submit your expression of interest today. We review applications regularly as new project cohorts are planned."
            primaryCtaText="Submit Your Interest"
            primaryCtaHref="/apply"
            secondaryCtaText="Contact Us"
            secondaryCtaHref="/contact"
          />
        </Container>
      </section>
    </div>
  );
}
