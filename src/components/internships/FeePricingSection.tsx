import React from "react";
import Link from "next/link";
import { Check, X, ShieldCheck, ArrowRight, Lock, HelpCircle } from "lucide-react";
import { RAZORPAY_INTERNSHIP_URL } from "./data";

export function FeePricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Transparent Pricing & Administration
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14243A] tracking-tight">
            Clear, Honest Program Costs
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            SiteSecura charges a single, nominal onboarding and administrative fee of ₹99. We believe in total financial transparency with no surprise upsells or misleading employment promises.
          </p>
        </div>

        {/* Pricing & Explanation Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* What the fee supports */}
            <div className="bg-[#F6F8FC] rounded-2xl border border-[#E5EAF1] p-6 sm:p-8">
              <h3 className="text-lg font-bold text-[#14243A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                What the ₹99 Administrative Fee Covers
              </h3>
              <p className="mt-2 text-sm text-[#64748B]">
                This fee helps offset essential administrative and tooling costs required to maintain a structured cohort:
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#334155]">
                    <strong>Application Review & Intake:</strong> Identity verification, background screening, and secure record registration.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#334155]">
                    <strong>Onboarding Infrastructure:</strong> Setup on task management channels, project brief repositories, and communication hubs.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#334155]">
                    <strong>Review & Coordination:</strong> Milestone submission tracking and coordinator evaluation bandwidth.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#334155]">
                    <strong>Digital Credential Hosting:</strong> Maintenance of tamper-evident cryptographic verification records on sitesecura.info.
                  </span>
                </li>
              </ul>
            </div>

            {/* What the fee does NOT purchase */}
            <div className="bg-red-50/40 rounded-2xl border border-red-200/60 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-red-950 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                What This Fee Does NOT Buy
              </h3>
              <p className="mt-2 text-sm text-red-900/80">
                To prevent misunderstandings, we explicitly state that payment does not substitute for performance:
              </p>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-red-950">
                    <strong>Does NOT purchase a job or employment offer:</strong> Hiring decisions are separate and strictly merit-based.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-red-950">
                    <strong>Does NOT purchase an automatic certificate or LOR:</strong> Credentials require active task completion.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-red-950">
                    <strong>Does NOT guarantee a stipend:</strong> Advanced paid tracks are selective and based on task evaluations.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Pricing Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-3xl border-2 border-blue-600 p-8 shadow-xl relative overflow-hidden">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
                Structured Program Enrollment
              </div>

              <h3 className="text-2xl font-extrabold text-[#14243A]">
                SiteSecura Internship Program
              </h3>
              <p className="text-sm text-[#64748B] mt-1">
                Practical experience across 13 engineering and business domains.
              </p>

              {/* Price display */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#14243A]">₹99</span>
                <span className="text-sm font-semibold text-[#64748B]">one-time onboarding fee</span>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                No monthly charges • No hidden subscription costs
              </p>

              {/* What is included checklist */}
              <div className="mt-6 pt-6 border-t border-[#E5EAF1] space-y-3">
                <div className="text-xs font-bold text-[#14243A] uppercase tracking-wider">
                  Program Inclusions
                </div>
                {[
                  "Access to selected domain track & structured tasks",
                  "Supervisor feedback on milestone submissions",
                  "Official verifiable completion certificate upon fulfillment",
                  "Performance-based LOR eligibility for top contributors",
                  "Priority review for paid internship openings",
                  "Professional portfolio & resume development guidance",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-[#334155] font-medium leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <a
                  href={RAZORPAY_INTERNSHIP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Join Internship Program — ₹99
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Security info */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#64748B]">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Processed securely via Razorpay</span>
              </div>

              {/* Legal links */}
              <div className="mt-4 pt-4 border-t border-[#F1F5F9] text-center text-[11px] text-[#64748B]">
                <span>By applying, you agree to our </span>
                <Link href="/terms" className="text-[#2563EB] hover:underline">
                  Terms of Service
                </Link>
                <span> and </span>
                <Link href="/privacy" className="text-[#2563EB] hover:underline">
                  Privacy Policy
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
