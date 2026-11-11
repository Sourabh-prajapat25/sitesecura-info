import React from "react";
import { Terminal, MessageCircle, Clock, Compass, CheckCircle2, GraduationCap } from "lucide-react";
import { WHAT_YOU_WILL_LEARN, LearningPillar } from "./data";

const iconMap: Record<string, React.ElementType> = {
  Terminal,
  MessageCircle,
  Clock,
  Compass,
};

export function WhatYouWillLearn() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Curriculum & Skill Mastery
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14243A] tracking-tight">
            Comprehensive Professional Growth
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Our internship focuses not only on technical execution but on shaping well-rounded, dependable engineers, designers, and business operators prepared for high-standard modern teams.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {WHAT_YOU_WILL_LEARN.map((pillar: LearningPillar, idx: number) => {
            const Icon = iconMap[pillar.iconName] || Terminal;

            return (
              <div
                key={idx}
                className="bg-[#F6F8FC] rounded-2xl border border-[#E5EAF1] p-8 shadow-sm hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100/80 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#14243A]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                  <ul className="space-y-3">
                    {pillar.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-[#334155]">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#14243A]">
              Practical Application Over Theoretical Lectures
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              Work on realistic milestone tasks, receive objective code and document reviews, and graduate with genuine portfolio assets.
            </p>
          </div>
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            Outcome-Oriented
          </span>
        </div>
      </div>
    </section>
  );
}
