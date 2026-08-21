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

export async function generateAiFeedback(
  resumeText: string,
  jobDescription: string,
  atsScore: number,
  missingSkills: string[]
): Promise<GeminiFeedbackResponse> {
  const prompt = `
You are an expert technical recruiter and ATS specialist.
Analyze this resume against the job description and the calculated deterministic analysis.

Resume:
${resumeText.substring(0, 3000)}

Job Description:
${jobDescription.substring(0, 3000)}

ATS Score: ${atsScore}%
Missing Critical Skills: ${missingSkills.join(', ')}

Provide actionable feedback to improve the resume. Do NOT hallucinate experience or skills the candidate does not have. Only suggest rewrites that reframe existing experience using the XYZ formula (Accomplished X, as measured by Y, by doing Z).

Return the response STRICTLY as a JSON object matching this schema:
{
  "recommendations": [
    { "issue": "String", "section": "String (e.g., 'Summary', 'Experience')", "priority": "high|medium|low", "recommendation": "String" }
  ],
  "bulletRewrites": [
    { "original": "String (exact snippet from resume)", "improved": "String (XYZ rewritten)", "reason": "String" }
  ],
  "skillsGap": [
    { "skill": "String", "importance": "high|medium|low", "recommendation": "String (how to address missing skill without lying)" }
  ]
}

Ensure valid JSON output without markdown blocks around it if possible.
`;

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI feedback');
    }

    const text = await response.text();
    // In case the model returned markdown code blocks around the JSON
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as GeminiFeedbackResponse;
  } catch (error) {
    console.error('Gemini proxy error:', error);
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
