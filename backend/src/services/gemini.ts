import { GoogleGenAI } from '@google/genai';

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
  requiredQualifications: { matched: string[]; missing: string[] };
  preferredQualifications: { matched: string[]; missing: string[] };
  isRegulatedRole: boolean;
  missingCriticalCredential: boolean;
  skills: { matched: string[]; missing: string[] };
}

export async function analyzeAtsSemantics(
  resumeText: string,
  jobDescription: string
): Promise<AtsSemanticResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are an expert technical recruiter and ATS analyzer. Analyze the fundamental compatibility between the candidate's resume and the job description.

CRITICAL INSTRUCTIONS:
1. DISTINGUISH DOMAINS: Do not overvalue generic skills (like communication or basic programming) if the fundamental domain or occupation is different (e.g., IT vs. Medical Doctor).
2. REGULATED ROLES: Identify if the target job is a highly regulated or specialized profession (e.g., Doctor, Nurse, Lawyer, Pilot) that mandates specific degrees or licenses.
3. EXPERIENCE RELEVANCE: Evaluate if the candidate's actual experience domain and seniority align with the requirements. A candidate with non-medical experience should score very low for a medical role.
4. SKILLS: Extract the core skills from the JD and list which are matched or missing based on the resume.

Resume:
${resumeText.substring(0, 3000)}

Job Description:
${jobDescription.substring(0, 3000)}

Return STRICTLY as a JSON object matching this exact schema:
{
  "roleDomain": {
    "candidate": "string (Candidate's primary domain, e.g. 'IT / Cybersecurity')",
    "target": "string (Job's primary domain, e.g. 'Medicine / Healthcare')"
  },
  "roleCompatibilityScore": number (0-100, 0 if completely unrelated domains),
  "experienceRelevanceScore": number (0-100, based on relevant experience),
  "requiredQualifications": {
    "matched": ["string"],
    "missing": ["string"]
  },
  "preferredQualifications": {
    "matched": ["string"],
    "missing": ["string"]
  },
  "isRegulatedRole": boolean,
  "missingCriticalCredential": boolean (true if regulated and missing a mandatory credential),
  "skills": {
    "matched": ["string"],
    "missing": ["string"]
  }
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error('Empty response from Gemini');
    }
    
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as AtsSemanticResponse;
  } catch (error) {
    console.error('Gemini API error (ATS Semantics):', error);
    return {
      roleDomain: { candidate: 'Unknown', target: 'Unknown' },
      roleCompatibilityScore: 50,
      experienceRelevanceScore: 50,
      requiredQualifications: { matched: [], missing: [] },
      preferredQualifications: { matched: [], missing: [] },
      isRegulatedRole: false,
      missingCriticalCredential: false,
      skills: { matched: [], missing: [] }
    };
  }
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

  const ai = new GoogleGenAI({ apiKey });

  const languageInstruction = language === 'am'
    ? `LANGUAGE INSTRUCTION: Output all user-facing explanations, issues, section names, recommendations, improved bullet points, and reasons in natural, professional Amharic (አማርኛ). Keep technical names (such as React, Node.js, AWS, TypeScript, PostgreSQL, Docker, Git, etc.) in English where appropriate for clarity. Keep JSON keys strictly in English matching the schema.`
    : `LANGUAGE INSTRUCTION: Output all user-facing content in professional English. Keep JSON keys strictly in English matching the schema.`;

  const prompt = `
You are an expert technical recruiter and ATS specialist.
Analyze this resume against the job description and the calculated deterministic analysis.

${languageInstruction}

Resume:
${resumeText.substring(0, 3000)}

Job Description:
${jobDescription.substring(0, 3000)}

ATS Score: ${atsScore}%
Missing Critical Skills: ${missingSkills.join(', ')}

Provide actionable feedback to improve the resume. Do NOT hallucinate experience or skills the candidate does not have. Only suggest rewrites that reframe existing experience using the XYZ formula (Accomplished X, as measured by Y, by doing Z).

CRITICAL RULE FOR BULLET REWRITES:
NEVER INVENT INFORMATION. Do NOT hallucinate numbers, percentages, project sizes, durations, or company names that are not in the resume. 
If a metric would improve the bullet, use explicit placeholders like "[X%]", "[N devices]", or "[N users]".
Every bullet rewrite must strictly preserve the factual meaning of the original resume.

Return the response STRICTLY as a JSON object matching this schema:
{
  "recommendations": [
    { "issue": "String", "section": "String (e.g., 'Summary', 'Experience')", "priority": "high|medium|low", "recommendation": "String" }
  ],
  "bulletRewrites": [
    { "original": "String (exact snippet from resume)", "improved": "String (XYZ rewritten with placeholders for missing numbers)", "reason": "String" }
  ],
  "skillsGap": [
    { "skill": "String", "importance": "high|medium|low", "recommendation": "String (how to address missing skill without lying)" }
  ]
}

Ensure valid JSON output without markdown blocks around it if possible.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error('Empty response from Gemini');
    }
    
    // In case the model returned markdown code blocks around the JSON
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as GeminiFeedbackResponse;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return graceful fallback
    return {
      recommendations: [{
        issue: 'Unable to generate AI recommendations',
        section: 'General',
        priority: 'high',
        recommendation: 'Please try again later. The AI service is currently unavailable.'
      }],
      bulletRewrites: [],
      skillsGap: missingSkills.map(s => ({
        skill: s,
        importance: 'medium',
        recommendation: 'Consider learning or highlighting this skill.'
      }))
    };
  }
}
