import { create } from 'zustand';
import { mockAnalyses } from '../data/mockAnalyses';
import type { AnalysisResult } from '../data/mockAnalyses';
import type { PdfMetadata, PdfParserState } from '../types/pdf';

interface ResumeState {
  resumeFile: File | null;
  resumeMetadata: PdfMetadata | null;
  pdfState: PdfParserState;
  pdfError: string | null;

  companyName: string;
  jobTitle: string;
  jobDescription: string;
  analysisResults: AnalysisResult | null;
  status: 'idle' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
  
  setResumeFile: (file: File | null) => void;
  setResumeMetadata: (metadata: PdfMetadata | null) => void;
  setPdfState: (state: PdfParserState) => void;
  setPdfError: (error: string | null) => void;

  setCompanyDetails: (company: string, title: string) => void;
  setJobDescription: (desc: string) => void;
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
  status: 'idle',
  errorMessage: null,

  setResumeFile: (file) => set({ resumeFile: file, errorMessage: null }),
  setResumeMetadata: (metadata) => set({ resumeMetadata: metadata }),
  setPdfState: (state) => set({ pdfState: state }),
  setPdfError: (error) => set({ pdfError: error }),
  
  setCompanyDetails: (company, title) => set({ companyName: company, jobTitle: title }),
  
  setJobDescription: (desc) => set({ jobDescription: desc }),

  analyzeResume: async () => {
    const { pdfState, companyName, jobTitle, jobDescription, resumeMetadata } = get();
    
    if (pdfState !== 'success' || !resumeMetadata || !companyName || !jobTitle || !jobDescription) {
      set({ status: 'error', errorMessage: 'Please ensure your resume is successfully parsed and all required fields are filled.' });
      return;
    }

    set({ status: 'processing', errorMessage: null });
    
    // Simulate network analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Pick the first mock as a dynamic response for new analyses
    const result = {
      ...mockAnalyses[0],
      id: Date.now().toString(),
      companyName,
      jobTitle,
      resumeName: resumeMetadata.fileName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    set({
      status: 'completed',
      analysisResults: result
    });
  },

  setCurrentAnalysis: (id: string) => {
    const found = mockAnalyses.find(a => a.id === id);
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

