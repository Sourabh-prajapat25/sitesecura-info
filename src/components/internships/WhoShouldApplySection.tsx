import React from "react";
import { UserCheck, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { WHO_SHOULD_APPLY } from "./data";

export function WhoShouldApplySection() {
  return (
    <section className="py-20 md:py-28 bg-[#F6F8FC] border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Fit & Readiness
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14243A] tracking-tight">
            Who This Program Is Designed For
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            We welcome motivated students and aspiring professionals who want to bridge academic study with practical execution. Here is how to know if this program matches your goals.
          </p>
        </div>

        {/* 2-Column Comparison */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Suitable For */}
          <div className="bg-white rounded-2xl border border-[#E5EAF1] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#14243A]">
                  Suitable For
                </h3>
                <p className="text-xs text-[#64748B]">
                  Ideal candidates who will get the highest value
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {WHO_SHOULD_APPLY.suitableFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[#334155] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: What We Expect */}
          <div className="bg-white rounded-2xl border border-[#E5EAF1] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#14243A]">
                  What We Expect From You
                </h3>
                <p className="text-xs text-[#64748B]">
                  Commitment, integrity, and proactive execution
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {WHO_SHOULD_APPLY.whatWeExpect.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-[#334155] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reassurance Callout */}
        <div className="mt-10 max-w-3xl mx-auto text-center p-6 rounded-2xl bg-white border border-[#E5EAF1]">
          <p className="text-sm text-[#475569] leading-relaxed">
            <strong>No prior enterprise corporate experience is required.</strong> What matters most is intellectual curiosity, consistent task submission, and a constructive attitude toward learning.
          </p>
        </div>
      </div>
    </section>
  );
}
