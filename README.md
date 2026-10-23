# SiteSecura Informational Website & Careers Portal
> Primary informational website for **SiteSecura** at [https://sitesecura.info](https://sitesecura.info).  
> The main cybersecurity SaaS scanning platform is hosted separately at [https://sitesecura.com](https://sitesecura.com).

---

## 1. Overview & Architecture

This repository contains the standalone, production-ready informational website for **SiteSecura**. It is built to communicate the SiteSecura product vision, educate website owners on accessible website security posture, showcase career and internship opportunities, and provide verified contact routes.

### Key Highlights
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom design tokens for deep midnight navy (`#080D19`), electric blue (`#4F8CFF`), and cyan (`#35D6E8`)
- **Icons**: Lucide React
- **Rendering**: 100% Static Prerendering (SSG) for maximum performance and edge caching
- **Zero Heavy Infrastructure**: No backend database, Redis, or Celery required. Recruitment intake is managed through configured external forms (e.g., Google Forms) or direct email fallbacks.
- **Strict Independence**: Completely separate from the main SaaS product repository at `sitesecura.com`.

---

## 2. Directory Structure

```text
sitesecura-info/
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with Inter font, Navbar, and Footer
│   │   ├── globals.css               # Design tokens, gradients, and a11y focus styles
│   │   ├── page.tsx                  # Home page with hero, visualization, and features
│   │   ├── about/page.tsx            # Company mission, vision, and principles
│   │   ├── product/page.tsx          # SaaS platform architecture & capability breakdown
│   │   ├── careers/page.tsx          # Careers overview, disciplines & active opportunities
│   │   ├── internships/page.tsx      # 6 Student & early-career internship tracks
│   │   ├── apply/page.tsx            # Dedicated application portal & fallback guidance
│   │   ├── contact/page.tsx          # Verified contact channels & product links
│   │   ├── privacy/page.tsx          # Privacy policy template for informational site
│   │   ├── terms/page.tsx            # Terms of service & security disclaimer
│   │   ├── responsible-disclosure/   # Ethical disclosure & reporting instructions
│   │   ├── not-found.tsx             # Branded 404 error page
│   │   ├── robots.ts                 # Dynamic robots.txt
│   │   └── sitemap.ts                # Dynamic XML sitemap
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Container.tsx         # Responsive container constraints
│   │   │   ├── Navbar.tsx            # Sticky navbar with mobile drawer & active states
│   │   │   └── Footer.tsx            # Dynamic year, footer links & brand information
│   │   └── shared/
│   │       ├── Badge.tsx             # Status indicators (Open, Coming Soon, etc.)
│   │       ├── Button.tsx            # Accessible button component
│   │       ├── ApplicationButton.tsx # Smart link button with graceful unconfigured fallback
│   │       ├── SectionHeader.tsx     # Eyebrow, title, and description layout
│   │       ├── Card.tsx              # Glowing cybersecurity card container
│   │       ├── FaqAccordion.tsx      # Keyboard-accessible ARIA accordion
│   │       ├── CtaBanner.tsx         # Reusable CTA linking to sitesecura.com
│   │       ├── Breadcrumbs.tsx       # Semantic breadcrumbs navigation
│   │       └── CyberVisual.tsx       # Custom CSS/SVG security dashboard preview
│   ├── config/
│   │   ├── site.ts                   # Central website & contact configuration
│   │   └── careers.ts                # Centralized opportunities & tracks config
│   └── lib/
│       └── metadata.ts               # OpenGraph, Twitter, and canonical metadata helper
├── .env.example                      # Documented environment variables
├── next.config.mjs                   # Next.js production configuration
├── tailwind.config.ts                # Theme extensions and color tokens
├── tsconfig.json                     # TypeScript compiler options
└── package.json                      # Project dependencies & scripts
```

---

## 3. Environment Configuration

Copy `.env.example` to `.env.local` to override default URLs or contact channels:

```bash
cp .env.example .env.local
```

### Supported Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of this informational site | `https://sitesecura.info` |
| `NEXT_PUBLIC_PLATFORM_URL` | Destination for platform links & CTAs | `https://sitesecura.com` |
| `NEXT_PUBLIC_APPLICATION_FORM_URL` | External Google Form for general/internship intake | `""` (falls back to email route) |
| `NEXT_PUBLIC_INTERNSHIP_FORM_URL` | Specific Google Form URL for internships | `""` |
| `NEXT_PUBLIC_CAREERS_FORM_URL` | Specific Google Form URL for careers | `""` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | General inquiries contact address | `contact@sitesecura.com` |
| `NEXT_PUBLIC_CAREERS_EMAIL` | Recruitment team contact address | `careers@sitesecura.com` |
| `NEXT_PUBLIC_SECURITY_EMAIL` | Responsible vulnerability disclosure address | `security@sitesecura.com` |

> **Graceful Unconfigured Form Behavior**: If `NEXT_PUBLIC_APPLICATION_FORM_URL` is left empty or omitted, application buttons automatically direct users to `/apply` with a pre-formatted email template and instructions. Broken links or fake submission modals are strictly prevented.

---

## 4. Local Development

Ensure Node.js 18+ (tested with Node 20 and 22) is installed:

```bash
# 1. Install dependencies
npm install

# 2. Run the local development server
npm run dev

# 3. Open your browser
# Visit http://localhost:3000
```

---

## 5. Verification & Testing Commands

To run complete verification before deployment:

```bash
# Type check all TypeScript files
npm run typecheck

# Run Next.js ESLint validation
npm run lint

# Build production static bundle
npm run build
```

---

## 6. GitHub Repository Setup

To push this project to a separate, new GitHub repository:

```bash
# Initialize git in this directory
git init

# Stage all files
git add .

# Initial commit
git commit -m "feat: complete production informational website for sitesecura.info"

# Link to your new remote repository on GitHub
git remote add origin https://github.com/<your-username-or-org>/sitesecura-info.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 7. Vercel Deployment Instructions

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **"Add New..."** > **"Project"**.
3. Select your GitHub repository (`sitesecura-info`).
4. Keep the Framework Preset as **Next.js**.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL` = `https://sitesecura.info`
   - `NEXT_PUBLIC_PLATFORM_URL` = `https://sitesecura.com`
   - `NEXT_PUBLIC_APPLICATION_FORM_URL` = (Your Google Form URL, if ready)
   - `NEXT_PUBLIC_CONTACT_EMAIL` = `contact@sitesecura.com`
   - `NEXT_PUBLIC_CAREERS_EMAIL` = `careers@sitesecura.com`
   - `NEXT_PUBLIC_SECURITY_EMAIL` = `security@sitesecura.com`
6. Click **Deploy**. Vercel will build and assign an edge domain (`sitesecura-info.vercel.app`).

---

## 8. Custom Domain Configuration for `sitesecura.info`

Once deployed on Vercel:

1. Navigate to **Project Settings** > **Domains** in your Vercel project.
2. Enter `sitesecura.info` and click **Add**. Also add `www.sitesecura.info` (Vercel will offer to redirect `www` to the apex or vice versa).
3. In your DNS provider (Namecheap, Cloudflare, GoDaddy, etc.) for `sitesecura.info`:
   - **Apex Domain (`@`)**: Add an `A` record pointing to `76.76.21.21` (or the IP displayed by Vercel).
   - **Subdomain (`www`)**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.
4. **Important**: Preserve existing `MX`, `TXT` (SPF), and `CNAME` (DKIM) records if you receive emails on `sitesecura.info`. Do not change nameservers unless intentional.
5. Vercel will automatically provision a free Let's Encrypt SSL/TLS certificate once DNS propagates.

---

## 9. Brand & Integrity Principles

- **No False Claims**: The website does not invent customer statistics, corporate entity registrations, or awards.
- **Honest Opportunities**: All career positions default to `Coming Soon` or `Expression of Interest` until officially verified.
- **Product CTAs**: All "Explore Platform" and "Visit Platform" buttons route directly to `https://sitesecura.com`.
