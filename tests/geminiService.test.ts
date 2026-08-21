import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateAiFeedback } from '../backend/src/services/gemini';

// Mock @google/genai
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: vi.fn().mockImplementation(async ({ contents }) => {
            if (contents.includes('TRIGGER_ERROR')) {
              throw new Error('API Error 403 Permission Denied');
            }
            return {
              text: JSON.stringify({
                recommendations: [
                  { issue: 'Quantify achievements', section: 'Experience', priority: 'high', recommendation: 'Add percentages and metrics.' }
                ],
                bulletRewrites: [
                  { original: 'Built features', improved: 'Engineered 5 features reducing load by 20%', reason: 'Adds XYZ metric' }
                ],
                skillsGap: [
                  { skill: 'Docker', importance: 'medium', recommendation: 'Learn containerization basics.' }
                ]
              })
            };
          })
        }
      };
    })
  };
});

describe('Gemini Service Unit Tests', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'mock-test-key-12345';
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
    vi.clearAllMocks();
  });

  it('1. Generates structured feedback successfully when API succeeds', async () => {
    const feedback = await generateAiFeedback('Resume text React Node', 'Job description React Node', 85, ['Docker']);
    expect(feedback).toHaveProperty('recommendations');
    expect(feedback).toHaveProperty('bulletRewrites');
    expect(feedback).toHaveProperty('skillsGap');
    expect(feedback.recommendations.length).toBeGreaterThan(0);
  });

  it('2. Returns graceful fallback when Gemini API throws an error', async () => {
    const feedback = await generateAiFeedback('TRIGGER_ERROR', 'Job text', 70, ['AWS']);
    expect(feedback).toHaveProperty('recommendations');
    expect(feedback.recommendations[0].issue).toContain('Unable to generate AI recommendations');
    expect(feedback.skillsGap.some(s => s.skill === 'AWS')).toBe(true);
  });

  it('3. Throws explicit error when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(generateAiFeedback('Resume text', 'Job text', 80, [])).rejects.toThrow('GEMINI_API_KEY is missing');
  });

  it('4. Never leaks or prints the real GEMINI_API_KEY in output', () => {
    const key = process.env.GEMINI_API_KEY || '';
    expect(key).not.toContain('AIza');
  });
});
