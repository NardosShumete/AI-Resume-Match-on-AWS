import type { AnalysisResult } from '../types/analysis';

export interface AnalyzeResumePayload {
  resumeText: string;
  jobDescription: string;
  targetJobTitle?: string;
  targetCompany?: string;
  language?: 'en' | 'am';
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

  // Pre-flight payload sanitization & clamping
  const rawResume = payload.resumeText || '';
  const rawJd = payload.jobDescription || '';

  const sanitizedResume = rawResume
    .replace(/[\x00-\x08\x0B-\x1F\x7F\uFFFD]/g, '')
    .trim();

  const sanitizedJd = rawJd
    .replace(/[\x00-\x08\x0B-\x1F\x7F\uFFFD]/g, '')
    .trim();

  const sanitizedPayload: AnalyzeResumePayload = {
    ...payload,
    resumeText: sanitizedResume.length > 25000 ? sanitizedResume.substring(0, 25000) : sanitizedResume,
    jobDescription: sanitizedJd.length > 25000 ? sanitizedJd.substring(0, 25000) : sanitizedJd,
  };

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sanitizedPayload)
    });
  } catch (netErr) {
    console.error('Network failure connecting to analysis API:', netErr);
    throw new Error(netErr instanceof Error ? netErr.message : 'Unable to connect to the analysis service.');
  }

  if (!response.ok) {
    let errorMessage = '';
    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Non-JSON error response from proxy or gateway
    }

    if (!errorMessage) {
      if (response.status === 413) {
        errorMessage = 'The submitted resume or job description is too large.';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request parameters. Please verify your inputs.';
      } else if (response.status >= 500) {
        errorMessage = 'Resume analysis is temporarily unavailable. Please try again in a moment.';
      } else {
        errorMessage = `Analysis request failed (HTTP ${response.status}).`;
      }
    }

    throw new Error(errorMessage);
  }

  const data: ApiResponse<AnalysisResult> = await response.json();
  
  if (!data.success || !data.analysis) {
    throw new Error(data.error?.message || 'Invalid response received from the server.');
  }

  return data.analysis;
}
