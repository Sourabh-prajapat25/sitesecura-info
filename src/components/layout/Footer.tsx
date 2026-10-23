import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Shield, ArrowUpRight, Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const hasGithub = Boolean(siteConfig.socials.github);
  const hasLinkedin = Boolean(siteConfig.socials.linkedin);
  const hasTwitter = Boolean(siteConfig.socials.twitter);
  const hasSocials = hasGithub || hasLinkedin || hasTwitter;

  return (
    <footer className="border-t border-border bg-background-secondary/90 pt-16 pb-12 text-sm text-foreground-muted">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-border/60">
          {/* Brand info column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/15 border border-primary/30">
                <Shield className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SiteSecura
              </span>
            </Link>

            <p className="text-xs uppercase tracking-wider font-semibold text-secondary">
              {siteConfig.tagline}
            </p>

            <p className="text-sm text-foreground-muted leading-relaxed max-w-sm">
              Building accessible website security tools to help businesses and website owners
              understand their digital security posture, identify configuration issues, and take
              practical remediation steps.
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2 text-foreground-subtle">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <p className="text-[11px] text-foreground-subtle">
                {siteConfig.contact.locationNote}
              </p>
            </div>

            {hasSocials && (
              <div className="pt-2 flex items-center gap-3">
                {hasGithub && (
                  <a
                    href={siteConfig.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-background-card hover:bg-background-cardHover text-foreground-muted hover:text-white transition-colors border border-border"
                    aria-label="SiteSecura on GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {hasLinkedin && (
                  <a
                    href={siteConfig.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-background-card hover:bg-background-cardHover text-foreground-muted hover:text-white transition-colors border border-border"
                    aria-label="SiteSecura on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {hasTwitter && (
                  <a
                    href={siteConfig.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-background-card hover:bg-background-cardHover text-foreground-muted hover:text-white transition-colors border border-border"
                    aria-label="SiteSecura on Twitter / X"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product & Vision
            </div>
            <ul className="space-y-2 text-sm">
              {siteConfig.footerNavigation.product.map((item) => (
                <li key={item.href}>
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-70" />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Careers & Internships links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Careers & Interns
            </div>
            <ul className="space-y-2 text-sm">
              {siteConfig.footerNavigation.careers.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Trust & Legal
            </div>
            <ul className="space-y-2 text-sm">
              {siteConfig.footerNavigation.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {siteConfig.footerNavigation.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-subtle">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved. Primary informational website for SiteSecura.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/responsible-disclosure" className="hover:text-foreground transition-colors">
              Responsible Disclosure
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
