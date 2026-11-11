"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ExternalLink } from "lucide-react";
import { INTERNSHIP_FAQS, FaqItem } from "./data";

export function InternshipFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Transparent Answers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14243A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Everything you need to know about program expectations, credentials, deliverables, and fees.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-14 space-y-4">
          {INTERNSHIP_FAQS.map((faq: FaqItem, idx: number) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#F6F8FC] border-blue-300 shadow-sm"
                    : "bg-white border-[#E5EAF1] hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <span className="text-base sm:text-lg font-bold text-[#14243A]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-blue-100 text-[#2563EB] rotate-180" : "bg-gray-100 text-[#64748B]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#475569] leading-relaxed border-t border-[#E5EAF1]/60">
                    <p>{faq.answer}</p>
                    {idx === 9 && (
                      <div className="mt-3">
                        <Link
                          href="/verify-internship"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline"
                        >
                          Visit the Certificate Verification Portal
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Questions note */}
        <div className="mt-12 text-center text-sm text-[#64748B]">
          Have an unanswered question? Contact our team at{" "}
          <a
            href="mailto:careers@sitesecura.info"
            className="font-semibold text-[#2563EB] hover:underline"
          >
            careers@sitesecura.info
          </a>
        </div>
      </div>
    </section>
  );
}
