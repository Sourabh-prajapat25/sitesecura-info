"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Layout,
  Server,
  Shield,
  Cpu,
  Code,
  Palette,
  Megaphone,
  Share2,
  PenTool,
  Search,
  Briefcase,
  UserCheck,
  ArrowRight,
  Filter,
} from "lucide-react";
import { INTERNSHIP_DOMAINS, RAZORPAY_INTERNSHIP_URL, DomainRole } from "./data";

const iconMap: Record<string, React.ElementType> = {
  Layers,
  Layout,
  Server,
  Shield,
  Cpu,
  Code,
  Palette,
  Megaphone,
  Share2,
  PenTool,
  Search,
  Briefcase,
  UserCheck,
};

type FilterCategory = "all" | "technology" | "business";

export function DomainsSection() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");

  const filteredDomains = INTERNSHIP_DOMAINS.filter((role) => {
    if (activeCategory === "all") return true;
    return role.category === activeCategory;
  });

  const techCount = INTERNSHIP_DOMAINS.filter((r) => r.category === "technology").length;
  const bizCount = INTERNSHIP_DOMAINS.filter((r) => r.category === "business").length;

  return (
    <section id="domains" className="py-20 md:py-28 bg-[#F6F8FC] border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            13 Specialized Domain Tracks
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14243A] tracking-tight">
            Find Your Track in Technology & Business
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            SiteSecura offers structured internship roles across software engineering, cyber posture, UI/UX, product research, and business operations. Select your preferred domain during the registration step.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex p-1.5 rounded-xl bg-white border border-[#E5EAF1] shadow-sm">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeCategory === "all"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#14243A] hover:bg-[#F6F8FC]"
              }`}
            >
              All Domains ({INTERNSHIP_DOMAINS.length})
            </button>
            <button
              onClick={() => setActiveCategory("technology")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeCategory === "technology"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#14243A] hover:bg-[#F6F8FC]"
              }`}
            >
              Technology ({techCount})
            </button>
            <button
              onClick={() => setActiveCategory("business")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeCategory === "business"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#14243A] hover:bg-[#F6F8FC]"
              }`}
            >
              Business & Growth ({bizCount})
            </button>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((role: DomainRole) => {
            const Icon = iconMap[role.iconName] || Code;
            const isTech = role.category === "technology";

            return (
              <div
                key={role.id}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#E5EAF1] p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <div>
                  {/* Category and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isTech
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {isTech ? "Technology Track" : "Business Track"}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isTech ? "bg-blue-50 text-[#2563EB]" : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#14243A] group-hover:text-[#2563EB] transition-colors">
                    {role.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                    {role.description}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                    <div className="text-xs font-semibold text-[#14243A] mb-2 uppercase tracking-wider">
                      Key Competencies & Tools
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155] text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer / CTA */}
                <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-xs text-[#64748B] font-medium">
                    Program fee: ₹99
                  </span>
                  <a
                    href={RAZORPAY_INTERNSHIP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-blue-800 transition-colors"
                  >
                    Apply for Role
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Role selection */}
        <div className="mt-10 max-w-2xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-[#64748B]">
            * Candidates can indicate their primary and secondary domain preference during the official onboarding registration. Roles are assigned based on applicant skills, domain interest, and project capacity.
          </p>
        </div>
      </div>
    </section>
  );
}
