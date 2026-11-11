import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { RAZORPAY_INTERNSHIP_URL } from "./data";

export function MobileStickyCta() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EAF1] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Onboarding Fee</span>
          </div>
          <div className="text-lg font-black text-[#14243A]">
            ₹99 <span className="text-xs font-normal text-[#64748B]">/ one-time</span>
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
