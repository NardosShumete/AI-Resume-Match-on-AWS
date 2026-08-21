import type { ParsedResume } from '../resumeParser';
import type { ParsedJobDescription } from '../jobDescriptionParser';

export function calculateExperienceScore(resume: ParsedResume, jd: ParsedJobDescription): number {
  let score = 50; // Base score
  
  const lowerExp = resume.experience.toLowerCase();
  
  // If no experience section is found at all
  if (lowerExp.length < 50) {
    return 10;
  }
  
  // Check seniority overlap
  const resumeHasSenior = /\b(senior|sr|lead|principal|staff|head|manager|director)\b/i.test(lowerExp);
  if (jd.isSeniorRole && resumeHasSenior) {
    score += 25;
  } else if (jd.isSeniorRole && !resumeHasSenior) {
    score -= 15; // Penalty for missing senior indicators when required
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
  // (A very rough proxy: length of the experience section)
  if (jd.yearsOfExperienceRequired) {
    if (lowerExp.length > jd.yearsOfExperienceRequired * 200) {
      score += 30; // Likely enough experience
    } else {
      score += 10; // Might be a bit light
    }
  } else {
    score += 30;
  }

  return Math.min(100, Math.max(0, score));
}
