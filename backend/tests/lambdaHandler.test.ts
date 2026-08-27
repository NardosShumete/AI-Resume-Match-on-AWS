import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handler } from '../src/handlers/analyze';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

// Mock gemini service inside engine
vi.mock('../src/services/gemini', () => ({
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

const createMockEvent = (body: any): APIGatewayProxyEventV2 => ({
  version: '2.0',
  routeKey: 'POST /analyze',
  rawPath: '/analyze',
  rawQueryString: '',
  headers: { 'content-type': 'application/json' },
  requestContext: {
    accountId: '123456789012',
    apiId: 'local-api',
    domainName: 'localhost',
    domainPrefix: 'localhost',
    http: { method: 'POST', path: '/analyze', protocol: 'HTTP/1.1', sourceIp: '127.0.0.1', userAgent: 'test' },
    requestId: 'req-test-123',
    routeKey: 'POST /analyze',
    stage: '$default',
    time: '21/Aug/2026:12:00:00 +0000',
    timeEpoch: 1787313600000
  },
  body: typeof body === 'string' ? body : JSON.stringify(body),
  isBase64Encoded: false
});

describe('AWS Lambda Handler Unit Tests (backend/src/handlers/analyze.ts)', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'mock-lambda-api-key';
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  it('1. Returns HTTP 200 with valid analysis payload', async () => {
    const event = createMockEvent({
      resumeText: 'Alex Morgan - Senior Full-Stack Engineer with React, Node.js and AWS experience.',
      jobDescription: 'Seeking Senior Full-Stack Engineer with React and AWS skills.',
      targetCompany: 'Stripe',
      targetJobTitle: 'Senior Full-Stack Engineer'
    });

    const res = await handler(event);
    expect(res.statusCode).toBe(200);

    const parsed = JSON.parse(res.body as string);
    expect(parsed.success).toBe(true);
    expect(parsed.analysis.companyName).toBe('Stripe');
    expect(parsed.analysis.atsScore).toBeGreaterThan(0);
  });

  it('2. Returns HTTP 400 when request body is missing', async () => {
    const event = createMockEvent(null);
    event.body = undefined as any;

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    const parsed = JSON.parse(res.body as string);
    expect(parsed.error.code).toBe('INVALID_REQUEST');
  });

  it('3. Returns HTTP 400 when request body is invalid JSON', async () => {
    const event = createMockEvent('{ malformed json string');

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    const parsed = JSON.parse(res.body as string);
    expect(parsed.error.code).toBe('INVALID_JSON');
  });

  it('4. Returns HTTP 400 when required fields (resumeText / jobDescription) are missing', async () => {
    const event = createMockEvent({
      resumeText: '',
      jobDescription: 'Some JD text'
    });

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    const parsed = JSON.parse(res.body as string);
    expect(parsed.error.code).toBe('MISSING_FIELDS');
  });

  it('5. Returns HTTP 400 when payload exceeds max length limit (50,000 chars)', async () => {
    const hugeText = 'A'.repeat(50001);
    const event = createMockEvent({
      resumeText: hugeText,
      jobDescription: 'Job text'
    });

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    const parsed = JSON.parse(res.body as string);
    expect(parsed.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('6. Does not expose stack traces or secrets on internal error', async () => {
    const event = createMockEvent({
      resumeText: 'Alex Morgan',
      jobDescription: 'Job text'
    });

    // Cause error inside engine
    const engineModule = await import('../src/analysis/engine');
    vi.spyOn(engineModule, 'analyzeResume').mockRejectedValueOnce(new Error('Internal secret database error'));

    const res = await handler(event);
    expect(res.statusCode).toBe(500);
    const parsed = JSON.parse(res.body as string);
    expect(parsed.error.message).not.toContain('secret');
    expect(parsed.error.message).toBe('Resume analysis is temporarily unavailable.');
  });
});
