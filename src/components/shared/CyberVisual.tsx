import React from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Globe,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
} from "lucide-react";

export function CyberVisual() {
  const checkItems = [
    {
      category: "SSL / TLS Protocol",
      icon: <Lock className="h-4 w-4 text-emerald-400" />,
      detail: "TLS 1.3 Active • 256-bit Cipher",
      status: "Optimized",
      statusType: "success",
    },
    {
      category: "DNS & Email Posture",
      icon: <Globe className="h-4 w-4 text-cyan-400" />,
      detail: "DMARC & SPF Records Configured",
      status: "Verified",
      statusType: "info",
    },
    {
      category: "Security Headers",
      icon: <FileCheck className="h-4 w-4 text-blue-400" />,
      detail: "HSTS • CSP Policy • Referrer",
      status: "Actionable",
      statusType: "warning",
    },
    {
      category: "Server Configuration",
      icon: <Layers className="h-4 w-4 text-emerald-400" />,
      detail: "Strict HTTPS Redirection Enforced",
      status: "Compliant",
      statusType: "success",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Decorative ambient background glow */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/15 via-secondary/10 to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* Main dashboard mockup container */}
      <div className="relative rounded-2xl border border-border bg-background-card/95 p-5 sm:p-7 shadow-2xl shadow-black/60 backdrop-blur-md">
        {/* Top header bar */}
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 rounded-md bg-background-secondary px-2.5 py-1 text-[11px] font-mono text-foreground-muted border border-border/40">
              <Lock className="h-3 w-3 text-secondary" />
              <span>https://example-domain.com</span>
            </div>
          </div>

          {/* Mandatory illustrative watermark label */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-primary">
            <Activity className="h-3 w-3 animate-pulse text-secondary" />
            <span>Illustrative product preview</span>
          </div>
        </div>

        {/* Central visual overview */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Circular shield representation */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-background-secondary/80 border border-border/60 text-center relative overflow-hidden">
            {/* Concentric rings */}
            <div
              className="absolute -inset-1 rounded-full border border-primary/10 animate-pulse-subtle pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-4 rounded-full border border-secondary/15 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-secondary/20 border border-primary/40 shadow-inner shadow-primary/20">
              <ShieldCheck className="h-10 w-10 text-secondary" />
            </div>

            <div className="mt-3 relative z-10">
              <div className="text-xs font-semibold text-foreground">Posture Overview</div>
              <div className="text-[11px] text-foreground-muted mt-0.5">Configuration Health</div>
            </div>
          </div>

          {/* Quick summary stat meters */}
          <div className="sm:col-span-7 space-y-2.5">
            <div className="rounded-lg bg-background-secondary/60 border border-border/50 p-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground-muted">Inspection Coverage</span>
                <span className="font-semibold text-secondary">4 Key Pillars</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-primary to-secondary" />
              </div>
            </div>

            <div className="rounded-lg bg-background-secondary/60 border border-border/50 p-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground-muted">Findings Clarity</span>
                <span className="font-semibold text-emerald-400">Actionable Guidance</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-4/5 rounded-full bg-emerald-400/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories preview list */}
        <div className="space-y-2.5 pt-2 border-t border-border/60">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted px-1">
            Sample Diagnostic Breakdown
          </div>
          <div className="grid grid-cols-1 gap-2">
            {checkItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-background-secondary/50 px-3.5 py-2.5 text-xs transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-background-card border border-border/40">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{item.category}</div>
                    <div className="text-[11px] text-foreground-muted">{item.detail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.statusType === "success" && (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {item.status}
                    </span>
                  )}
                  {item.statusType === "info" && (
                    <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400 border border-cyan-500/20">
                      <Activity className="h-2.5 w-2.5" />
                      {item.status}
                    </span>
                  )}
                  {item.statusType === "warning" && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
                      <AlertCircle className="h-2.5 w-2.5" />
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating status badge indicator on desktop */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-foreground-subtle">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Platform concept preview</span>
          </div>
          <span>Built for clarity</span>
        </div>
      </div>
    </div>
  );
}
