import React from "react";
import { Badge } from "@/components/shared/Badge";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlightText?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleAs?: "h1" | "h2" | "h3";
}

export function SectionHeader({
  eyebrow,
  title,
  highlightText,
  description,
  align = "center",
  className = "",
  titleAs: TitleTag = "h2",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  // If highlightText is specified, split title around it
  let titleContent: React.ReactNode = title;
  if (highlightText && title.includes(highlightText)) {
    const parts = title.split(highlightText);
    titleContent = (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
          {highlightText}
        </span>
        {parts.slice(1).join(highlightText)}
      </>
    );
  }

  return (
    <div
      className={`max-w-3xl ${
        isCenter ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {eyebrow && (
        <div className={`mb-3.5 ${isCenter ? "flex justify-center" : "flex justify-start"}`}>
          <Badge variant="primary" size="sm">
            {eyebrow}
          </Badge>
        </div>
      )}

      <TitleTag className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.2]">
        {titleContent}
      </TitleTag>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
