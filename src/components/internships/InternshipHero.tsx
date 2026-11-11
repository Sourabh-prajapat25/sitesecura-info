"use client";

import React from "react";
import { OFFICIAL_RAZORPAY_URL } from "./data";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  Terminal,
  FileCheck2,
  Lock,
  Code2,
} from "lucide-react";

export function InternshipHero() {
  const benefits = [
    "Practical, project-based learning.",
    "Professional internship documentation.",
    "Performance-based career opportunities.",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F6F8FC] border-b border-[#E5EAF1] pt-10 sm:pt-16 pb-16 sm:pb-24">
      {/* Subtle ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/80 via-cyan-50/30 to-transparent pointer-events-none blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              <span>SITESECURA CAREER DEVELOPMENT PROGRAM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#14243A] tracking-tight leading-[1.15]">
              Build Real Skills. Gain Industry Experience.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Start Your Career with Confidence.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl">
              Turn your knowledge into practical experience. Learn from real technology workflows,
              contribute to meaningful projects, build your professional profile, and take your first step
              towards a career in technology with SiteSecura.
            </p>

            {/* 3 Concise Benefit Indicators */}
            <div className="pt-2 space-y-2.5">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-[#14243A]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href={OFFICIAL_RAZORPAY_URL}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-base font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                aria-label="Join Internship Program on Razorpay"
              >
                <span>Join Internship Program</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#benefits"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#14243A] border border-[#E5EAF1] hover:border-slate-300 text-sm font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Explore Program Benefits
              </a>
            </div>

            {/* Transparent Disclaimer Note */}
            <p className="text-xs text-[#64748B] max-w-xl leading-normal pt-1">
              One-time ₹99 onboarding and administrative fee. Selection, internship participation,
              stipend, and career opportunities are subject to the program&apos;s published eligibility
              and terms.
            </p>
          </div>

          {/* Right Column: Premium Interactive Workspace Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
              {/* Card Header: Program Cohort Status */}
              <div className="flex items-center justify-between border-b border-[#E5EAF1] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <Code2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#14243A]">SiteSecura Developer Cohort</div>
                    <div className="text-[11px] text-[#64748B]">Practical Project Workflow</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Applications Open
                </span>
              </div>

              {/* Workflow Milestones Preview */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E5EAF1] flex items-start gap-3">
                  <div className="h-6 w-6 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#14243A]">Onboarding & Track Selection</div>
                    <div className="text-[11px] text-[#64748B]">
                      Secure registration, domain alignment, and initial workspace briefing.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E5EAF1] flex items-start gap-3">
                  <div className="h-6 w-6 rounded-md bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#14243A]">Practical Deliverables & Review</div>
                    <div className="text-[11px] text-[#64748B]">
                      Hands-on tasks in full-stack, frontend, cybersecurity, or business growth.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E5EAF1] flex items-start gap-3">
                  <div className="h-6 w-6 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#14243A]">Verified Documentation & Credentials</div>
                    <div className="text-[11px] text-[#64748B]">
                      Official completion certificate, verifiable QR credential, and evaluation.
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Highlights Footer */}
              <div className="pt-3 border-t border-[#E5EAF1] grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-bold text-[#14243A]">13+</div>
                  <div className="text-[10px] text-[#64748B]">Specialized Domains</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-bold text-[#14243A]">100%</div>
                  <div className="text-[10px] text-[#64748B]">Remote & Flexible</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-bold text-[#14243A]">Verifiable</div>
                  <div className="text-[10px] text-[#64748B]">QR Credentials</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
