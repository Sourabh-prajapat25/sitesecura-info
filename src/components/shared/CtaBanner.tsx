import React from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/shared/Button";
import { ArrowUpRight, Mail } from "lucide-react";

interface CtaBannerProps {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  isSecondaryExternal?: boolean;
  className?: string;
}

export function CtaBanner({
  title = "Let's make website security simpler.",
  description = "Explore the SiteSecura platform and discover our clear, practical approach to website security posture and actionable diagnostics.",
  primaryCtaText = "Visit SiteSecura Platform",
  primaryCtaHref = siteConfig.platformUrl,
  secondaryCtaText = "Contact Us",
  secondaryCtaHref = "/contact",
  isSecondaryExternal = false,
  className = "",
}: CtaBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-background-secondary via-background-card to-background-secondary p-8 sm:p-12 lg:p-16 text-center shadow-2xl shadow-black/40 ${className}`}
    >
      {/* Decorative ambient radial glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-secondary/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            href={primaryCtaHref}
            variant="primary"
            size="lg"
            isExternal
            icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
          >
            {primaryCtaText}
          </Button>

          <Button
            href={secondaryCtaHref}
            variant="outline"
            size="lg"
            isExternal={isSecondaryExternal}
            icon={
              secondaryCtaHref.startsWith("http") ? (
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Mail className="h-4 w-4" aria-hidden="true" />
              )
            }
          >
            {secondaryCtaText}
          </Button>
        </div>
      </div>
    </div>
  );
}
