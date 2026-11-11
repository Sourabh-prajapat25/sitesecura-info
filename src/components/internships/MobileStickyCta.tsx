import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { RAZORPAY_INTERNSHIP_URL } from "./data";

export function MobileStickyCta() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EAF1] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#14243A] leading-tight">SiteSecura Internships</span>
            <span className="text-[10px] text-[#64748B] leading-tight">Practical & Verifiable</span>
          </div>
        </div>

        <a
          href={RAZORPAY_INTERNSHIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2563EB] active:bg-blue-700 text-white text-xs font-bold shadow-md"
        >
          <span>Join Program</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
