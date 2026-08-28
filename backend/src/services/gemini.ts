import { GoogleGenAI } from '@google/genai';
import type { RequirementItem } from '../types/analysis';

export interface GeminiFeedbackResponse {
  recommendations: Array<{
    issue: string;
    section: string;
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
  bulletRewrites: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  skillsGap: Array<{
    skill: string;
    importance: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
}

export interface AtsSemanticResponse {
  roleDomain: {
    candidate: string;
    target: string;
  };
  roleCompatibilityScore: number;
  experienceRelevanceScore: number;
  requirements: RequirementItem[];
  requiredQualifications: { matched: string[]; missing: string[] };
  preferredQualifications: { matched: string[]; missing: string[] };
  isRegulatedRole: boolean;
  missingCriticalCredential: boolean;
  skills: { matched: string[]; missing: string[] };
}

// Schemas for Gemini Structured Output
const ATS_SEMANTICS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    roleDomain: {
      type: 'OBJECT',
      properties: {
        candidate: { type: 'STRING' },
        target: { type: 'STRING' }
      },
      required: ['candidate', 'target']
    },
    roleCompatibilityScore: { type: 'INTEGER' },
    experienceRelevanceScore: { type: 'INTEGER' },
    isRegulatedRole: { type: 'BOOLEAN' },
    missingCriticalCredential: { type: 'BOOLEAN' },
    requirements: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          requirement: { type: 'STRING' },
          source: { type: 'STRING', enum: ['explicit', 'role-implied'] },
          status: { type: 'STRING', enum: ['matched', 'missing', 'unverified'] },
          explanation: { type: 'STRING' }
        },
        required: ['requirement', 'source', 'status', 'explanation']
      }
    },
    skills: {
      type: 'OBJECT',
      properties: {
        matched: { type: 'ARRAY', items: { type: 'STRING' } },
        missing: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['matched', 'missing']
    }
  },
  required: [
    'roleDomain',
    'roleCompatibilityScore',
    'experienceRelevanceScore',
    'isRegulatedRole',
    'missingCriticalCredential',
    'requirements',
    'skills'
  ]
};

const FEEDBACK_SCHEMA = {
  type: 'OBJECT',
  properties: {
    recommendations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          issue: { type: 'STRING' },
          section: { type: 'STRING' },
          priority: { type: 'STRING', enum: ['high', 'medium', 'low'] },
          recommendation: { type: 'STRING' }
        },
        required: ['issue', 'section', 'priority', 'recommendation']
      }
    },
    bulletRewrites: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          original: { type: 'STRING' },
          improved: { type: 'STRING' },
          reason: { type: 'STRING' }
        },
        required: ['original', 'improved', 'reason']
      }
    },
    skillsGap: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          skill: { type: 'STRING' },
          importance: { type: 'STRING', enum: ['high', 'medium', 'low'] },
          recommendation: { type: 'STRING' }
        },
        required: ['skill', 'importance', 'recommendation']
      }
    }
  },
  required: ['recommendations', 'bulletRewrites', 'skillsGap']
};

function isValidSemanticResponse(parsed: any): parsed is AtsSemanticResponse {
  if (!parsed || typeof parsed !== 'object') return false;
  if (!parsed.roleDomain || typeof parsed.roleDomain.candidate !== 'string' || typeof parsed.roleDomain.target !== 'string') return false;
  if (typeof parsed.roleCompatibilityScore !== 'number' || isNaN(parsed.roleCompatibilityScore)) return false;
  if (typeof parsed.experienceRelevanceScore !== 'number' || isNaN(parsed.experienceRelevanceScore)) return false;
  if (typeof parsed.isRegulatedRole !== 'boolean') return false;
  if (typeof parsed.missingCriticalCredential !== 'boolean') return false;
  if (!Array.isArray(parsed.requirements)) return false;
  if (!parsed.skills || !Array.isArray(parsed.skills.matched) || !Array.isArray(parsed.skills.missing)) return false;
  return true;
}

// Deterministic domain classification helper for backup/fallback
function detectDomain(text: string): string {
  const lower = (text || '').toLowerCase();
  if (/\b(nurse|nursing|hospital|pediatric|physician|doctor|clinical|patient care|icu|medication|triage|medical|healthcare)\b/i.test(lower)) {
    return 'Healthcare / Nursing / Medicine';
  }
  if (/\b(cybersecurity|firewall|malware|cctv|surveillance|penetration testing|siem|soc|infosec)\b/i.test(lower)) {
    return 'Cybersecurity / Information Security';
  }
  if (/\b(software engineer|full-stack|developer|react|typescript|node\.js|python|aws|backend|frontend|microservices|cloud|devops|sql)\b/i.test(lower)) {
    return 'Software Engineering / Computer Science';
  }
  if (/\b(accountant|accounting|financial analyst|audit|gaap|ledger|cpa|tax)\b/i.test(lower)) {
    return 'Finance / Accounting';
  }
  return 'General Professional';
}

export async function analyzeAtsSemantics(
  resumeText: string,
  jobDescription: string
): Promise<AtsSemanticResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const ai = new GoogleGenAI({ apiKey });

  const buildPrompt = (isRetry = false) => `
You are an expert, highly rigorous ATS analyzer and technical recruiter.
Evaluate the fundamental occupational and qualification compatibility between the candidate resume and target job description.

${isRetry ? 'IMPORTANT SCHEMA CORRECTION: Ensure all scores are integers 0-100. Enforce strict JSON matching the requested schema.' : ''}

CRITICAL EVALUATION RULES:
1. DOMAIN & ROLE COMPATIBILITY:
   - Identify candidate's core domain (e.g. 'Software Engineering', 'Healthcare / Nursing', 'Cybersecurity', 'Finance').
   - Identify target job domain.
   - If fundamentally unrelated (e.g. Software Engineer applying for Pediatric Nurse or Doctor), roleCompatibilityScore MUST be very low (0 - 15).

2. REGULATED & LICENSED ROLES:
   - Identify if target role is a regulated profession (e.g. Registered Nurse, Physician, Lawyer).
   - Set isRegulatedRole: true for healthcare/nursing/medical roles.
   - If candidate lacks mandatory credential/degree (e.g. RN/BSN for nurse, MD for doctor), set missingCriticalCredential: true.

3. REQUIREMENT PROVENANCE (EXPLICIT vs ROLE-IMPLIED):
   - Categorize each requirement with its provenance "source":
     * "explicit": Stated in the job description text (e.g. "1 year hospital experience", "GPA above 3.5").
     * "role-implied": Standard for this job title/domain (e.g. "Nursing License / BSN Degree for Pediatric Nurse").
   - Categorize status as "matched" | "missing" | "unverified".
   - For GPA:
     * Resume GPA >= 3.5 -> status: "matched", source: "explicit".
     * Resume GPA < 3.5 -> status: "missing", source: "explicit".
     * Resume does not state GPA -> status: "missing", source: "explicit", explanation: "Your resume does not state a GPA, so the required GPA > 3.5 cannot be verified."
     * NEVER hallucinate school names into requirements (e.g. never say "UC Berkeley GPA").

4. EXPERIENCE RELEVANCE:
   - Score experienceRelevanceScore (0-100) based on RELEVANT experience in the target domain.

5. TARGET JOB SKILLS:
   - List which target job skills candidate possesses (matched) vs lacks (missing).

Resume:
${resumeText.substring(0, 4000)}

Job Description:
${jobDescription.substring(0, 4000)}
`;

  // Attempt 1: Standard structured call
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: buildPrompt(false),
      config: {
        responseMimeType: 'application/json',
        responseSchema: ATS_SEMANTICS_SCHEMA,
      }
    });

    const text = response.text;
    if (text) {
      const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText);
      if (isValidSemanticResponse(parsed)) {
        return normalizeSemanticResponse(parsed);
      }
    }
  } catch (err) {
    console.warn('First Gemini attempt failed, retrying with schema reminder...', err);
  }

  // Attempt 2: Retry with stricter reminder
  try {
    const retryResponse = await ai.models.generateContent({
      model: modelName,
      contents: buildPrompt(true),
      config: {
        responseMimeType: 'application/json',
        responseSchema: ATS_SEMANTICS_SCHEMA,
      }
    });

    const retryText = retryResponse.text;
    if (retryText) {
      const cleanRetry = retryText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const retryParsed = JSON.parse(cleanRetry);
      if (isValidSemanticResponse(retryParsed)) {
        return normalizeSemanticResponse(retryParsed);
      }
    }
  } catch (retryErr) {
    console.error('Gemini retry attempt also failed:', retryErr);
  }

  // Fallback to deterministic domain classification if both calls fail
  return createFallbackSemanticResponse(resumeText, jobDescription);
}

function normalizeSemanticResponse(parsed: any): AtsSemanticResponse {
  const reqs: RequirementItem[] = Array.isArray(parsed.requirements)
    ? parsed.requirements.map((r: any) => ({
        requirement: String(r.requirement || ''),
        source: r.source === 'role-implied' ? 'role-implied' : 'explicit',
        status: r.status === 'matched' ? 'matched' : r.status === 'unverified' ? 'unverified' : 'missing',
        explanation: String(r.explanation || '')
      }))
    : [];

  const matchedReqs = reqs.filter(r => r.status === 'matched').map(r => r.requirement);
  const missingReqs = reqs.filter(r => r.status !== 'matched').map(r => r.explanation || r.requirement);

  return {
    roleDomain: {
      candidate: String(parsed.roleDomain?.candidate || 'General Professional'),
      target: String(parsed.roleDomain?.target || 'General Professional')
    },
    roleCompatibilityScore: Math.max(0, Math.min(100, Math.round(Number(parsed.roleCompatibilityScore) || 0))),
    experienceRelevanceScore: Math.max(0, Math.min(100, Math.round(Number(parsed.experienceRelevanceScore) || 0))),
    requirements: reqs,
    requiredQualifications: {
      matched: matchedReqs,
      missing: missingReqs
    },
    preferredQualifications: { matched: [], missing: [] },
    isRegulatedRole: Boolean(parsed.isRegulatedRole),
    missingCriticalCredential: Boolean(parsed.missingCriticalCredential),
    skills: {
      matched: Array.isArray(parsed.skills?.matched) ? parsed.skills.matched.map(String) : [],
      missing: Array.isArray(parsed.skills?.missing) ? parsed.skills.missing.map(String) : []
    }
  };
}

function createFallbackSemanticResponse(resumeText: string, jobDescription: string): AtsSemanticResponse {
  const candDomain = detectDomain(resumeText);
  const targetDomain = detectDomain(jobDescription);
  const isDomainMatch = candDomain === targetDomain;
  const isHealthcare = targetDomain.includes('Healthcare') || targetDomain.includes('Nursing');

  const fallbackRequirements: RequirementItem[] = [
    {
      requirement: isDomainMatch ? 'Domain Alignment' : 'Target Role Qualifications',
      source: 'role-implied',
      status: isDomainMatch ? 'matched' : 'missing',
      explanation: isDomainMatch ? 'Candidate background aligns with target domain.' : 'Candidate background does not meet target domain requirements.'
    }
  ];

  return {
    roleDomain: { candidate: candDomain, target: targetDomain },
    roleCompatibilityScore: isDomainMatch ? 80 : 10,
    experienceRelevanceScore: isDomainMatch ? 75 : 10,
    requirements: fallbackRequirements,
    requiredQualifications: {
      matched: isDomainMatch ? ['Domain Alignment'] : [],
      missing: isDomainMatch ? [] : ['Target Role Qualifications']
    },
    preferredQualifications: { matched: [], missing: [] },
    isRegulatedRole: isHealthcare,
    missingCriticalCredential: isHealthcare && !isDomainMatch,
    skills: {
      matched: [],
      missing: isDomainMatch ? [] : ['Domain-specific skills']
    }
  };
}

export async function generateAiFeedback(
  resumeText: string,
  jobDescription: string,
  atsScore: number,
  missingSkills: string[],
  language: 'en' | 'am' = 'en'
): Promise<GeminiFeedbackResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not defined in environment variables');
    throw new Error('GEMINI_API_KEY is missing');
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const ai = new GoogleGenAI({ apiKey });

  const languageInstruction = language === 'am'
    ? `LANGUAGE INSTRUCTION: Output all user-facing explanations, issues, section names, recommendations, improved bullet points, and reasons in natural, professional Amharic (አማርኛ). Keep technical names (such as React, Node.js, AWS, TypeScript, PostgreSQL, Docker, Git, etc.) in English where appropriate for clarity. Keep JSON keys strictly in English matching the schema.`
    : `LANGUAGE INSTRUCTION: Output all user-facing content in professional English. Keep JSON keys strictly in English matching the schema.`;

  const prompt = `
You are an expert technical recruiter and ATS optimization specialist.
Analyze this resume against the job description and provide structured, grounded feedback.

${languageInstruction}

Resume:
${resumeText.substring(0, 4000)}

Job Description:
${jobDescription.substring(0, 4000)}

ATS Score: ${atsScore}%
Missing Skills/Requirements: ${missingSkills.join(', ')}

CRITICAL ANTI-HALLUCINATION RULES:
1. NEVER INVENT INFORMATION:
   - Do NOT hallucinate numbers, percentages, company names, project sizes, or credentials not in the resume.
   - If recommending an XYZ formula improvement, USE EXPLICIT PLACEHOLDERS like "[X%]", "[N devices]", "[N users]", "[N sites]", "[amount]".
   - Do NOT rewrite unrelated technical experience into fake domain achievements (e.g. NEVER rewrite software engineering bullets into hospital patient-care achievements).
   
2. DOMAIN MISMATCH HONESTY:
   - If candidate's background is fundamentally different from target job (e.g. Software Engineer applying for Pediatric Nurse), do NOT force bullet rewrites into clinical terms.
   - State clearly in recommendations that candidate lacks required domain credentials and should not fabricate such experience.

3. GPA & REQUIREMENTS:
   - If the job requires a GPA and the resume does not state one, recommend: "Your resume does not state a GPA, so the required GPA cannot be verified. Add your cumulative GPA if it meets the requirement."
   - Do NOT attribute requirements to specific universities unless explicitly stated in the job description.
`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: FEEDBACK_SCHEMA,
      }
    });

    const text = response.text;
    if (text) {
      const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText) as GeminiFeedbackResponse;
      return {
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        bulletRewrites: Array.isArray(parsed.bulletRewrites) ? parsed.bulletRewrites : [],
        skillsGap: Array.isArray(parsed.skillsGap) ? parsed.skillsGap : []
      };
    }
  } catch (error) {
    console.error('Gemini API error (Feedback):', error);
  }

  return {
    recommendations: [{
      issue: 'Unable to generate AI recommendations',
      section: 'General',
      priority: 'high',
      recommendation: 'Ensure your resume explicitly addresses all mandatory qualifications and credentials stated in the job description.'
    }],
    bulletRewrites: [],
    skillsGap: missingSkills.map(s => ({
      skill: s,
      importance: 'high',
      recommendation: 'Highlight relevant experience or certifications for this requirement.'
    }))
  };
}
