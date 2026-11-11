export const OFFICIAL_RAZORPAY_URL = "https://rzp.io/rzp/6YVhqsy";
export const RAZORPAY_INTERNSHIP_URL = OFFICIAL_RAZORPAY_URL;

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface DeliverableItem {
  id: string;
  number: string;
  title: string;
  description: string;
  badge?: string;
  iconName: string;
}

export interface TimelineStep {
  step: number;
  title: string;
  description: string;
  tag: string;
}

export interface DomainRole {
  id: string;
  title: string;
  category: "technology" | "business";
  description: string;
  skills: string[];
  iconName: string;
}

export interface LearningPillar {
  title: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const WHY_JOIN_BENEFITS: BenefitItem[] = [
  {
    id: "practical-exp",
    title: "Practical Experience",
    description:
      "Understand how technology projects are planned, developed, tested, and improved. Apply what you know to practical assignments.",
    iconName: "Laptop",
  },
  {
    id: "live-exposure",
    title: "Live Project Exposure",
    description:
      "Get opportunities to contribute to real SiteSecura project workflows, subject to project availability, access permissions, and assigned responsibilities.",
    iconName: "GitBranch",
  },
  {
    id: "prof-docs",
    title: "Professional Documentation",
    description:
      "Build your professional portfolio with formal internship documentation and records of your participation and achievements.",
    iconName: "FileCheck",
  },
  {
    id: "industry-skills",
    title: "Industry-Relevant Skills",
    description:
      "Develop technical, communication, teamwork, problem-solving, and time-management skills that are useful throughout your career.",
    iconName: "Sparkles",
  },
  {
    id: "mentorship",
    title: "Mentorship and Guidance",
    description:
      "Receive guidance, task feedback, and learning support according to the assigned internship structure and mentor availability.",
    iconName: "Users",
  },
  {
    id: "career-opps",
    title: "Career Opportunities",
    description:
      "Strong performers may be considered for additional responsibilities, paid opportunities, or future employment opportunities, subject to separate evaluation and available openings.",
    iconName: "TrendingUp",
  },
];

export const WHAT_YOU_RECEIVE: DeliverableItem[] = [
  {
    id: "offer-letter",
    number: "01",
    title: "Internship Offer Letter",
    description:
      "Receive an official internship offer letter after successful selection and completion of the required onboarding formalities.",
    badge: "Official Record",
    iconName: "FileText",
  },
  {
    id: "lor",
    number: "02",
    title: "Letter of Recommendation (LOR)",
    description:
      "Eligible candidates demonstrating strong performance, responsibility, and professional conduct may receive a Letter of Recommendation, based on an individual evaluation.",
    badge: "Merit-Based",
    iconName: "Award",
  },
  {
    id: "certificate",
    number: "03",
    title: "Internship Completion Certificate",
    description:
      "Receive an official SiteSecura completion certificate after fulfilling the defined internship duration, assigned responsibilities, and completion requirements.",
    badge: "Verifiable Credential",
    iconName: "CheckCircle2",
  },
  {
    id: "project-exp",
    number: "04",
    title: "Practical Project Experience",
    description:
      "Work on structured tasks and project-related assignments to understand professional development workflows and demonstrate your skills.",
    badge: "Hands-On",
    iconName: "Code2",
  },
  {
    id: "feedback",
    number: "05",
    title: "Performance Feedback",
    description:
      "Receive feedback on your work, strengths, areas for improvement, and professional development throughout your milestones.",
    badge: "Constructive Review",
    iconName: "MessageSquare",
  },
  {
    id: "portfolio",
    number: "06",
    title: "Portfolio Development",
    description:
      "Build examples of your work and contributions that can help you demonstrate your abilities during future job applications.",
    badge: "Career Asset",
    iconName: "Briefcase",
  },
  {
    id: "profile-dev",
    number: "07",
    title: "Professional Profile Development",
    description:
      "Learn how to present your skills, projects, experience, and accomplishments more effectively on your resume and professional profiles.",
    badge: "Career Guidance",
    iconName: "UserCheck",
  },
  {
    id: "career-consideration",
    number: "08",
    title: "Career Consideration",
    description:
      "Exceptional performers may be considered for paid internship opportunities, extended responsibilities, or future employment opportunities when suitable openings are available.",
    badge: "Performance-Based",
    iconName: "Rocket",
  },
];

export const PROGRAM_DELIVERABLES = WHAT_YOU_RECEIVE;

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: 1,
    title: "Join the Program",
    description:
      "Complete the official registration process through our secure application link.",
    tag: "Registration",
  },
  {
    step: 2,
    title: "Selection and Onboarding",
    description:
      "Your application is reviewed. Selected candidates receive relevant communication and onboarding instructions.",
    tag: "Review & Setup",
  },
  {
    step: 3,
    title: "Start Learning",
    description:
      "Understand your role, assigned responsibilities, project workflow, communication process, and learning objectives.",
    tag: "Orientation",
  },
  {
    step: 4,
    title: "Work on Practical Assignments",
    description:
      "Complete assigned tasks, participate in project-related activities, receive feedback, and improve your capabilities.",
    tag: "Hands-On Tasks",
  },
  {
    step: 5,
    title: "Complete and Grow",
    description:
      "Candidates who fulfill the internship requirements receive applicable completion documentation. High-performing candidates may be considered for further opportunities.",
    tag: "Certification & Growth",
  },
];

export const INTERNSHIP_DOMAINS: DomainRole[] = [
  // Technology Roles
  {
    id: "full-stack",
    title: "Full-Stack Development",
    category: "technology",
    description:
      "Build modern end-to-end web applications, integrating responsive frontends with robust backend APIs and databases.",
    skills: ["Next.js", "React", "TypeScript", "Node.js / Python", "REST APIs", "PostgreSQL"],
    iconName: "Layers",
  },
  {
    id: "frontend",
    title: "Frontend Development",
    category: "technology",
    description:
      "Develop performant, accessible, and intuitive interfaces with modern React, Next.js, and Tailwind CSS.",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Semantic HTML", "Accessibility (a11y)"],
    iconName: "Layout",
  },
  {
    id: "backend",
    title: "Backend Development",
    category: "technology",
    description:
      "Architect clean REST APIs, data services, and inspection pipelines with Python, FastAPI, and relational storage.",
    skills: ["Python", "FastAPI", "PostgreSQL", "API Security", "Data Modeling", "Git"],
    iconName: "Server",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    category: "technology",
    description:
      "Review website security posture, SSL/TLS configurations, DNS records (SPF, DKIM, DMARC), and HTTP security headers.",
    skills: ["HTTPS / TLS", "DNS Security", "HTTP Security Headers", "OWASP Concepts", "Security Auditing"],
    iconName: "Shield",
  },
  {
    id: "ai-ml",
    title: "AI and Machine Learning",
    category: "technology",
    description:
      "Explore applied data science, automated text/security analytics, model evaluation, and modern AI developer workflows.",
    skills: ["Python", "Data Analysis", "Prompt Engineering", "API Integration", "Model Evaluation"],
    iconName: "Cpu",
  },
  {
    id: "software-dev",
    title: "Software Development",
    category: "technology",
    description:
      "Learn software engineering principles, algorithms, automated testing, version control workflows, and code quality standards.",
    skills: ["Clean Code", "Data Structures", "Unit Testing", "Git Collaboration", "CI/CD Basics"],
    iconName: "Code",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    category: "technology",
    description:
      "Design user-friendly workflows, wireframes, accessible design systems, and intuitive interactive prototypes.",
    skills: ["Figma", "User Journey Mapping", "Design Systems", "Prototyping", "WCAG Contrast"],
    iconName: "Palette",
  },

  // Business and Growth Roles
  {
    id: "marketing",
    title: "Marketing",
    category: "business",
    description:
      "Explore digital product positioning, audience research, messaging frameworks, and growth marketing fundamentals.",
    skills: ["Market Research", "Digital Marketing", "User Acquisition", "Content Strategy"],
    iconName: "Megaphone",
  },
  {
    id: "social-media",
    title: "Social Media Management",
    category: "business",
    description:
      "Create engaging tech communication, manage community updates, schedule announcements, and analyze engagement metrics.",
    skills: ["Community Building", "Content Scheduling", "Visual Storytelling", "Audience Analytics"],
    iconName: "Share2",
  },
  {
    id: "content-writing",
    title: "Content Writing",
    category: "business",
    description:
      "Write clear, educational articles, technical guides, documentation, and user-friendly explainers for everyday website owners.",
    skills: ["Technical Writing", "Educational Content", "Copywriting", "Research & Synthesis"],
    iconName: "PenTool",
  },
  {
    id: "product-research",
    title: "Product Research",
    category: "business",
    description:
      "Gather user feedback, analyze SaaS competitive landscapes, and help synthesize actionable product insights.",
    skills: ["User Interviews", "Competitive Analysis", "Feature Benchmarking", "Product Thinking"],
    iconName: "Search",
  },
  {
    id: "business-dev",
    title: "Business Development",
    category: "business",
    description:
      "Research strategic collaboration opportunities, prepare professional outreach, and understand early-stage tech growth.",
    skills: ["Partner Outreach", "Communication", "SaaS Business Models", "Market Analysis"],
    iconName: "Briefcase",
  },
  {
    id: "hr",
    title: "Human Resources",
    category: "business",
    description:
      "Learn talent onboarding coordination, team communication, candidate engagement, and documentation workflows.",
    skills: ["Talent Operations", "Onboarding Workflows", "Team Coordination", "People Operations"],
    iconName: "UserCheck",
  },
];

export const WHAT_YOU_WILL_LEARN: LearningPillar[] = [
  {
    title: "Technical Skills",
    description:
      "Improve your understanding of development tools, project workflows, testing, documentation, and practical problem-solving.",
    iconName: "Terminal",
    highlights: [
      "Modern development tooling & Git workflows",
      "Code testing, debugging, and review standards",
      "Structured documentation and API contracts",
    ],
  },
  {
    title: "Communication Skills",
    description:
      "Learn professional communication, task reporting, collaboration, and presenting your work clearly.",
    iconName: "MessageCircle",
    highlights: [
      "Clear asynchronous status reporting",
      "Constructive feedback reception & collaboration",
      "Translating technical concepts for varied audiences",
    ],
  },
  {
    title: "Professional Discipline",
    description:
      "Develop consistency, ownership, responsibility, time management, and the ability to work towards defined goals.",
    iconName: "Clock",
    highlights: [
      "Milestone planning and respecting deadlines",
      "Accountability for assigned task deliverables",
      "Self-directed learning and resourcefulness",
    ],
  },
  {
    title: "Career Readiness",
    description:
      "Learn to document projects, present your experience, improve your resume, and prepare for professional opportunities.",
    iconName: "Compass",
    highlights: [
      "Translating assignments into strong portfolio entries",
      "Effective resume and LinkedIn profile articulation",
      "Interview preparation and technical discussions",
    ],
  },
];

export const WHO_SHOULD_APPLY = {
  suitableFor: [
    "College students seeking practical experience.",
    "Freshers building their first professional portfolio.",
    "Students interested in technology and startups.",
    "Individuals who want to understand real project workflows.",
    "Learners willing to take responsibility and complete assigned tasks.",
    "Candidates looking to improve their professional communication and technical abilities.",
  ],
  whatWeExpect: [
    "Willingness to learn.",
    "Responsible communication.",
    "Consistent participation.",
    "Respect for deadlines.",
    "Professional behavior.",
    "Honest representation of skills.",
    "Commitment to assigned tasks.",
  ],
};

export const INTERNSHIP_FAQS: FaqItem[] = [
  {
    question: "Is the SiteSecura internship program paid?",
    answer:
      "The initial program is a structured internship opportunity with a nominal onboarding and administrative fee of ₹99. Paid internship opportunities may be offered separately to selected high-performing candidates when suitable openings are available. A stipend is not guaranteed.",
  },
  {
    question: "Why is there a ₹99 fee?",
    answer:
      "The fee supports the administrative and onboarding work involved in processing and managing the program. It does not purchase a job, paid internship, or guaranteed certificate.",
  },
  {
    question: "Will I receive an offer letter?",
    answer:
      "Candidates who are successfully selected and complete the required onboarding formalities receive the applicable internship offer documentation.",
  },
  {
    question: "Will I receive an LOR?",
    answer:
      "An LOR may be provided to eligible candidates based on their performance, contribution, and professional conduct. It is not automatic for every participant.",
  },
  {
    question: "Will I receive a completion certificate?",
    answer:
      "Candidates who fulfill the internship duration and completion requirements can receive an official completion certificate.",
  },
  {
    question: "Will I work on live projects?",
    answer:
      "Depending on the role and project availability, participants may contribute to practical assignments and supervised project-related work. Access to production systems and confidential data is controlled.",
  },
  {
    question: "Can I get a paid internship or a job after completing the program?",
    answer:
      "High-performing candidates may be considered for paid opportunities or future employment when suitable openings exist. These opportunities require separate evaluation and are not guaranteed.",
  },
  {
    question: "Can students from different educational backgrounds apply?",
    answer:
      "Candidates may apply according to the requirements of the available roles. Role-specific selection criteria apply.",
  },
  {
    question: "How do I apply?",
    answer:
      "Click the Join Internship Program button, complete the official registration and payment process, and follow the instructions provided during onboarding.",
  },
  {
    question: "How can I verify my internship certificate?",
    answer:
      "Once a certificate is officially issued, you can use the SiteSecura certificate verification portal at: https://sitesecura.info/verify-internship",
  },
];
