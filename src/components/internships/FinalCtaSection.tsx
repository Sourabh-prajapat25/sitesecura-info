import React from "react";
import Link from "next/link";
import { ArrowRight, Mail, Shield, CheckCircle } from "lucide-react";
import { RAZORPAY_INTERNSHIP_URL } from "./data";

export function FinalCtaSection() {
  return (
    <section className="py-20 md:py-28 bg-[#F6F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-[#14243A] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl">
          {/* Decorative Background Elements */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-6">
              <Shield className="w-3.5 h-3.5 text-cyan-300" />
              Enrollment Open for Upcoming Cohort
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Take Your First Step Into Practical Cybersecurity & SaaS Engineering
            </h2>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-blue-100 leading-relaxed">
              Gain structured hands-on experience, build verifiable credentials, and accelerate your career path with SiteSecura. Real tasks, objective feedback, and transparent progression.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={RAZORPAY_INTERNSHIP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#14243A] hover:bg-blue-50 font-extrabold text-base shadow-lg hover:shadow-xl transition-all"
              >
                <span>Join Internship Program</span>
                <ArrowRight className="w-5 h-5 text-[#2563EB]" />
              </a>
              <a
                href="mailto:careers@sitesecura.info"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-all"
              >
                <Mail className="w-4 h-4 text-cyan-300" />
                Contact Careers Team
              </a>
            </div>

            {/* Reassurance Features */}
            <div className="mt-10 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-blue-100/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-300" />
                <span>₹99 transparent administrative fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-300" />
                <span>Verifiable digital credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-300" />
                <span>Performance-based recognition</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
