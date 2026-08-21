import type { AnalysisResult } from '../types/analysis';

export interface AnalyzeResumePayload {
  resumeText: string;
  jobDescription: string;
  targetJobTitle?: string;
  targetCompany?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  analysis?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function analyzeResume(payload: AnalyzeResumePayload): Promise<AnalysisResult> {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    throw new Error('VITE_API_URL environment variable is missing.');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred during analysis.';
    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // Fallback to generic message if parsing fails
    }
    throw new Error(errorMessage);
  }

  const data: ApiResponse<AnalysisResult> = await response.json();
  
  if (!data.success || !data.analysis) {
    throw new Error(data.error?.message || 'Invalid response from server.');
  }

  return data.analysis;
}
