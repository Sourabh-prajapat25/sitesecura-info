"use client";

import React from "react";
import { WHAT_YOU_RECEIVE } from "./data";
import {
  FileText,
  Award,
  CheckCircle2,
  Code2,
  MessageSquare,
  Briefcase,
  UserCheck,
  Rocket,
  ShieldCheck,
} from "lucide-react";

export function DeliverablesSection() {
  const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText className="h-5 w-5 text-blue-600" />,
    Award: <Award className="h-5 w-5 text-amber-600" />,
    CheckCircle2: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    Code2: <Code2 className="h-5 w-5 text-cyan-600" />,
    MessageSquare: <MessageSquare className="h-5 w-5 text-indigo-600" />,
    Briefcase: <Briefcase className="h-5 w-5 text-blue-600" />,
    UserCheck: <UserCheck className="h-5 w-5 text-teal-600" />,
    Rocket: <Rocket className="h-5 w-5 text-purple-600" />,
  };

  return (
    <section id="deliverables" className="py-16 sm:py-24 bg-[#F6F8FC] border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold uppercase tracking-wider">
            WHAT WILL YOU RECEIVE?
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14243A] tracking-tight">
            More Than Just an Internship Certificate
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            Your internship journey is designed to help you build experience, demonstrate your
            capabilities, and develop a stronger professional profile.
          </p>
        </div>

        {/* 8 Deliverables Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHAT_YOU_RECEIVE.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {iconMap[item.iconName] || <Award className="h-5 w-5 text-blue-600" />}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#64748B]">{item.number}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#14243A]">{item.title}</h3>
                  {item.badge && (
                    <span className="inline-block mt-1 text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility Transparency Callout */}
        <div className="mt-10 p-5 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 max-w-4xl mx-auto">
          <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm text-[#14243A] leading-relaxed">
            <strong>Eligibility Note:</strong> Documents and credentials are issued according to actual candidate
            selection, active task participation, and successful completion of program criteria. Registration
            or fee payment alone does not guarantee any credential or employment.
          </div>
        </div>
      </div>
    </section>
  );
}
