import type { ParsedResume } from '../resumeParser';
import type { ParsedJobDescription } from '../jobDescriptionParser';

export function calculateExperienceScore(
  resume: ParsedResume, 
  jd: ParsedJobDescription,
  targetJobTitle: string = ''
): number {
  const lowerExp = (resume.experience || '').toLowerCase();
  
  // If no experience section is found at all
  if (lowerExp.length < 50) {
    return 5;
  }

  // Extract key role terms from target job title
  const roleKeywords = targetJobTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['senior', 'junior', 'lead', 'principal', 'staff', 'manager', 'director', 'associate', 'head', 'officer'].includes(w));

  // Domain relevance check: do key terms from the target role exist in the resume experience?
  let hasDomainOverlap = false;
  if (roleKeywords.length > 0) {
    hasDomainOverlap = roleKeywords.some(kw => lowerExp.includes(kw));
  } else {
    hasDomainOverlap = true; // Fallback if no specific title keyword
  }

  // If experience is completely unrelated to the target role domain, cap heavily
  if (!hasDomainOverlap && roleKeywords.length > 0) {
    return 10;
  }

  let score = 40; // Base score for relevant experience

  // Check seniority overlap
  const resumeHasSenior = /\b(senior|sr|lead|principal|staff|head|manager|director)\b/i.test(lowerExp);
  if (jd.isSeniorRole && resumeHasSenior) {
    score += 25;
  } else if (jd.isSeniorRole && !resumeHasSenior) {
    score -= 15;
  } else if (!jd.isSeniorRole) {
    score += 10;
  }

  // Check management overlap
  const resumeHasManager = /\b(manage|managed|manager|director|vp|head|led)\b/i.test(lowerExp);
  if (jd.isManagerRole && resumeHasManager) {
    score += 25;
  } else if (jd.isManagerRole && !resumeHasManager) {
    score -= 20;
  } else if (!jd.isManagerRole) {
    score += 10;
  }
  
  // Experience length proxy
  if (jd.yearsOfExperienceRequired) {
    if (lowerExp.length > jd.yearsOfExperienceRequired * 200) {
      score += 25;
    } else {
      score += 10;
    }
  } else {
    score += 25;
  }

  return Math.min(100, Math.max(0, score));
}

