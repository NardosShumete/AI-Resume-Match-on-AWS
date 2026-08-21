# ResuMatch AI 🎯

> **Smart feedback for your dream job.**  
> Analyze your resume directly against real-world job descriptions, calculate ATS compatibility scores, pinpoint missing keywords, and get tailored AI-driven bullet point improvements.

---

## 📸 Overview & Product Screenshots

ResuMatch AI is a modern SaaS frontend application designed to emulate Applicant Tracking System (ATS) parsing and provide job seekers with actionable insights to maximize interview callbacks.

---

## ✨ Features Implemented (Phase 1 Frontend)

### 1. 🌟 Landing & Showcase Experience (`/`)
- **Hero Section**: Value proposition with dynamic CTA buttons and instant navigation.
- **Interactive Product Preview**: Live interactive preview card displaying resume analysis scores, keyword tag heatmaps, and Google X-Y-Z formula bullet rewrite comparisons.
- **Engine Capabilities (Bento Grid)**: Visual showcase of ATS Parser Emulation, Weighted Keyword Heatmap, Action & Metric Bullet Re-writer, and Role Fit & Skills Gap Analysis.
- **3-Step Workflow**: Clear walkthrough showing how users upload resumes, attach job descriptions, and unlock detailed ATS reports.

### 2. 🔐 Authentication & Demo Access (`/login`)
- **Mock Authentication Flow**: Complete sign-in / sign-out interface with validation feedback.
- **One-Click Demo Personas**:
  - `Alex Rivera` (Senior Software Engineer)
  - `Sarah Chen` (Product Lead / Recruiter)
- **Protected Routing**: `AuthGuard` component safeguarding Dashboard, Analyzer, and Results views.

### 3. 📊 Analytics Dashboard (`/dashboard`)
- **Metrics Overview Bar**: High-density metric cards tracking Total Resumes Analyzed, Average ATS Score, Keyword Match Rate, and Top Match Count.
- **Search & Filter Command Bar**: Instant real-time search by job title, company, or file name, plus score filter tabs (*All Reports* vs. *Top Matches ≥ 80%*).
- **Interactive Resume Cards**: Visual score badges, targeted role details, matched skill tags, missing requirement flags, and 1-click report navigation.
- **Quick Action Bar**: Direct button to start a new analysis.

### 4. ⚡ ATS Engine & Analyzer (`/analyzer`)
- **Interactive Resume Dropzone**: Drag-and-drop file upload with support for PDF files, real-time file size/name indicators, and instant mock demo resume loader.
- **Target Role & Job Description**:
  - Target Job Title & Target Company fields.
  - Job Description textarea with live word count and smart recommendations.
- **1-Click Test Role Presets**: Instant auto-fill buttons for:
  - `Senior Frontend Engineer` (Stripe)
  - `Product Manager` (Linear)
  - `DevOps & Cloud Engineer` (AWS)
- **Live Readiness Checklist**: Interactive checklist monitoring resume upload and job description requirements before triggering analysis.
- **Simulated Scanning State**: Realistic AI scanning animation with progress feedback.

### 5. 📑 Detailed ATS Results View (`/results`)
- **Radial ATS Score Gauge**: Interactive SVG circular score gauge with dynamic color tiering (Green 80%+, Yellow 60-79%, Red <60%).
- **Score Dimension Breakdown**: Progress meters breaking down:
  - Keyword & Skill Match
  - Formatting & ATS Readability
  - Experience Relevance
  - Impact & Measurable Metrics
- **Weighted Keyword Analysis**:
  - **Matching Keywords**: High-priority matched skills in clean success badges.
  - **Missing Keywords**: Flagged gaps marked with importance tiers (*High Priority*, *Medium Priority*).
- **AI Recommendation Accordions**:
  - **Bullet Point Rewrites**: Before (weak action) vs. After (Google X-Y-Z formula: Accomplished [X], measured by [Y], by doing [Z]) with copy-to-clipboard functionality.
  - **Formatting & Layout Tips**: Actionable ATS structure suggestions.
  - **Skills Gap Action Plan**: Direct steps to bridge qualification differences.

### 6. 🎨 Design System & Theme Engine
- **Dark & Light Mode**: Seamless theme switching with system preference detection and local persistence.
- **Typography**: Paired modern fonts (*Plus Jakarta Sans* for UI, *JetBrains Mono* for code/metrics).
- **Tailwind CSS v4 & PostCSS**: Zero external heavyweight UI dependencies; sleek, clean, minimalist SaaS aesthetic.
- **Responsive Layout**: Mobile drawer navigation and responsive grid system across all breakpoints.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling & CSS** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **State Management** | [Zustand v5](https://github.com/pmndrs/zustand) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Structure

```text
ResuMatch/
├── public/                     # Static assets (logo.png, favicons)
├── src/
│   ├── assets/                 # Project images & illustrations
│   ├── components/
│   │   ├── analyzer/           # Analyzer page components
│   │   │   ├── JobDescriptionInput.tsx
│   │   │   ├── JobInformationForm.tsx
│   │   │   └── UploadDropzone.tsx
│   │   ├── auth/               # Authentication guard & forms
│   │   │   ├── AuthGuard.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── home/               # Landing page sections
│   │   │   ├── FeatureSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── ProductPreview.tsx
│   │   │   └── ResumeCard.tsx
│   │   ├── layout/             # Header, Footer, PageContainer
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── results/            # Results view & scoring components
│   │   │   ├── FeedbackAccordion.tsx
│   │   │   ├── KeywordSection.tsx
│   │   │   ├── ScoreBreakdown.tsx
│   │   │   └── ScoreGauge.tsx
│   │   └── ui/                 # Reusable UI primitives (Button, Badge, Card)
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── IconContainer.tsx
│   │       └── SectionHeading.tsx
│   ├── data/                   # Mock ATS data & test resumes
│   │   └── mockAnalyses.ts
│   ├── lib/                    # Utility helpers (cn / tailwind-merge)
│   │   └── utils.ts
│   ├── pages/                  # Page route components
│   │   ├── Analyzer.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   └── Results.tsx
│   ├── stores/                 # Zustand state stores
│   │   ├── useAuthStore.ts
│   │   └── useResumeStore.ts
│   ├── App.tsx                 # Main application routes & layout wrapper
│   ├── index.css               # Global styles, Tailwind CSS & color tokens
│   └── main.tsx                # React DOM entry point
├── .gitignore                  # Git ignore rules for Vite, Node & Env files
├── index.html                  # HTML entry point with metadata
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind theme definitions
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/resumatch-ai.git
   cd resumatch-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🔮 Roadmap (Phase 2 & Beyond)

- [ ] **Real PDF Parsing**: Client-side / server-side document parsing via `pdfjs-dist`.
- [ ] **AI Model Integration**: LLM analysis pipeline powered by Google Gemini 1.5 Flash / Pro API.
- [ ] **Cloud Backend**: Serverless AWS Lambda microservices + API Gateway.
- [ ] **Persistence**: User account & resume history storage via AWS DynamoDB.
- [ ] **Export Options**: Export customized PDF resumes and ATS report summaries.

---


