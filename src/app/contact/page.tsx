import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";
import {
  Mail,
  Shield,
  Briefcase,
  HelpCircle,
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Contact SiteSecura",
  description:
    "Get in touch with the SiteSecura team for inquiries regarding our website security platform, careers, internships, and partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  const contactChannels = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Product & Platform",
      eyebrow: "SaaS Diagnostic Inquiries",
      description:
        "Questions regarding our core website security checks, reporting formats, or platform feedback.",
      actionLabel: `Email ${siteConfig.contact.email}`,
      href: `mailto:${siteConfig.contact.email}?subject=Product%20Inquiry%20-%20SiteSecura`,
      ctaText: "Send Product Inquiry",
    },
    {
      icon: <Briefcase className="h-6 w-6 text-secondary" />,
      title: "Careers & Internships",
      eyebrow: "Recruitment & Tracks",
      description:
        "Inquiries about engineering roles, expressions of interest, student internships, or collaboration.",
      actionLabel: `Email ${siteConfig.contact.careersEmail}`,
      href: `mailto:${siteConfig.contact.careersEmail}?subject=Careers%20Inquiry%20-%20SiteSecura`,
      ctaText: "Contact Recruitment Team",
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-blue-400" />,
      title: "General Inquiries",
      eyebrow: "General Information",
      description:
        "Media inquiries, partnership discussions, or general feedback about the SiteSecura initiative.",
      actionLabel: `Email ${siteConfig.contact.email}`,
      href: `mailto:${siteConfig.contact.email}?subject=General%20Inquiry%20-%20SiteSecura`,
      ctaText: "Contact General Support",
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-16 pt-6 sm:pt-10">
      {/* Contact Hero */}
      <section className="relative overflow-hidden">
        <Container size="narrow">
          <Breadcrumbs items={[{ label: "Contact Us" }]} />

          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Badge variant="primary" size="sm">
                GET IN TOUCH
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Let&apos;s start a{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                conversation.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
              Have a question about SiteSecura, our platform, a collaboration, or an opportunity to
              work with us? Choose the most relevant way to get in touch.
            </p>
          </div>
        </Container>
      </section>

      {/* Direct Contact Cards */}
      <section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactChannels.map((channel, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-background-secondary border border-border/60">
                      {channel.icon}
                    </div>
                    <Badge variant="neutral" size="sm">
                      {channel.eyebrow}
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold text-foreground">
                    {channel.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {channel.description}
                  </p>

                  <div className="pt-2 text-xs font-mono text-secondary">
                    {channel.actionLabel}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60">
                  <Button
                    href={channel.href}
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={<Mail className="h-4 w-4" />}
                  >
                    {channel.ctaText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-foreground-subtle">
            All inquiries are directed to verified digital inboxes. We respect your privacy and do
            not share your contact information with external marketers.
          </div>
        </Container>
      </section>

      {/* Helpful Navigation Shortcuts */}
      <section>
        <Container size="narrow">
          <div className="rounded-2xl border border-border bg-background-secondary/80 p-8 sm:p-10 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center">
              Looking for something specific?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={siteConfig.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-border/70 bg-background-card hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground text-sm flex items-center justify-between">
                    <span>Main Platform</span>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-foreground-muted mt-1">
                    Access the live SaaS web scanner at sitesecura.com.
                  </p>
                </div>
              </a>

              <a
                href="/careers"
                className="p-4 rounded-xl border border-border/70 bg-background-card hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground text-sm flex items-center justify-between">
                    <span>Careers Portal</span>
                    <ArrowRight className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-xs text-foreground-muted mt-1">
                    Explore technology disciplines and expressions of interest.
                  </p>
                </div>
              </a>

              <a
                href="/internships"
                className="p-4 rounded-xl border border-border/70 bg-background-card hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground text-sm flex items-center justify-between">
                    <span>Internship Tracks</span>
                    <ArrowRight className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-xs text-foreground-muted mt-1">
                    Student and early-career learning tracks.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
