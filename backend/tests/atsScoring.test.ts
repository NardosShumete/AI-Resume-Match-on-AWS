import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeResume } from '../src/analysis/engine';
import * as geminiService from '../src/services/gemini';
import { calculateAtsScore } from '../src/analysis/scoring/calculateAtsScore';
import { GoogleGenAI } from '@google/genai';

export const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  const GoogleGenAI = function(this: any) {
    this.models = { generateContent: mockGenerateContent };
  };
  return { GoogleGenAI };
});

describe('Advanced ATS Scoring & Recommendation Engine', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  describe('Engine & Scoring Integration', () => {
    // Helper to mock the gemini service directly for engine tests
    const mockGemini = (semanticRes: Partial<geminiService.AtsSemanticResponse>) => {
      vi.spyOn(geminiService, 'analyzeAtsSemantics').mockResolvedValue({
        roleDomain: { candidate: 'IT', target: 'IT' },
        roleCompatibilityScore: 90,
        experienceRelevanceScore: 80,
        requiredQualifications: { matched: ['Req1'], missing: [] },
        preferredQualifications: { matched: [], missing: [] },
        isRegulatedRole: false,
        missingCriticalCredential: false,
        skills: { matched: ['Skill1'], missing: [] },
        ...semanticRes
      });

      vi.spyOn(geminiService, 'generateAiFeedback').mockResolvedValue({
        recommendations: [],
        bulletRewrites: [],
        skillsGap: []
      });
    };

    it('TEST 1: IT resume -> Software Engineer (high compatibility)', async () => {
      mockGemini({
        roleDomain: { candidate: 'Information Technology', target: 'Software Engineering' },
        roleCompatibilityScore: 95,
      });

      const res = await analyzeResume('IT Student Resume', 'Software Engineer JD', 'resume.pdf', 'Tech Corp', 'Software Engineer');
      expect(res.scoreBreakdown.roleCompatibility).toBe(95);
      expect(res.atsScore).toBeGreaterThan(70);
      expect(res.criticalMismatch).toBe(false);
    });

    it('TEST 2: IT resume -> Cybersecurity job (high compatibility)', async () => {
      mockGemini({
        roleDomain: { candidate: 'Information Technology', target: 'Cybersecurity' },
        roleCompatibilityScore: 90,
      });

      const res = await analyzeResume('IT Student Resume', 'Cybersecurity JD', 'resume.pdf', 'Tech Corp', 'Cybersecurity Analyst');
      expect(res.scoreBreakdown.roleCompatibility).toBe(90);
      expect(res.atsScore).toBeGreaterThan(70);
    });

    it('TEST 3: IT resume -> Doctor of Medicine (very low compatibility, hard mismatch limit)', async () => {
      mockGemini({
        roleDomain: { candidate: 'Information Technology', target: 'Medicine / Healthcare' },
        roleCompatibilityScore: 10,
        isRegulatedRole: true,
        missingCriticalCredential: true,
        requiredQualifications: { matched: [], missing: ['Medical Degree', 'Medical License'] }
      });

      const res = await analyzeResume('IT Student Resume', 'Doctor of Medicine JD', 'resume.pdf', 'Hospital', 'Doctor');
      
      // The score must be capped to 20 due to missing critical credential for regulated role
      expect(res.criticalMismatch).toBe(true);
      expect(res.atsScore).toBeLessThanOrEqual(20);
    });

    it('TEST 4: Nurse resume -> Pediatric Nurse (high compatibility)', async () => {
      mockGemini({
        roleDomain: { candidate: 'Nursing', target: 'Pediatric Nursing' },
        roleCompatibilityScore: 100,
        isRegulatedRole: true,
        missingCriticalCredential: false, // They have the nursing license
      });

      const res = await analyzeResume('Nurse Resume', 'Pediatric Nurse JD', 'resume.pdf', 'Hospital', 'Nurse');
      expect(res.criticalMismatch).toBe(false);
      expect(res.atsScore).toBeGreaterThan(75);
    });

    it('TEST 5: Doctor resume -> Doctor job requiring hospital experience (high compatibility)', async () => {
      mockGemini({
        roleDomain: { candidate: 'Medicine', target: 'Medicine' },
        roleCompatibilityScore: 95,
        requiredQualifications: { matched: ['Medical Degree', 'Hospital Experience'], missing: [] },
        isRegulatedRole: true,
        missingCriticalCredential: false
      });

      const res = await analyzeResume('Doctor Resume', 'Doctor JD', 'resume.pdf', 'Hospital', 'Doctor');
      expect(res.scoreBreakdown.requiredQualifications).toBe(100);
      expect(res.atsScore).toBeGreaterThan(80);
    });

    it('TEST 6: Doctor resume without pediatric experience -> Pediatric Doctor (partial match with critical missing)', async () => {
      mockGemini({
        roleDomain: { candidate: 'Medicine', target: 'Pediatric Medicine' },
        roleCompatibilityScore: 80, // General domain matches
        requiredQualifications: { matched: ['Medical Degree'], missing: ['Pediatric Experience'] }, // Missing required
        isRegulatedRole: true,
        missingCriticalCredential: false // Has the degree, just missing experience
      });

      const res = await analyzeResume('Doctor Resume', 'Pediatric Doctor JD', 'resume.pdf', 'Hospital', 'Doctor');
      
      // 1 missing out of 2 = 50% required qualifications
      expect(res.scoreBreakdown.requiredQualifications).toBe(50);
      // Because requiredQualifications is low, ATS score is pulled down
      expect(res.atsScore).toBeLessThan(75);
      expect(res.criticalMismatch).toBe(false); // Not a complete mismatch, just lacking a requirement
    });
  });

  describe('Prompt Hallucination Constraints', () => {
    it('TEST 7: AI prompt explicitly forbids inventing numerical achievements', async () => {
      vi.restoreAllMocks(); // Un-mock analyzeAtsSemantics and generateAiFeedback
      
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify({ recommendations: [], bulletRewrites: [], skillsGap: [] })
      });

      await geminiService.generateAiFeedback('Some Resume', 'Some JD', 80, []);
      
      const promptCall = mockGenerateContent.mock.calls[0][0].contents;
      expect(promptCall).toContain('Do NOT hallucinate numbers, percentages');
      expect(promptCall).toContain('NEVER INVENT INFORMATION');
      expect(promptCall).toContain('[X%]');
    });

    it('TEST 8: AI rewrite for "CCTV installation" must not invent facts', async () => {
      vi.restoreAllMocks();
      
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify({ 
          recommendations: [], 
          bulletRewrites: [{
            original: "CCTV installation",
            improved: "Installed [N devices] CCTV systems across [N sites]",
            reason: "Added placeholders for impact"
          }], 
          skillsGap: [] 
        })
      });

      const res = await geminiService.generateAiFeedback('CCTV installation', 'Security Tech', 50, []);
      
      expect(res.bulletRewrites[0].improved).toContain('[N devices]');
      expect(res.bulletRewrites[0].improved).not.toMatch(/\d+/);
    });
  });
});
