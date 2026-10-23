export type OpportunityStatus = "Open" | "Coming Soon" | "Expression of Interest" | "Closed";

export interface Opportunity {
  id: string;
  title: string;
  category: "Engineering" | "Security" | "Design" | "Content & Product";
  employmentType: "Full-Time" | "Part-Time" | "Internship" | "Project-Based" | "Flexible";
  location: string;
  experienceLevel: "Early Career" | "Mid-Level" | "Senior" | "Open to All";
  description: string;
  responsibilities: string[];
  skills: string[];
  status: OpportunityStatus;
  applyUrl?: string; // Optional specific form URL override
}

export interface CareerArea {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  focusAreas: string[];
  recommendedSkills: string[];
}

export interface InternshipTrack {
  id: string;
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  learningAreas: string[];
  foundationalSkills: string[];
  suggestedProjects: string[];
  status: OpportunityStatus;
  applyUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const careerAreas: CareerArea[] = [
  {
    id: "frontend-dev",
    title: "Frontend Development",
    eyebrow: "User Interface & Experience",
    description:
      "Design and build performant, accessible, and intuitive interfaces that make complex security findings easy for everyday website owners to navigate.",
    focusAreas: [
      "Modern Next.js & React architectures",
      "TypeScript for resilient client logic",
      "Accessible (WCAG compliant) component systems",
      "Data visualization for security metrics",
      "Responsive design across device viewports",
    ],
    recommendedSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Semantic HTML", "ARIA"],
  },
  {
    id: "backend-dev",
    title: "Backend Development",
    eyebrow: "Systems & Security Engines",
    description:
      "Architect clean, modular backend services and security inspection pipelines focused on reliability, performance, and clear data contracts.",
    focusAreas: [
      "RESTful API design and documentation",
      "Python and FastAPI microservices",
      "PostgreSQL data modeling and schema design",
      "Asynchronous inspection job handling",
      "Secure API authentication and rate-limiting",
    ],
    recommendedSkills: ["Python", "FastAPI", "PostgreSQL", "REST APIs", "Git", "Docker basics"],
  },
  {
    id: "cybersecurity-research",
    title: "Cybersecurity & Research",
    eyebrow: "Security Analysis & Standards",
    description:
      "Explore real-world website configurations, analyze common misconfigurations, and help formulate evidence-based, actionable guidance.",
    focusAreas: [
      "HTTPS, SSL/TLS protocol inspection & cipher suites",
      "DNS records, SPF, DKIM, DMARC security posture",
      "HTTP response headers (CSP, HSTS, X-Frame-Options)",
      "Vulnerability categorization and risk context",
      "Responsible disclosure and ethical security research",
    ],
    recommendedSkills: ["DNS & TLS fundamentals", "HTTP protocol", "Security headers", "OWASP concepts", "Technical writing"],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    eyebrow: "Product Design & Design Systems",
    description:
      "Craft thoughtful user journeys that transform intimidating technical diagnostics into friendly, actionable, and visually clear reports.",
    focusAreas: [
      "Intuitive security dashboard user flows",
      "Design systems and component consistency",
      "Accessible color systems and high-contrast typography",
      "Wireframing, prototyping, and user testing",
      "Visual communication of security risk levels",
    ],
    recommendedSkills: ["Figma", "User Journey Mapping", "Design Systems", "Prototyping", "Accessibility"],
  },
  {
    id: "technical-content",
    title: "Technical Content & Docs",
    eyebrow: "Education & Communication",
    description:
      "Translate complex cybersecurity concepts into clear, practical documentation, knowledge-base guides, and educational articles for everyday businesses.",
    focusAreas: [
      "Security remediation guides for non-specialists",
      "Developer documentation and API guides",
      "Educational articles explaining web security basics",
      "Product release notes and user walkthroughs",
      "Responsible, fact-based security communication",
    ],
    recommendedSkills: ["Technical Writing", "Markdown", "Cybersecurity Basics", "Copywriting", "Research"],
  },
  {
    id: "product-community",
    title: "Product & Community",
    eyebrow: "Product Strategy & Outreach",
    description:
      "Listen to website owners, gather real user feedback, and help prioritize tools that solve genuine pain points in website security awareness.",
    focusAreas: [
      "User feedback collection and insight synthesis",
      "Product roadmap research and competitive landscape",
      "Community discussions and early adopter support",
      "Collaborative feature definition and user stories",
    ],
    recommendedSkills: ["User Research", "Product Thinking", "Community Engagement", "Communication", "Problem Solving"],
  },
];

export const currentOpportunities: Opportunity[] = [
  {
    id: "fe-engineer-eoi",
    title: "Frontend Software Engineer",
    category: "Engineering",
    employmentType: "Flexible",
    location: "Remote (Global)",
    experienceLevel: "Open to All",
    description:
      "We are gathering expressions of interest from engineers interested in crafting accessible, responsive user interfaces for website security analytics.",
    responsibilities: [
      "Collaborate on Next.js, React, and TypeScript user interfaces",
      "Build modular, accessible UI components with Tailwind CSS",
      "Transform security inspection results into intuitive dashboard views",
      "Ensure cross-browser compatibility and responsive performance",
    ],
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Accessibility"],
    status: "Expression of Interest",
  },
  {
    id: "be-engineer-eoi",
    title: "Backend & Systems Engineer",
    category: "Engineering",
    employmentType: "Flexible",
    location: "Remote (Global)",
    experienceLevel: "Open to All",
    description:
      "Express interest in engineering robust backend services, inspection pipelines, and secure API layers powering website posture evaluations.",
    responsibilities: [
      "Assist in architecting REST APIs with Python & FastAPI",
      "Develop reliable DNS, SSL, and HTTP header analysis modules",
      "Optimize data persistence and asynchronous job management",
      "Maintain clean documentation and automated test coverage",
    ],
    skills: ["Python", "FastAPI", "PostgreSQL", "REST APIs", "Git"],
    status: "Expression of Interest",
  },
  {
    id: "security-researcher-eoi",
    title: "Cybersecurity Research Collaborator",
    category: "Security",
    employmentType: "Project-Based",
    location: "Remote (Global)",
    experienceLevel: "Open to All",
    description:
      "Collaborate on analyzing real-world web configuration vulnerabilities, refining security evaluation criteria, and writing remediation advice.",
    responsibilities: [
      "Research website security configurations across diverse web hosting environments",
      "Review security header efficacy (CSP, HSTS, Referrer-Policy, Permissions-Policy)",
      "Help author clear, non-alarmist remediation advice for small business owners",
      "Ensure all security methodologies strictly adhere to ethical, responsible principles",
    ],
    skills: ["Web Security", "DNS/SSL", "HTTP Headers", "Security Research", "Technical Writing"],
    status: "Expression of Interest",
  },
  {
    id: "uiux-designer-eoi",
    title: "Product & UI/UX Designer",
    category: "Design",
    employmentType: "Flexible",
    location: "Remote (Global)",
    experienceLevel: "Open to All",
    description:
      "Express interest in defining user journeys, visual components, and accessible reporting experiences for cybersecurity posture SaaS.",
    responsibilities: [
      "Design intuitive web workflows for configuring and reviewing site checks",
      "Maintain a consistent, high-contrast, professional design system",
      "Produce interactive prototypes and test usability assumptions",
      "Collaborate closely with frontend engineers during UI implementation",
    ],
    skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research"],
    status: "Coming Soon",
  },
  {
    id: "tech-writer-eoi",
    title: "Technical Content & Security Writer",
    category: "Content & Product",
    employmentType: "Flexible",
    location: "Remote (Global)",
    experienceLevel: "Open to All",
    description:
      "Help make website cybersecurity concepts approachable through clear guides, educational articles, and documentation.",
    responsibilities: [
      "Write concise, actionable explanations for common web security misconfigurations",
      "Produce step-by-step guides for popular web platforms (WordPress, Cloudflare, NGINX)",
      "Collaborate with engineering to document product capabilities and updates",
      "Maintain a welcoming, fact-driven, fear-free tone throughout all materials",
    ],
    skills: ["Technical Writing", "Web Fundamentals", "Content Strategy", "Documentation"],
    status: "Coming Soon",
  },
];

export const internshipTracks: InternshipTrack[] = [
  {
    id: "frontend-intern",
    title: "Frontend Development Intern",
    eyebrow: "Track 01",
    tagline: "Build accessible interfaces that demystify web security.",
    description:
      "Work with modern frontend tools (React, Next.js, TypeScript) to create clean, responsive dashboards that present security insights clearly to everyday users.",
    learningAreas: [
      "Next.js App Router and Server Components",
      "Component-driven design systems with Tailwind CSS",
      "Data visualization for security metrics and configuration states",
      "Web accessibility (a11y) standards and responsive testing",
    ],
    foundationalSkills: ["HTML5 & CSS3", "Modern JavaScript (ES6+)", "React basics", "Git & GitHub"],
    suggestedProjects: [
      "A responsive dashboard displaying mock API data with clean charts",
      "An accessible interactive checklist or form with validation",
      "A personal portfolio built with Next.js and Tailwind CSS",
    ],
    status: "Expression of Interest",
  },
  {
    id: "backend-intern",
    title: "Backend Development Intern",
    eyebrow: "Track 02",
    tagline: "Develop reliable APIs and security analysis microservices.",
    description:
      "Gain practical experience building backend endpoints, testing web services, and designing inspection tasks using Python, FastAPI, and relational databases.",
    learningAreas: [
      "RESTful API design and OpenAPI documentation",
      "Asynchronous networking and task execution in Python",
      "Relational data modeling with PostgreSQL",
      "Automated testing and continuous integration fundamentals",
    ],
    foundationalSkills: ["Python or Node.js basics", "HTTP methods & status codes", "SQL fundamentals", "Git"],
    suggestedProjects: [
      "A REST API that queries domain DNS records and returns structured JSON",
      "A database-backed URL tracking service with basic CRUD and validation",
      "A CLI tool that checks HTTP response headers for a given URL",
    ],
    status: "Expression of Interest",
  },
  {
    id: "cybersecurity-intern",
    title: "Cybersecurity Research Intern",
    eyebrow: "Track 03",
    tagline: "Explore web security standards and actionable posture review.",
    description:
      "Investigate common website vulnerabilities, security header configurations, SSL/TLS cipher suites, and contribute to actionable remediation playbooks.",
    learningAreas: [
      "Web security headers (CSP, HSTS, X-Content-Type-Options, etc.)",
      "SSL/TLS protocol negotiation and certificate validation",
      "DNS security foundations (DNSSEC, SPF, DKIM, DMARC)",
      "Ethical security research and responsible disclosure protocols",
    ],
    foundationalSkills: ["Understanding of HTTP/HTTPS", "Basic networking concepts", "Curiosity about web security", "Clear writing"],
    suggestedProjects: [
      "A documented audit of 5 public websites comparing their security headers",
      "A write-up explaining why SPF, DKIM, and DMARC matter for email authenticity",
      "A non-technical explainer on how HTTPS certificates prevent man-in-the-middle attacks",
    ],
    status: "Expression of Interest",
  },
  {
    id: "ui-ux-intern",
    title: "UI/UX Design Intern",
    eyebrow: "Track 04",
    tagline: "Transform dense security data into intuitive, empowering UI.",
    description:
      "Design intuitive web experiences, high-contrast layouts, and understandable data hierarchy to help non-experts make informed security decisions.",
    learningAreas: [
      "User research and persona development for small business owners",
      "Wireframing, interactive prototyping, and design systems in Figma",
      "Designing for accessibility (color contrast, touch targets, screen readers)",
      "Visual communication of risk levels without causing undue alarm",
    ],
    foundationalSkills: ["Figma or equivalent UI design tool", "Visual hierarchy & typography", "Basic understanding of web UI", "Empathy for users"],
    suggestedProjects: [
      "A redesign of a complex technical report into a user-friendly single-page dashboard",
      "A mini design system in Figma with components, colors, and typography tokens",
      "A mobile-first onboarding flow for a web utility or SaaS application",
    ],
    status: "Expression of Interest",
  },
  {
    id: "content-intern",
    title: "Technical Content Intern",
    eyebrow: "Track 05",
    tagline: "Make cybersecurity knowledge accessible through practical writing.",
    description:
      "Create clear, actionable guides, documentation, and educational articles that help website owners take simple steps to improve their digital security.",
    learningAreas: [
      "Translating complex technical jargon into friendly, actionable prose",
      "Writing step-by-step security remediation guides for web platforms",
      "Structuring developer documentation and knowledge-base articles",
      "Search-optimized, value-first technical storytelling",
    ],
    foundationalSkills: ["Strong written English communication", "Curiosity about web technologies", "Attention to detail", "Basic Markdown knowledge"],
    suggestedProjects: [
      "A step-by-step tutorial on how to configure HSTS in an Apache or NGINX server",
      "An article explaining website security basics in plain language for small business owners",
      "A comparison guide explaining the difference between SSL and TLS",
    ],
    status: "Expression of Interest",
  },
  {
    id: "product-intern",
    title: "Product & Community Intern",
    eyebrow: "Track 06",
    tagline: "Help connect user needs with product development priorities.",
    description:
      "Engage with early users, gather feedback on website security challenges, and assist in synthesizing practical insights for product roadmap planning.",
    learningAreas: [
      "User feedback collection, qualitative synthesis, and user interviews",
      "Competitor and market landscape research in cybersecurity SaaS",
      "Writing user stories and functional requirements for engineering",
      "Community engagement and building relationships with early adopters",
    ],
    foundationalSkills: ["Strong organizational and communication skills", "Critical thinking", "Interest in SaaS business models", "Empathy"],
    suggestedProjects: [
      "A competitive analysis report on 3 website security scanning platforms",
      "A user survey and synthesized report analyzing what SMBs struggle with most in website maintenance",
      "A proposed product roadmap feature document with user stories and wireframe sketches",
    ],
    status: "Expression of Interest",
  },
];

export const careersFaqs: FaqItem[] = [
  {
    question: "Can students and recent graduates apply?",
    answer:
      "Yes. We welcome curious individuals at all stages of their journey. While specific requirements depend on each opportunity, enthusiasm for learning, thoughtful problem-solving, and building practical projects matter deeply to us.",
  },
  {
    question: "Do I need years of prior professional work experience?",
    answer:
      "Not necessarily. For early-career tracks and expressions of interest, what you have built—such as personal projects, open-source contributions, code repositories, or well-documented research—often tells us much more than formal tenure.",
  },
  {
    question: "Are all listed roles currently actively recruiting?",
    answer:
      "No. To maintain complete transparency, roles labeled 'Open' are actively hiring. Roles labeled 'Expression of Interest' or 'Coming Soon' allow you to share your profile early so we can reach out as specific requirements and openings develop.",
  },
  {
    question: "Are opportunities remote or location-dependent?",
    answer:
      "SiteSecura operates remotely. Team members and contributors collaborate across digital workspaces, Git, and asynchronous communication tools. Specific working arrangements will always be detailed for any confirmed role.",
  },
  {
    question: "Is every internship or collaboration paid?",
    answer:
      "Compensation arrangements are determined by the specific scope, nature, and confirmation of each position. We do not make generic assumptions—details including duration, expectations, and any compensation will always be explicitly documented upon formal posting.",
  },
  {
    question: "How should I share my projects or portfolio?",
    answer:
      "You can include links to your GitHub profile, live projects, portfolio website, Figma files, or technical blog posts directly in our configured expression of interest form.",
  },
];

export const internshipFaqs: FaqItem[] = [
  {
    question: "Who is eligible to apply for internship tracks?",
    answer:
      "Our tracks are designed for college students, university undergraduates, recent graduates, self-taught developers, transitioning professionals, and anyone passionate about building practical skills in web development, cybersecurity, or product design.",
  },
  {
    question: "Does submitting an expression of interest guarantee selection?",
    answer:
      "Submitting an application registers your profile with us for review, but does not guarantee selection or immediate placement. As specific internship cohorts and project scopes are finalized, candidates whose backgrounds align will be contacted directly.",
  },
  {
    question: "What is the expected time commitment?",
    answer:
      "Time commitments and durations depend on the individual track and confirmed project schedule. Most arrangements are designed to be flexible and manageable alongside ongoing academic commitments.",
  },
  {
    question: "What should I NOT include in my application?",
    answer:
      "Please do not submit any sensitive personal data such as passwords, banking details, government identification numbers, confidential proprietary code, or unrelated private materials. Only submit relevant contact details and public project links.",
  },
  {
    question: "What happens after I submit my application?",
    answer:
      "Your submission is logged and categorized by your selected area of interest. When relevant opportunities arise, we review submissions based on demonstrated curiosity, project examples, and alignment with upcoming work.",
  },
];
