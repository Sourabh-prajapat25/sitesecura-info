import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { InternshipHero } from "@/components/internships/InternshipHero";
import { WhyJoinSection } from "@/components/internships/WhyJoinSection";
import { DeliverablesSection } from "@/components/internships/DeliverablesSection";
import { HowItWorksTimeline } from "@/components/internships/HowItWorksTimeline";
import { DomainsSection } from "@/components/internships/DomainsSection";
import { WhatYouWillLearn } from "@/components/internships/WhatYouWillLearn";
import { CareerPathwaysSection } from "@/components/internships/CareerPathwaysSection";
import { FeePricingSection } from "@/components/internships/FeePricingSection";
import { WhoShouldApplySection } from "@/components/internships/WhoShouldApplySection";
import { InternshipFaqSection } from "@/components/internships/InternshipFaqSection";
import { FinalCtaSection } from "@/components/internships/FinalCtaSection";
import { MobileStickyCta } from "@/components/internships/MobileStickyCta";

export const metadata: Metadata = constructMetadata({
  title: "SiteSecura Internship Program | Practical Experience & Career Growth",
  description:
    "Join the SiteSecura Internship Program. Gain structured project experience in cybersecurity, full-stack, AI, UI/UX, and business operations. Transparent ₹99 onboarding fee.",
  path: "/internships",
});

export default function InternshipsPage() {
  return (
    <div className="min-h-screen bg-white text-[#14243A] selection:bg-blue-100 selection:text-blue-900 pb-16 md:pb-0">
      {/* 1. Hero Section */}
      <InternshipHero />

      {/* 2. Why Join Section */}
      <WhyJoinSection />

      {/* 3. Program Deliverables (8 Items) */}
      <DeliverablesSection />

      {/* 4. 5-Step Process Timeline */}
      <HowItWorksTimeline />

      {/* 5. 13 Domain Tracks with Interactive Filter Tabs */}
      <DomainsSection />

      {/* 6. What You Will Learn (4 Pillars) */}
      <WhatYouWillLearn />

      {/* 7. Career Pathways & Future Opportunities */}
      <CareerPathwaysSection />

      {/* 8. Fee & Pricing Transparency (₹99 Breakdown) */}
      <FeePricingSection />

      {/* 9. Who Should Apply & Expectations */}
      <WhoShouldApplySection />

      {/* 10. Frequently Asked Questions (10 items accordion) */}
      <InternshipFaqSection />

      {/* 11. Final High-Impact CTA */}
      <FinalCtaSection />

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCta />
    </div>
  );
}
