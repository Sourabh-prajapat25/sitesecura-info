import React from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-primary/10 text-primary border-primary/25",
    primary: "bg-primary/15 text-blue-300 border-primary/30",
    secondary: "bg-secondary/10 text-secondary border-secondary/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    neutral: "bg-slate-800/80 text-foreground-muted border-slate-700/60",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 tracking-wider uppercase font-semibold",
    md: "text-xs px-3 py-1 font-medium",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  let variant: BadgeVariant = "neutral";
  if (status === "Open") variant = "success";
  else if (status === "Expression of Interest") variant = "secondary";
  else if (status === "Coming Soon") variant = "warning";
  else if (status === "Closed") variant = "neutral";

  return (
    <Badge variant={variant} size="sm">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Open"
            ? "bg-emerald-400 animate-pulse"
            : status === "Expression of Interest"
            ? "bg-cyan-400"
            : status === "Coming Soon"
            ? "bg-amber-400"
            : "bg-slate-400"
        }`}
      />
      {status}
    </Badge>
  );
}
