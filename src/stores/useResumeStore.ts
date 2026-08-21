import { create } from 'zustand';
import { mockAnalyses } from '../data/mockAnalyses';
import type { AnalysisResult } from '../data/mockAnalyses';

interface ResumeState {
  resumeFile: File | null;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  analysisResults: AnalysisResult | null;
  status: 'idle' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
  
  setResumeFile: (file: File | null) => void;
  setCompanyDetails: (company: string, title: string) => void;
  setJobDescription: (desc: string) => void;
  analyzeResume: () => Promise<void>;
  reset: () => void;
  setCurrentAnalysis: (id: string) => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumeFile: null,
  companyName: '',
  jobTitle: '',
  jobDescription: '',
  analysisResults: null,
  status: 'idle',
  errorMessage: null,

  setResumeFile: (file) => set({ resumeFile: file, status: 'idle', errorMessage: null }),
  
  setCompanyDetails: (company, title) => set({ companyName: company, jobTitle: title }),
  
  setJobDescription: (desc) => set({ jobDescription: desc }),

  analyzeResume: async () => {
    const { resumeFile, companyName, jobTitle, jobDescription } = get();
    
    if (!resumeFile || !companyName || !jobTitle || !jobDescription) {
      set({ status: 'error', errorMessage: 'Please fill in all required fields.' });
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
      resumeName: resumeFile.name,
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
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    analysisResults: null,
    status: 'idle',
    errorMessage: null
  })
}));
