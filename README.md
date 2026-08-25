# ResuMatch AI 🎯

> **AI-Powered Resume Analysis & AWS Serverless ATS Engine**  
> Analyze resumes against real-world job descriptions, calculate deterministic 0–100 ATS compatibility scores across 5 key dimensions, identify missing keywords, and generate tailored AI bullet point rewrites using Google Gemini 3.6 Flash on AWS Serverless.
> 
> **ማብራሪያ (Amharic Overview):**  
> ResuMatch AI በሰው ሰራሽ አስተውሎት (AI) የተደገፈ የስራ ማመልከቻ (Resume) መገምገሚያ ነው። የስራ ማመልከቻዎን ከስራው መስፈርት ጋር በማነፃፀር ምን ያህል ተቀባይነት እንዳለው ይገመግማል፤ እንዲሁም የተሻለ የስራ እድል እንዲያገኙ ይረዳዎታል።

---

## 📸 Overview

ResuMatch AI is a full-stack open-source SaaS web application designed to emulate Applicant Tracking System (ATS) parsing algorithms (Greenhouse, Lever, Workday, Taleo). It provides job seekers with instant, actionable insights and Google X-Y-Z formula bullet point rewrites to maximize interview callbacks.

---

## 🚀 Key Features & Architectural Phases

### 🌟 Phase 1: Modern SaaS Interface & Open Guest Access
- **Frictionless Access**: Unrestricted guest access across all routes (`/`, `/analyzer`, `/dashboard`, `/results`). No forced sign-in required.
- **✨ One-Click Example Loader**: Instantly test the real ATS engine with pre-populated software engineer candidate specs (`example-fullstack-resume.pdf`) and Stripe job requirements.
- **Dark & Light Mode**: Seamless theme switching with local storage persistence and system preference detection.

### 📄 Phase 2: Client-Side PDF Parsing Engine
- **100% Client-Side Privacy**: Fast PDF text extraction using `pdfjs-dist` inside Web Workers without uploading unencrypted documents to third parties.
- **Document Metadata & Canvas Preview**: Calculates real-time word counts, character counts, page counts, and renders a first-page PDF thumbnail preview.
- **Extracted Text Inspector**: Built-in plain text inspector to inspect raw extracted document text prior to ATS analysis.

### 🎯 Phase 3: Deterministic ATS Engine & Gemini AI Integration
- **5-Dimension Scoring Engine**:
  1. **Keyword Density & Hard Skills** (Weighted term matching)
  2. **Role & Tech Stack Alignment** (Job description relevance)
  3. **Measurable Impact** (Google X-Y-Z formula & metric density)
  4. **Formatting & ATS Readability** (Heading hierarchy & special character safety)
  5. **Action Tone & Seniority Voice** (Action verb frequency)
- **AI Recommendation Pipeline**: Powered by Google Gemini 3.6 Flash (`@google/genai`) to generate structured bullet point rewrites and skills gap action plans.

### ☁️ Phase 4: AWS Serverless Backend & SAM Infrastructure
- **Serverless Architecture**: 
  ```text
  React Frontend  ──>  API Gateway  ──>  AWS Lambda  ──>  ATS Engine  ──>  Gemini 3.6 Flash
  ```
- **AWS SAM CLI Template**: `backend/template.yaml` defining `AnalyzeResumeFunction` (`nodejs22.x`, 512MB, CORS configured).
- **Strict Security Policy**: `GEMINI_API_KEY` is server-side ONLY. It is never exposed in frontend code, Vite client environment variables, or browser bundles.

---

## 🧪 Comprehensive Unit & Contract Testing Suite

The repository includes a complete Vitest testing suite containing **38 unit & contract tests across 7 test files**:

```bash
npm test
```

| Test Suite | File Path | Coverage |
| :--- | :--- | :--- |
| **ATS Scoring Engine** | [`tests/atsEngine.test.ts`](file:///c:/Users/hp/Desktop/Portfolio/ResuMatch/tests/atsEngine.test.ts) | Score stability, regex escaping (`C++`/`.NET`), empty/large input safety |
| **Gemini AI Service** | [`tests/geminiService.test.ts`](file:///c:/Users/hp/Desktop/Portfolio/ResuMatch/tests/geminiService.test.ts) | Mocked AI feedback generation, API error handling, missing key check |
| **API Service Contract** | [`tests/apiService.test.ts`](file:///c:/Users/hp/Desktop/Portfolio/ResuMatch/tests/apiService.test.ts) | `src/services/api.ts` HTTP status handling (200, 400, 500, network error) |
| **AWS Lambda Handler** | [`backend/tests/lambdaHandler.test.ts`](file:///c:/Users/hp/Desktop/Portfolio/ResuMatch/backend/tests/lambdaHandler.test.ts) | `APIGatewayProxyEventV2` payload limits (>50k chars), CORS headers, error trapping |
| **Auth & Guest Access** | [`tests/authAndGuest.test.ts`](file:///c:/Users/hp/Desktop/Portfolio/ResuMatch/tests/authAndGuest.test.ts) | Unrestricted routing & guest user state |
| **Store & LocalStorage** | [`tests/storeAndHistory.test.ts`](file:///c:/Users/hp/Desktop/Portfolio/ResuMatch/tests/storeAndHistory.test.ts) | Zustand store resets, `resumatch_guest_history` persistence & corruption recovery |
| **PDF & Security Audit** | [`tests/pdfAndSecurity.test.ts`](file:///c:/Users/hp/Desktop/Portfolio/ResuMatch/tests/pdfAndSecurity.test.ts) | PDF text normalization, word count, client bundle security validation |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla CSS design system |
| **Client-Side PDF Parsing**| [pdfjs-dist](https://mozilla.github.io/pdf.js/) (Web Worker text extraction) |
| **State & Storage** | [Zustand v5](https://github.com/pmndrs/zustand) + `localStorage` history |
| **Cloud Backend** | [AWS Lambda](https://aws.amazon.com/lambda/) (`nodejs22.x`) + [AWS API Gateway](https://aws.amazon.com/api-gateway/) |
| **Infrastructure as Code**| [AWS SAM CLI](https://aws.amazon.com/serverless/sam/) (`template.yaml` + esbuild) |
| **AI Integration** | [Google Gemini 3.6 Flash](https://ai.google.dev/) (`@google/genai`) |
| **Test Runner** | [Vitest](https://vitest.dev/) |

---

## 📁 Project Structure

```text
ResuMatch/
├── backend/                    # AWS Serverless Lambda Microservice
│   ├── env.json                # Local SAM environment variables (Git-ignored)
│   ├── local-server.js         # Lightweight local Node.js HTTP dev server
│   ├── package.json            # Backend dependencies (@google/genai, esbuild)
│   ├── template.yaml           # AWS SAM Infrastructure template
│   └── src/
│       ├── analysis/           # Relocated ATS engine & parsers
│       ├── handlers/           # AWS Lambda API Gateway event handlers
│       ├── services/           # Server-side Gemini AI integration
│       ├── types/              # Self-contained backend TypeScript types
│       └── utils/              # Score tiering & helper functions
├── public/                     # Static assets & sample resume PDF
├── src/                        # React 19 Frontend Application
│   ├── components/             # UI components (analyzer, auth, home, layout, results)
│   ├── data/                   # Initial sample scans & presets
│   ├── hooks/                  # Custom React hooks (usePdfParser)
│   ├── pages/                  # Page view routes (Analyzer, Dashboard, Results)
│   ├── services/               # Client API gateway wrapper (src/services/api.ts)
│   ├── stores/                 # Zustand state management
│   ├── types/                  # Shared TypeScript definitions
│   └── utils/                  # Client PDF rendering & helper utilities
├── tests/                      # Frontend & API Contract Unit Tests
├── .env                        # Local environment configuration
├── package.json                # Root dependencies & test scripts
└── vitest.config.ts            # Vitest test runner configuration
```

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher (`v22.14.0` recommended)
- **npm**: `v10.0.0` or higher
- **Docker Desktop** (Optional, required for SAM local container execution)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/NardosShumete/AI-Resume-Match-on-AWS.git
cd AI-Resume-Match-on-AWS

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
VITE_API_URL=http://127.0.0.1:3001/analyze
```

Create a local `backend/env.json` for SAM local execution:
```json
{
  "AnalyzeResumeFunction": {
    "GEMINI_API_KEY": "your_google_gemini_api_key_here"
  }
}
```

### 4. Running the Development Servers

Option A — **Lightweight Local Server** (No Docker required):
```bash
# Terminal 1: Start Backend API Server on http://127.0.0.1:3001
npm run backend

# Terminal 2: Start React Frontend on http://localhost:5173
npm run dev
```

Option B — **AWS SAM CLI with Docker**:
```bash
# Build Lambda function with SAM
sam build -t backend/template.yaml --region us-east-1

# Start Local API Gateway Docker Emulator on http://127.0.0.1:3001
sam local start-api -t .aws-sam/build/template.yaml -n backend/env.json -p 3001 --region us-east-1 --skip-pull-image

# Start React Frontend
npm run dev
```

---

## ⚡ Running Tests & Builds

```bash
# Run unit & contract test suite (38 tests)
npm test

# Build frontend production bundle
npm run build

# Build backend Lambda artifact
cd backend && npm run build
```

---

## 🔒 Security Policy

1. `GEMINI_API_KEY` is restricted strictly to backend Lambda environment execution.
2. No API keys are prefixed with `VITE_` or exposed in client bundles.
3. Automated unit test `tests/pdfAndSecurity.test.ts` continuously verifies that zero secrets leak to the frontend.

---

## 🔮 Project Roadmap

- [x] **Phase 1: Modern React UI & Guest Access**: Modern SaaS design system, dark mode, open guest access, and instant sample loader.
- [x] **Phase 2: Client-Side PDF Parsing**: Secure client-side text extraction & thumbnail generation via `pdfjs-dist`.
- [x] **Phase 3: Real ATS Engine & Gemini Integration**: 5-dimension deterministic scoring + Gemini 3.6 Flash structured rewrites.
- [x] **Phase 4: AWS Serverless Backend & SAM Local Validation**: AWS Lambda microservice, API Gateway template, local Node runner, and Docker SAM Local E2E verification.
- [ ] **Phase 5: Cloud Persistence**: AWS DynamoDB integration for user scan history storage.
- [ ] **Phase 6: Tailored PDF Export**: Export tailored PDF resumes and comprehensive ATS report summaries.
