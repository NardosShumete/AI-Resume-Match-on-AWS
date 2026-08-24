import { create } from 'zustand';
import { mockAnalyses } from '../data/mockAnalyses';
import type { AnalysisResult } from '../types/analysis';
import type { PdfMetadata, PdfParserState } from '../types/pdf';

const GUEST_HISTORY_KEY = 'resumatch_guest_history';

const SAMPLE_RESUME_TEXT = `Alex Morgan
Senior Full-Stack Engineer
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA | github.com/alexmorgan | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 5+ years of experience architecting and delivering scalable cloud web applications using React, TypeScript, Node.js, and AWS. Proven track record of improving application latency by 35% and boosting engineering velocity through CI/CD automation and test-driven development.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
- Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, Webpack, Responsive Design
- Backend & APIs: Node.js, Express, REST APIs, GraphQL, Microservices Architecture
- Cloud & DevOps: AWS (Lambda, S3, ECS, CloudWatch), Docker, GitHub Actions, CI/CD
- Databases: PostgreSQL, MongoDB, Redis, Prisma ORM
- Testing & Quality: Jest, React Testing Library, Cypress, TDD, Agile/Scrum

PROFESSIONAL EXPERIENCE
Senior Full-Stack Developer | CloudScale Solutions | Jan 2022 – Present
- Architected and deployed scalable customer-facing dashboard in React & TypeScript serving 150k+ daily active users, reducing initial page load time by 40% via code splitting and memoization.
- Engineered 12+ secure microservices and RESTful API endpoints using Node.js and PostgreSQL, achieving 99.98% service uptime and sub-100ms response times.
- Spearheaded migration of legacy deployment pipelines to Docker and GitHub Actions CI/CD on AWS ECS, reducing deployment cycle times from 45 minutes to 8 minutes.
- Implemented comprehensive end-to-end testing suites with Jest and Cypress, elevating overall test coverage from 62% to 88%.

Software Engineer | Apex Digital Labs | Jun 2019 – Dec 2021
- Developed interactive web components and responsive single-page applications using React, Redux, and REST APIs for enterprise fintech clients.
- Optimized database indexing and query structures in PostgreSQL, decreasing average database query latency by 30%.
- Integrated third-party payment gateways and webhook ingestion pipelines handling over $2M in monthly transaction volume.
- Collaborated in cross-functional agile sprints with UX designers and product managers to deliver 6 major feature releases ahead of schedule.

EDUCATION & CERTIFICATIONS
- Bachelor of Science in Computer Science | University of California, Berkeley (2019)
- AWS Certified Solutions Architect – Associate (2023)
- Meta Front-End Developer Professional Certificate (2021)`;

const SAMPLE_JOB_DESCRIPTION = `We are seeking an experienced Senior Full-Stack Engineer to join our core engineering team.

Key Responsibilities:
- Design, develop, and maintain high-performance web applications using React, TypeScript, and Node.js.
- Architect and build robust, scalable RESTful APIs and microservices deployed on AWS (Lambda, ECS, S3).
- Work closely with relational (PostgreSQL) and NoSQL (MongoDB) databases to ensure data consistency and query performance.
- Implement automated unit, integration, and end-to-end testing suites using Jest to maintain high software quality.
- Drive continuous integration and deployment (CI/CD) pipelines using GitHub Actions and Docker containers.
- Collaborate across cross-functional teams with product managers, designers, and fellow engineers to ship customer-centric features.

Requirements:
- 4+ years of professional software engineering experience with modern JavaScript / TypeScript.
- Strong proficiency in React, Node.js, and modern state management patterns.
- Hands-on experience designing REST APIs and cloud services on AWS.
- Proven track record working with PostgreSQL or similar SQL databases.
- Experience with Git, CI/CD automation, and containerization using Docker.
- Passion for clean code, automated testing, and agile engineering best practices.`;

const loadStoredHistory = (): AnalysisResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse guest history from localStorage:', err);
  }
  return [];
};

const persistHistory = (history: AnalysisResult[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('Failed to persist guest history to localStorage:', err);
  }
};

interface ResumeState {
  resumeFile: File | null;
  resumeMetadata: PdfMetadata | null;
  pdfState: PdfParserState;
  pdfError: string | null;

  companyName: string;
  jobTitle: string;
  jobDescription: string;
  analysisResults: AnalysisResult | null;
  history: AnalysisResult[];
  status: 'idle' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
  
  setResumeFile: (file: File | null) => void;
  setResumeMetadata: (metadata: PdfMetadata | null) => void;
  setPdfState: (state: PdfParserState) => void;
  setPdfError: (error: string | null) => void;

  setCompanyDetails: (company: string, title: string) => void;
  setJobDescription: (desc: string) => void;
  loadExampleData: () => void;
  loadSampleData: () => void;
  loadSampleHistory: () => void;
  clearHistory: () => void;
  analyzeResume: () => Promise<void>;
  reset: () => void;
  setCurrentAnalysis: (id: string) => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumeFile: null,
  resumeMetadata: null,
  pdfState: 'idle',
  pdfError: null,

  companyName: '',
  jobTitle: '',
  jobDescription: '',
  analysisResults: null,
  history: loadStoredHistory(),
  status: 'idle',
  errorMessage: null,

  setResumeFile: (file) => set({ resumeFile: file, errorMessage: null }),
  setResumeMetadata: (metadata) => set({ resumeMetadata: metadata }),
  setPdfState: (state) => set({ pdfState: state }),
  setPdfError: (error) => set({ pdfError: error }),
  
  setCompanyDetails: (company, title) => set({ companyName: company, jobTitle: title }),
  
  setJobDescription: (desc) => set({ jobDescription: desc }),

  loadExampleData: () => {
    const sampleMeta: PdfMetadata = {
      fileName: 'example-fullstack-resume.pdf',
      fileSize: 124500,
      pageCount: 1,
      wordCount: 448,
      characterCount: 3120,
      extractedText: SAMPLE_RESUME_TEXT,
      previewUrl: '',
    };

    set({
      resumeFile: null,
      resumeMetadata: sampleMeta,
      pdfState: 'success',
      pdfError: null,
      companyName: 'Stripe',
      jobTitle: 'Senior Full-Stack Engineer',
      jobDescription: SAMPLE_JOB_DESCRIPTION,
      errorMessage: null,
    });
  },
  loadSampleData: () => {
    get().loadExampleData();
  },

  loadSampleHistory: () => {
    persistHistory(mockAnalyses);
    set({ history: mockAnalyses });
  },

  clearHistory: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_HISTORY_KEY);
    }
    set({ history: [] });
  },

  analyzeResume: async () => {
    const { pdfState, companyName, jobTitle, jobDescription, resumeMetadata, history } = get();
    
    if (pdfState !== 'success' || !resumeMetadata || !companyName || !jobTitle || !jobDescription) {
      set({ status: 'error', errorMessage: 'Please ensure your resume is successfully parsed and all required fields are filled.' });
      return;
    }

    set({ status: 'processing', errorMessage: null });
    
    try {
      const { analyzeResume: runAnalysis } = await import('../services/api');
      
      const result = await runAnalysis({
        resumeText: resumeMetadata.extractedText,
        jobDescription,
        targetCompany: companyName,
        targetJobTitle: jobTitle
      });

      // Update history in state and persist to localStorage
      const updatedHistory = [result, ...history.filter(item => item.id !== result.id)];
      persistHistory(updatedHistory);

      set({
        status: 'completed',
        analysisResults: result,
        history: updatedHistory
      });
    } catch (error: any) {
      console.error('Analysis failed:', error);
      set({ status: 'error', errorMessage: error.message || 'Analysis failed to complete. Please try again.' });
    }
  },

  setCurrentAnalysis: (id: string) => {
    const { history } = get();
    const found = history.find(a => a.id === id) || mockAnalyses.find(a => a.id === id);
    if (found) {
      set({ analysisResults: found, status: 'completed' });
    }
  },

  reset: () => set({
    resumeFile: null,
    resumeMetadata: null,
    pdfState: 'idle',
    pdfError: null,
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    analysisResults: null,
    status: 'idle',
    errorMessage: null
  })
}));


