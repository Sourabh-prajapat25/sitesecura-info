import React from "react";
import { Award, DollarSign, Briefcase, AlertCircle, TrendingUp } from "lucide-react";

export function CareerPathwaysSection() {
  return (
    <section className="py-20 md:py-28 bg-[#F6F8FC] border-b border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Progression & Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14243A] tracking-tight">
            Career Pathways & Future Opportunities
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            While the primary program focus is skill development and practical experience, consistent excellence opens doors to extended responsibilities and professional pathways.
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E5EAF1] p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
                Merit-Based
              </span>
              <h3 className="text-xl font-bold text-[#14243A]">
                High-Performance Recognition
              </h3>
              <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                Participants who exhibit technical rigor, prompt milestone delivery, and active collaboration are eligible for individualized Letters of Recommendation (LOR) from leadership.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-xs font-medium text-[#64748B]">
              Evaluated at milestone reviews
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-sm hover:shadow-md hover:border-blue-400 transition-all relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-sm">
              Selective Track
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
                Opportunity Pool
              </span>
              <h3 className="text-xl font-bold text-[#14243A]">
                Paid Internship Opportunities
              </h3>
              <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                Exceptional contributors demonstrating readiness for production-level tasks may be considered for paid engagements and funded internal project assignments as demand arises.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-xs font-medium text-[#64748B]">
              Subject to technical evaluation & openings
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E5EAF1] p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
                Long-Term Outlook
              </span>
              <h3 className="text-xl font-bold text-[#14243A]">
                Future Employment & PPO Consideration
              </h3>
              <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                As SiteSecura grows, outstanding interns who understand our cybersecurity stack and company ethos will be prioritized for full-time or junior associate openings.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-xs font-medium text-[#64748B]">
              Contingent on organizational vacancies
            </div>
          </div>
        </div>

        {/* Clear Policy Disclaimer */}
        <div className="mt-12 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-950">
                Ethical Hiring & Advancement Transparency
              </h4>
              <p className="mt-2 text-sm text-amber-900 leading-relaxed">
                SiteSecura maintains strict hiring integrity. Paid opportunities, stipends, and future employment considerations are entirely performance-based and contingent upon organizational needs and open vacancies. Participation in the internship program or payment of the administrative fee does <strong>not</strong> guarantee employment, a stipend, or an automatic job offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
