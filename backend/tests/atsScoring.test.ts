import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeResume } from '../src/analysis/engine';
import * as geminiService from '../src/services/gemini';
import { calculateDeterministicAtsScore } from '../src/analysis/scoring/calculateAtsScore';
import { GoogleGenAI } from '@google/genai';

export const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  const GoogleGenAI = function(this: any) {
    this.models = { generateContent: mockGenerateContent };
  };
  return { GoogleGenAI };
});

describe('Pure Deterministic ATS Scoring Function Unit Tests (No LLM / No Network)', () => {
  it('Calculates exact weighted score for strong matching profile', () => {
    const res = calculateDeterministicAtsScore({
      roleCompatibility: 95,
      requiredQualifications: 90,
      skillsMatch: 85,
      experienceRelevance: 90,
      keywordMatch: 80,
      resumeQuality: 90
    });

    // 95*0.25 + 90*0.25 + 85*0.15 + 90*0.15 + 80*0.10 + 90*0.10
    // = 23.75 + 22.5 + 12.75 + 13.5 + 8.0 + 9.0 = 89.5 => 90
    expect(res.atsScore).toBe(90);
    expect(res.criticalMismatch).toBe(false);
    expect(res.scoreBreakdown.roleCompatibility).toBe(95);
  });

  it('Enforces hard gate (<= 18) when regulated role misses critical credential', () => {
    const res = calculateDeterministicAtsScore({
      roleCompatibility: 10,
      requiredQualifications: 10,
      skillsMatch: 15,
      experienceRelevance: 10,
      keywordMatch: 10,
      resumeQuality: 95, // High resume quality must NOT bypass gate!
      isRegulatedRole: true,
      missingCriticalCredential: true
    });

    expect(res.atsScore).toBeLessThanOrEqual(18);
    expect(res.criticalMismatch).toBe(true);
  });

  it('Enforces hard gate (<= 20) when role compatibility is < 30', () => {
    const res = calculateDeterministicAtsScore({
      roleCompatibility: 25,
      requiredQualifications: 30,
      skillsMatch: 20,
      experienceRelevance: 20,
      keywordMatch: 20,
      resumeQuality: 90,
      isRegulatedRole: false,
      missingCriticalCredential: false
    });

    expect(res.atsScore).toBeLessThanOrEqual(20);
    expect(res.criticalMismatch).toBe(true);
  });

  it('Correctly isolates Resume Quality so it cannot lift mismatched candidates', () => {
    const resMismatched = calculateDeterministicAtsScore({
      roleCompatibility: 5,
      requiredQualifications: 0,
      skillsMatch: 0,
      experienceRelevance: 5,
      keywordMatch: 0,
      resumeQuality: 100 // Perfect 100% formatting & impact
    });

    expect(resMismatched.atsScore).toBeLessThanOrEqual(20);
    expect(resMismatched.criticalMismatch).toBe(true);
  });
});

describe('ATS Scoring Engine & Data Integrity Test Matrix (10 Scenarios)', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  // Helper to mock the gemini service directly for engine tests
  const mockGemini = (semanticRes: Partial<geminiService.AtsSemanticResponse>) => {
    vi.spyOn(geminiService, 'analyzeAtsSemantics').mockResolvedValue({
      roleDomain: { candidate: 'Software Engineering', target: 'Software Engineering' },
      roleCompatibilityScore: 90,
      experienceRelevanceScore: 85,
      requirements: [
        { requirement: 'Bachelor in Computer Science', source: 'explicit', status: 'matched', explanation: 'Verified in resume' },
        { requirement: '4+ years full-stack experience', source: 'explicit', status: 'matched', explanation: 'Verified in resume' }
      ],
      requiredQualifications: { matched: ['Bachelor in Computer Science', '4+ years full-stack experience'], missing: [] },
      preferredQualifications: { matched: [], missing: [] },
      isRegulatedRole: false,
      missingCriticalCredential: false,
      skills: { matched: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL'], missing: [] },
      ...semanticRes
    });

    vi.spyOn(geminiService, 'generateAiFeedback').mockResolvedValue({
      recommendations: [],
      bulletRewrites: [],
      skillsGap: []
    });
  };

  it('TEST 1: Software Engineer resume -> Software Engineer job (High score >= 75)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Software Engineering', target: 'Software Engineering' },
      roleCompatibilityScore: 95,
      experienceRelevanceScore: 90,
      requiredQualifications: { matched: ['Bachelor in CS', '4+ years experience'], missing: [] },
      skills: { matched: ['React', 'TypeScript', 'Node.js', 'AWS'], missing: [] }
    });

    const res = await analyzeResume(
      'Senior Full-Stack Software Engineer with 5+ years experience in React, TypeScript, Node.js, AWS, PostgreSQL.',
      'Looking for Senior Software Engineer with React, Node.js, and AWS experience.',
      'alex-morgan.pdf',
      'Stripe',
      'Senior Full-Stack Engineer'
    );

    expect(res.scoreBreakdown.roleCompatibility).toBe(95);
    expect(res.atsScore).toBeGreaterThanOrEqual(75);
    expect(res.criticalMismatch).toBe(false);
  });

  it('TEST 2: Software Engineer resume -> Cybersecurity job (Moderate/high score depending on requirements)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Software Engineering / IT', target: 'Cybersecurity' },
      roleCompatibilityScore: 70,
      experienceRelevanceScore: 65,
      requiredQualifications: { matched: ['Technical Degree'], missing: ['CISSP Certification'] },
      skills: { matched: ['Python', 'SQL', 'Networking'], missing: ['Firewall Management', 'SIEM'] }
    });

    const res = await analyzeResume(
      'Software engineer with experience in Python, SQL, and backend cloud infrastructure.',
      'Cybersecurity analyst position requiring threat detection, networking knowledge, and security certs.',
      'resume.pdf',
      'CyberSec Corp',
      'Cybersecurity Analyst'
    );

    expect(res.scoreBreakdown.roleCompatibility).toBe(70);
    expect(res.atsScore).toBeGreaterThanOrEqual(45);
    expect(res.atsScore).toBeLessThanOrEqual(85);
  });

  it('TEST 3: Software Engineer resume -> Pediatric Nurse (Very low score <= 20, domain mismatch)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Software Engineering / Computer Science', target: 'Healthcare / Nursing / Pediatrics' },
      roleCompatibilityScore: 5,
      experienceRelevanceScore: 0,
      isRegulatedRole: true,
      missingCriticalCredential: true,
      requiredQualifications: {
        matched: [],
        missing: ['1 year hospital experience', 'GPA above 3.5 (Not provided in resume)', 'Nursing license / degree']
      },
      skills: {
        matched: [],
        missing: ['Pediatric care', 'Patient monitoring', 'Hospital clinical practice']
      }
    });

    const res = await analyzeResume(
      'Alex Morgan Senior Full-Stack Engineer React TypeScript Node.js AWS Berkeley CS',
      'who have been experience for 1 year in hospital and have GPA above 3.5.',
      'alex-morgan.pdf',
      'AB Hospital',
      'Pediatric Nurse'
    );

    expect(res.criticalMismatch).toBe(true);
    expect(res.scoreBreakdown.roleCompatibility).toBeLessThanOrEqual(10);
    expect(res.scoreBreakdown.requiredQualifications).toBeLessThanOrEqual(10);
    expect(res.scoreBreakdown.skillsMatch).toBeLessThanOrEqual(15);
    expect(res.scoreBreakdown.experienceRelevance).toBeLessThanOrEqual(15);
    expect(res.atsScore).toBeLessThanOrEqual(20);
  });

  it('TEST 4: Nurse resume -> Pediatric Nurse (High score if requirements are satisfied)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Nursing / Healthcare', target: 'Healthcare / Pediatric Nursing' },
      roleCompatibilityScore: 95,
      experienceRelevanceScore: 90,
      isRegulatedRole: true,
      missingCriticalCredential: false,
      requiredQualifications: { matched: ['BSN Degree & RN License', '2 years hospital clinical experience', 'GPA 3.8'], missing: [] },
      skills: { matched: ['Pediatric Care', 'Patient Assessment', 'Medication Administration'], missing: [] }
    });

    const res = await analyzeResume(
      'Registered Nurse (RN, BSN) with 2 years hospital experience in pediatric ward. GPA: 3.8.',
      'Pediatric Nurse with 1 year hospital experience and GPA above 3.5.',
      'nurse-resume.pdf',
      'AB Hospital',
      'Pediatric Nurse'
    );

    expect(res.criticalMismatch).toBe(false);
    expect(res.scoreBreakdown.requiredQualifications).toBe(100);
    expect(res.atsScore).toBeGreaterThanOrEqual(75);
  });

  it('TEST 5: Nurse resume without hospital experience -> Pediatric Nurse requiring 1 year hospital experience (Reduced score + missing requirement)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Nursing / Healthcare', target: 'Healthcare / Pediatric Nursing' },
      roleCompatibilityScore: 80,
      experienceRelevanceScore: 40,
      isRegulatedRole: true,
      missingCriticalCredential: false,
      requiredQualifications: { matched: ['BSN Degree & RN License', 'GPA 3.6'], missing: ['1 year hospital experience'] },
      skills: { matched: ['Patient Assessment'], missing: ['Inpatient hospital care'] }
    });

    const res = await analyzeResume(
      'Registered Nurse with clinic and telehealth experience. GPA 3.6. No hospital experience.',
      'Pediatric Nurse requiring 1 year in hospital and GPA above 3.5.',
      'nurse-clinic.pdf',
      'AB Hospital',
      'Pediatric Nurse'
    );

    expect(res.requiredQualifications.missing).toContain('1 year hospital experience');
    expect(res.scoreBreakdown.requiredQualifications).toBeLessThan(75);
    expect(res.atsScore).toBeLessThan(75);
  });

  it('TEST 6: Resume without GPA -> Job requiring GPA > 3.5 (GPA = NOT VERIFIED / MISSING)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Nursing', target: 'Nursing' },
      roleCompatibilityScore: 85,
      requiredQualifications: {
        matched: ['1 year hospital experience'],
        missing: ['Required GPA > 3.5 (Not provided in resume)']
      }
    });

    const res = await analyzeResume(
      'Nurse with 2 years hospital experience. Education: BSN from State University.',
      'Hospital nurse position requiring 1 year hospital experience and GPA above 3.5.',
      'resume.pdf',
      'Hospital',
      'Nurse'
    );

    expect(res.requiredQualifications.missing.some(q => q.includes('GPA'))).toBe(true);
    expect(res.scoreBreakdown.requiredQualifications).toBeLessThan(100);
  });

  it('TEST 7: Resume with GPA 3.8 -> Job requiring GPA > 3.5 (GPA requirement matched)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Nursing', target: 'Nursing' },
      roleCompatibilityScore: 95,
      requiredQualifications: {
        matched: ['1 year hospital experience', 'GPA 3.8 (exceeds required 3.5)'],
        missing: []
      }
    });

    const res = await analyzeResume(
      'Nurse with hospital experience. Education: BSN, GPA: 3.8.',
      'Job requiring 1 year hospital experience and GPA above 3.5.',
      'resume.pdf',
      'Hospital',
      'Nurse'
    );

    expect(res.requiredQualifications.matched.some(q => q.includes('GPA'))).toBe(true);
    expect(res.scoreBreakdown.requiredQualifications).toBe(100);
  });

  it('TEST 8: Resume with GPA 3.2 -> Job requiring GPA > 3.5 (GPA requirement failed / missing)', async () => {
    mockGemini({
      roleDomain: { candidate: 'Nursing', target: 'Nursing' },
      roleCompatibilityScore: 80,
      requiredQualifications: {
        matched: ['1 year hospital experience'],
        missing: ['Required GPA > 3.5 (Candidate GPA 3.2 is below requirement)']
      }
    });

    const res = await analyzeResume(
      'Nurse with hospital experience. Education: BSN, GPA: 3.2.',
      'Job requiring 1 year hospital experience and GPA above 3.5.',
      'resume.pdf',
      'Hospital',
      'Nurse'
    );

    expect(res.requiredQualifications.missing.some(q => q.includes('GPA'))).toBe(true);
    expect(res.scoreBreakdown.requiredQualifications).toBeLessThan(100);
  });

  it('TEST 9: Any resume with no numerical metrics -> AI must never invent numbers (placeholders enforced)', async () => {
    vi.restoreAllMocks();

    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        recommendations: [{ issue: 'Add metrics', section: 'Experience', priority: 'medium', recommendation: 'Quantify your results.' }],
        bulletRewrites: [{
          original: 'Developed customer dashboard',
          improved: 'Architected customer dashboard serving [N users], improving response latency by [X%]',
          reason: 'Adds measurable impact using XYZ placeholders'
        }],
        skillsGap: []
      })
    });

    const res = await geminiService.generateAiFeedback('Developed customer dashboard', 'Senior Developer', 75, []);
    
    expect(res.bulletRewrites[0].improved).toContain('[N users]');
    expect(res.bulletRewrites[0].improved).toContain('[X%]');
    expect(res.bulletRewrites[0].improved).not.toMatch(/\b\d+%\b/); // No hallucinated hardcoded percentages
  });

  it('TEST 10: Mismatched domain -> High Resume Quality must NOT produce high ATS Match', async () => {
    mockGemini({
      roleDomain: { candidate: 'Software Engineering', target: 'Healthcare / Nursing' },
      roleCompatibilityScore: 5,
      experienceRelevanceScore: 0,
      isRegulatedRole: true,
      missingCriticalCredential: true,
      requiredQualifications: { matched: [], missing: ['Nursing license', 'Hospital experience', 'GPA verification'] },
      skills: { matched: [], missing: ['Pediatric care', 'Patient monitoring'] }
    });

    // A beautifully written, highly quantified senior software engineer resume
    const polishedSweResume = `Alex Morgan
Senior Full-Stack Engineer
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 5+ years of experience architecting scalable cloud web applications using React, TypeScript, Node.js, and AWS. Improved latency by 35% and saved $2M annually.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, SQL
- Frontend: React, Next.js, Redux, Tailwind
- Backend: Node.js, Express, REST APIs, Microservices
- Cloud: AWS, Docker, GitHub Actions, CI/CD
- Databases: PostgreSQL, MongoDB, Redis

EXPERIENCE
Senior Full-Stack Developer | CloudScale Solutions | Jan 2022 – Present
- Architected React & TypeScript dashboard serving 150k+ daily active users, reducing load time by 40%.
- Engineered 12+ secure microservices achieving 99.98% uptime and sub-100ms response times.
- Optimized database indexing in PostgreSQL, decreasing latency by 30% on $2M monthly volume.

EDUCATION
Bachelor of Science in Computer Science | UC Berkeley (2019)`;

    const res = await analyzeResume(
      polishedSweResume,
      'who have been experience for 1 year in hospital and have GPA above 3.5.',
      'alex-morgan.pdf',
      'AB Hospital',
      'Pediatric Nurse'
    );

    // Resume quality will be high (80+) due to strong formatting, verbs, and metrics
    expect(res.scoreBreakdown.resumeQuality).toBeGreaterThanOrEqual(75);

    // BUT overall ATS score MUST remain very low (<= 20) and flag critical mismatch
    expect(res.criticalMismatch).toBe(true);
    expect(res.atsScore).toBeLessThanOrEqual(20);
  });
});

