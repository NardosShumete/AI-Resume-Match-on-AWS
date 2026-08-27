import { describe, it, expect, vi } from 'vitest';
import { normalizePdfText } from '../src/utils/pdf/normalizePdfText';
import { analyzeResume as callApi } from '../src/services/api';
import { handler as lambdaHandler } from '../backend/src/handlers/analyze';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

// Mock gemini service inside engine for backend test
vi.mock('../backend/src/services/gemini', () => ({
  generateAiFeedback: vi.fn().mockResolvedValue({
    recommendations: [{ issue: 'Add metrics', section: 'Experience', priority: 'high', recommendation: 'Quantify impact' }],
    bulletRewrites: [],
    skillsGap: []
  }),
  analyzeAtsSemantics: vi.fn().mockResolvedValue({
    roleDomain: { candidate: 'IT', target: 'IT' },
    roleCompatibilityScore: 85,
    experienceRelevanceScore: 80,
    requiredQualifications: { matched: ['Degree'], missing: [] },
    preferredQualifications: { matched: [], missing: [] },
    isRegulatedRole: false,
    missingCriticalCredential: false,
    skills: { matched: ['React'], missing: [] }
  })
}));

describe('Real Resume Bug Fix & Regression Unit Tests', () => {
  it('1. normalizePdfText strips control characters, NULL bytes, and replacement glyphs', () => {
    const dirtyText = "John Doe\u0000\u0007\u001B\uFFFD Senior Developer at Acme Corp";
    const cleaned = normalizePdfText(dirtyText);
    expect(cleaned).not.toContain('\u0000');
    expect(cleaned).not.toContain('\u0007');
    expect(cleaned).not.toContain('\u001B');
    expect(cleaned).not.toContain('\uFFFD');
    expect(cleaned).toContain('John Doe Senior Developer at Acme Corp');
  });

  it('2. normalizePdfText clamps text longer than max length safely', () => {
    const longText = 'A'.repeat(30000);
    const clamped = normalizePdfText(longText, 25000);
    expect(clamped.length).toBe(25000);
  });

  it('3. Frontend API service throws friendly message on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(callApi({
      resumeText: 'Test Resume',
      jobDescription: 'Test Job Description'
    })).rejects.toThrow('Failed to fetch');

    vi.unstubAllGlobals();
  });

  it('4. Frontend API service handles HTTP 413 payload too large error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 413,
      json: async () => ({})
    }));

    await expect(callApi({
      resumeText: 'Test Resume',
      jobDescription: 'Test Job Description'
    })).rejects.toThrow('The submitted resume or job description is too large.');

    vi.unstubAllGlobals();
  });

  it('5. Backend Lambda handler sanitizes control characters without failing', async () => {
    const event: Partial<APIGatewayProxyEventV2> = {
      requestContext: { requestId: 'req-test-real' } as any,
      body: JSON.stringify({
        resumeText: "John Doe\u0000\u0007 Software Developer " + "A".repeat(500),
        jobDescription: "Software Developer job posting " + "B".repeat(500),
        targetJobTitle: "Software Developer",
        targetCompany: "Test Co"
      })
    };

    const res = await lambdaHandler(event as APIGatewayProxyEventV2);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body!);
    expect(body.success).toBe(true);
    expect(body.analysis.atsScore).toBeGreaterThanOrEqual(0);
  });
});
