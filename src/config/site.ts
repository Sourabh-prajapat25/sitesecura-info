export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  siteUrl: string;
  platformUrl: string;
  contact: {
    email: string;
    careersEmail: string;
    securityEmail: string;
    locationNote: string;
  };
  forms: {
    generalApplicationUrl: string;
    internshipApplicationUrl: string;
    careersApplicationUrl: string;
    razorpayInternshipUrl: string;
  };
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  navigation: NavItem[];
  footerNavigation: {
    product: NavItem[];
    company: NavItem[];
    careers: NavItem[];
    legal: NavItem[];
  };
}

export const siteConfig: SiteConfig = {
  name: "SiteSecura",
  tagline: "Website Security Should Be Simple.",
  description:
    "SiteSecura is building accessible website security tools that help businesses understand their digital security posture, identify configuration issues, and take practical steps toward a safer web presence.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sitesecura.info",
  platformUrl: process.env.NEXT_PUBLIC_PLATFORM_URL || "https://sitesecura.com",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@sitesecura.com",
    careersEmail: process.env.NEXT_PUBLIC_CAREERS_EMAIL || "careers@sitesecura.com",
    securityEmail: process.env.NEXT_PUBLIC_SECURITY_EMAIL || "security@sitesecura.com",
    locationNote: "Operating remotely with team members collaborating across digital workspaces.",
  },
  forms: {
    generalApplicationUrl: process.env.NEXT_PUBLIC_APPLICATION_FORM_URL || "",
    internshipApplicationUrl:
      process.env.NEXT_PUBLIC_INTERNSHIP_FORM_URL ||
      process.env.NEXT_PUBLIC_APPLICATION_FORM_URL ||
      "",
    careersApplicationUrl:
      process.env.NEXT_PUBLIC_CAREERS_FORM_URL ||
      process.env.NEXT_PUBLIC_APPLICATION_FORM_URL ||
      "",
    razorpayInternshipUrl: "https://rzp.io/rzp/6YVhqsy",
  },
  socials: {
    // Only valid URLs when configured; kept undefined/empty otherwise
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Product", href: "/product" },
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Internships", href: "/internships" },
    { label: "Contact", href: "/contact" },
  ],
  footerNavigation: {
    product: [
      { label: "Platform Overview", href: "/product" },
      { label: "Website Security Checks", href: "/product#checks" },
      { label: "SSL/TLS Insights", href: "/product#ssl" },
      { label: "DNS & Headers", href: "/product#dns" },
      { label: "Launch Main App", href: "https://sitesecura.com", isExternal: true },
    ],
    company: [
      { label: "About SiteSecura", href: "/about" },
      { label: "Our Mission & Vision", href: "/about#mission" },
      { label: "Our Principles", href: "/about#principles" },
      { label: "Contact Us", href: "/contact" },
    ],
    careers: [
      { label: "Careers Overview", href: "/careers" },
      { label: "Open Opportunities", href: "/careers#opportunities" },
      { label: "Internship Tracks", href: "/internships" },
      { label: "Internship Program", href: "/internship-program" },
      { label: "Intern Status & Certificate", href: "/intern-portal" },
      { label: "Verify Certificate", href: "/verify-internship" },
      { label: "Expression of Interest", href: "/apply" },
      { label: "HR Portal (Internal)", href: "/hr-portal" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Responsible Disclosure", href: "/responsible-disclosure" },
    ],
  },
};
