"use client";

import React from "react";
import { WHY_JOIN_BENEFITS } from "./data";
import {
  Laptop,
  GitBranch,
  FileCheck,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";

export function WhyJoinSection() {
  const iconMap: Record<string, React.ReactNode> = {
    Laptop: <Laptop className="h-5 w-5 text-blue-600" />,
    GitBranch: <GitBranch className="h-5 w-5 text-cyan-600" />,
    FileCheck: <FileCheck className="h-5 w-5 text-emerald-600" />,
    Sparkles: <Sparkles className="h-5 w-5 text-blue-600" />,
    Users: <Users className="h-5 w-5 text-indigo-600" />,
    TrendingUp: <TrendingUp className="h-5 w-5 text-teal-600" />,
  };

  return (
    <section id="benefits" className="py-16 sm:py-24 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            WHY JOIN SITESECURA?
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14243A] tracking-tight">
            Your First Step Towards a Stronger Professional Career
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            Classroom learning builds your foundation. Practical experience helps you understand
            how that knowledge is used in real working environments.
          </p>
        </div>

        {/* 6 Benefit Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_JOIN_BENEFITS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:bg-white p-7 transition-all duration-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-11 w-11 rounded-xl bg-white border border-[#E5EAF1] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                  {iconMap[item.iconName] || <Sparkles className="h-5 w-5 text-blue-600" />}
                </div>

                <h3 className="text-lg font-bold text-[#14243A] group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.id === "live-exposure" && (
                <div className="mt-4 pt-3 border-t border-[#E5EAF1]/70 text-[11px] text-[#64748B] italic">
                  Note: Supervised project assignments maintain controlled access to production systems.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
