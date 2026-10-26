import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { constructMetadata } from "@/lib/metadata";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  ShieldCheck,
  Code2,
  FileText,
  Users,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Internship Program & Verification Standards | SiteSecura",
  description:
    "Learn about the SiteSecura Technology Internship Program, project-based curriculum, verifiable completion credentials, and credential authenticity standards.",
  path: "/internship-program",
});

export default function InternshipProgramPage() {
  const pillars = [
    {
      icon: <Code2 className="h-6 w-6 text-primary" />,
      title: "Real-World Engineering Challenges",
      description:
        "Interns build production-grade web components, API endpoints, and security research modules using modern tools like Next.js, TypeScript, Python, and cloud infrastructure.",
    },
    {
      icon: <Users className="h-6 w-6 text-secondary" />,
      title: "1-on-1 Mentorship & Asynchronous Review",
      description:
        "Direct code reviews, architectural feedback, and guidance from senior engineers. We teach industry standards in Git collaboration, accessibility, and documentation.",
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-400" />,
      title: "Cryptographically Verifiable Credentials",
      description:
        "Every graduating intern receives an official Certificate of Completion backed by a unique identifier (`SS-CERT-YYYY-XXXXXX`) and public QR verification portal.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-cyan-400" />,
      title: "Ethical & Responsible Practices",
      description:
        "Hands-on immersion in web security posture, responsible disclosure standards, and non-alarmist communication tailored for real-world business needs.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-16 pt-6 sm:pt-10">
      {/* Program Hero */}
      <section className="relative overflow-hidden">
        <Container>
          <Breadcrumbs items={[{ label: "Internship Program" }]} />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge variant="primary" size="sm">
                SITESECURA TALENT ACCELERATOR
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              The SiteSecura{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                Internship Program
              </span>
            </h1>

            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
              A structured, hands-on technology initiative designed for curious developers, security
              researchers, and designers eager to build practical software and earn verifiable
              credentials.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button href="/internships" variant="primary" size="md">
                Browse Internship Tracks
              </Button>
              <Button href="/intern-portal" variant="secondary" size="md">
                Intern Portal (Status & Certificate)
              </Button>
              <Button href="/verify-internship" variant="outline" size="md">
                Verify a Certificate
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Program Pillars */}
      <section>
        <Container>
          <SectionHeader
            eyebrow="PROGRAM HIGHLIGHTS"
            title="How our internship experience is structured."
            description="Our program is focused entirely on hands-on project deliverables, clean engineering standards, and real-world collaboration."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((item, index) => (
              <Card key={index} className="flex gap-4 p-6 sm:p-7">
                <div className="p-3 w-fit h-fit rounded-xl bg-background-secondary border border-border/60 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Credential Authenticity & Verification Standards */}
      <section className="relative">
        <Container>
          <div className="rounded-2xl border border-border bg-background-secondary/80 p-8 sm:p-12 space-y-8 max-w-4xl mx-auto">
            <div className="space-y-3 text-center sm:text-left">
              <Badge variant="secondary" size="sm">
                CREDENTIAL INTEGRITY
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                How our certificate verification works.
              </h2>
              <p className="text-sm text-foreground-muted leading-relaxed">
                SiteSecura credentials are permanently registered in our administrative repository and
                can be instantly validated by employers, academic institutions, and recruiters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-background-card border border-border/70 space-y-2">
                <div className="font-mono text-xs font-bold text-secondary">Step 1</div>
                <div className="font-bold text-foreground text-sm">Unique Identification</div>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Every issued certificate carries an immutable, cryptographically generated number
                  (e.g. `SS-CERT-2026-XXXXXX`).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background-card border border-border/70 space-y-2">
                <div className="font-mono text-xs font-bold text-secondary">Step 2</div>
                <div className="font-bold text-foreground text-sm">Direct QR Code Verification</div>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Scanning the high-resolution QR code on the certificate opens our public
                  verification server with zero intermediary accounts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background-card border border-border/70 space-y-2">
                <div className="font-mono text-xs font-bold text-secondary">Step 3</div>
                <div className="font-bold text-foreground text-sm">Privacy-Safe Confirmation</div>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Confirms the candidate name, role, tenure, and issuing officer without exposing
                  private candidate contact data.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-foreground-subtle">
                Are you an employer verifying an applicant?
              </div>
              <Button href="/verify-internship" variant="primary" size="sm">
                Open Public Verifier
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Program Tracks & Application CTA */}
      <section>
        <Container size="narrow">
          <div className="p-8 sm:p-10 rounded-2xl border border-primary/30 bg-gradient-to-b from-background-card to-background-secondary text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Ready to learn by building?
            </h2>
            <p className="text-sm text-foreground-muted max-w-lg mx-auto leading-relaxed">
              Explore our 6 specialized tracks across Frontend, Backend, Cybersecurity Research,
              UI/UX, Content, and Product. Express your interest today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/internships" variant="primary" size="md">
                View All Internship Tracks
              </Button>
              <Button href="/apply" variant="outline" size="md">
                Submit Expression of Interest
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
