"use client";

import React, { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { Button, ButtonProps } from "@/components/shared/Button";
import { ArrowUpRight, Mail } from "lucide-react";

interface ApplicationButtonProps {
  formUrl?: string;
  trackId?: string;
  trackTitle?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  children?: React.ReactNode;
  fallbackHref?: string;
}

export function ApplicationButton({
  formUrl,
  trackId,
  trackTitle,
  variant = "primary",
  size = "md",
  className = "",
  children,
  fallbackHref = "/apply",
}: ApplicationButtonProps) {
  // Resolve effective target URL
  const resolvedUrl =
    formUrl ||
    siteConfig.forms.generalApplicationUrl ||
    process.env.NEXT_PUBLIC_APPLICATION_FORM_URL;

  const isConfigured = Boolean(resolvedUrl && resolvedUrl.trim().length > 0);

  useEffect(() => {
    if (!isConfigured && process.env.NODE_ENV === "development") {
      console.warn(
        `[SiteSecura Info] Application URL not configured for ${
          trackTitle || "general application"
        }. Falling back to internal guidance page (${fallbackHref}). Add NEXT_PUBLIC_APPLICATION_FORM_URL in your environment to connect an external Google Form.`
      );
    }
  }, [isConfigured, trackTitle, fallbackHref]);

  if (isConfigured) {
    return (
      <Button
        href={resolvedUrl!}
        variant={variant}
        size={size}
        className={className}
        isExternal
        icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
      >
        {children || "Apply Now"}
      </Button>
    );
  }

  // Graceful fallback to /apply route with track parameter or contact fallback
  const internalTarget = trackId
    ? `${fallbackHref}?track=${encodeURIComponent(trackId)}`
    : fallbackHref;

  return (
    <Button
      href={internalTarget}
      variant={variant}
      size={size}
      className={className}
      icon={<Mail className="h-4 w-4" aria-hidden="true" />}
    >
      {children || "Express Interest"}
    </Button>
  );
}
