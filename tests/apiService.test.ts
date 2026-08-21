import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeResume } from '../src/services/api';

describe('API Service Contract Tests (src/services/api.ts)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'http://127.0.0.1:3001/analyze');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('1. Successfully fetches analysis on HTTP 200 response', async () => {
    const mockAnalysis = {
      id: 'test-id-1',
      jobTitle: 'Frontend Engineer',
      companyName: 'TechCorp',
      date: 'Oct 2026',
      atsScore: 88,
      status: 'Strong',
      scoreBreakdown: { keywordMatch: 90, skillsMatch: 85, experienceRelevance: 85, formatting: 90, impact: 90 },
      matchedKeywords: [{ keyword: 'React', importance: 'high' }],
      missingKeywords: [],
      matchedSkills: [],
      missingSkills: [],
      recommendations: [],
      bulletRewrites: [],
      skillsGap: [],
      formattingTips: [],
      summary: 'Good match'
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, analysis: mockAnalysis })
    });

    const result = await analyzeResume({
      resumeText: 'React TypeScript Node.js experience',
      jobDescription: 'Looking for React engineer',
      targetCompany: 'TechCorp',
      targetJobTitle: 'Frontend Engineer'
    });

    expect(result.atsScore).toBe(88);
    expect(result.companyName).toBe('TechCorp');
  });

  it('2. Handles HTTP 400 Bad Request error gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ success: false, error: { message: 'Resume text and job description are required.' } })
    });

    await expect(analyzeResume({
      resumeText: '',
      jobDescription: ''
    })).rejects.toThrow('Resume text and job description are required.');
  });

  it('3. Handles HTTP 500 Internal Server Error gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ success: false, error: { message: 'Resume analysis is temporarily unavailable.' } })
    });

    await expect(analyzeResume({
      resumeText: 'Text',
      jobDescription: 'Job'
    })).rejects.toThrow('Resume analysis is temporarily unavailable.');
  });

  it('4. Handles network failure (Failed to fetch) gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(analyzeResume({
      resumeText: 'Text',
      jobDescription: 'Job'
    })).rejects.toThrow('Failed to fetch');
  });

  it('5. Throws error when VITE_API_URL is missing', async () => {
    vi.stubEnv('VITE_API_URL', '');

    await expect(analyzeResume({
      resumeText: 'Text',
      jobDescription: 'Job'
    })).rejects.toThrow('VITE_API_URL environment variable is missing.');
  });
});
