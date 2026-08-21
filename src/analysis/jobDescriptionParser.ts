export interface ParsedJobDescription {
  rawText: string;
  isSeniorRole: boolean;
  isManagerRole: boolean;
  yearsOfExperienceRequired: number | null;
}

export function parseJobDescription(text: string): ParsedJobDescription {
  const lowerText = text.toLowerCase();
  
  // Detect seniority
  const isSeniorRole = /\b(senior|sr|lead|principal|staff|head|manager|director)\b/i.test(lowerText);
  const isManagerRole = /\b(manager|director|vp|head of)\b/i.test(lowerText);

  // Extract years of experience (very naive heuristic)
  let yearsOfExperienceRequired: number | null = null;
  const yoeRegex = /(\d+)(?:\s*-\s*\d+)?\+?\s*(?:years|yrs)(?:\s*of)?\s*(?:experience|exp)/i;
  const match = text.match(yoeRegex);
  
  if (match && match[1]) {
    const years = parseInt(match[1], 10);
    if (!isNaN(years) && years > 0 && years < 30) {
      yearsOfExperienceRequired = years;
    }
  }

  return {
    rawText: text,
    isSeniorRole,
    isManagerRole,
    yearsOfExperienceRequired
  };
}
