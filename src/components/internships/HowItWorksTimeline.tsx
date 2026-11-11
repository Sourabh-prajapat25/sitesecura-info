"use client";

import React from "react";
import { TIMELINE_STEPS } from "./data";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function HowItWorksTimeline() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            HOW THE PROGRAM WORKS
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14243A] tracking-tight">
            A Simple Journey from Learning to Experience
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            Follow a structured roadmap designed to guide you through registration, task completion,
            constructive feedback, and official credential issuance.
          </p>
        </div>

        {/* Desktop Horizontal Timeline (Visible on lg+) */}
        <div className="hidden lg:grid grid-cols-5 gap-4 mt-16 relative">
          {/* Connector Line behind steps */}
          <div
            className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 -z-0"
            aria-hidden="true"
          />

          {TIMELINE_STEPS.map((step) => (
            <div key={step.step} className="relative z-10 flex flex-col items-center text-center space-y-4">
              {/* Step Circle Badge */}
              <div className="h-14 w-14 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/10">
                0{step.step}
              </div>

              {/* Step Card Content */}
              <div className="p-4 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] w-full min-h-[160px] flex flex-col justify-start space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {step.tag}
                </span>
                <h3 className="text-sm font-bold text-[#14243A] leading-snug">{step.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile & Tablet Vertical Timeline (Visible below lg) */}
        <div className="lg:hidden mt-12 space-y-4 max-w-lg mx-auto">
          {TIMELINE_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative pl-12 pb-4 border-l-2 border-blue-200 last:border-l-transparent last:pb-0"
            >
              {/* Timeline Marker Circle */}
              <div className="absolute -left-[17px] top-0 h-8 w-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
                0{step.step}
              </div>

              {/* Timeline Content Card */}
              <div className="p-4 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {step.tag}
                </span>
                <h3 className="text-sm font-bold text-[#14243A]">{step.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Note */}
        <div className="mt-12 text-center text-xs text-[#64748B] max-w-xl mx-auto">
          Progression and documentation depend on selection, participation, performance, and completion
          requirements.
        </div>
      </div>
    </section>
  );
}
