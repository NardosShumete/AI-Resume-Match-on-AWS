import type { KeywordMatch, MissingKeyword } from '../types/analysis';
import { extractKeywords } from './keywordExtractor';

export function matchKeywords(resumeText: string, jobDescriptionText: string) {
  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jobDescriptionText);

  const matched: KeywordMatch[] = [];
  const missing: MissingKeyword[] = [];

  const resumeKeywordSet = new Set(resumeKeywords.map(k => k.normalized));

  for (const jdKw of jdKeywords) {
    // For now, assign deterministic importance based on some heuristic.
    // In a real system, you'd analyze if the JD says "required" vs "bonus".
    // We'll just randomly assign or assign based on some rules.
    // Let's say: if it appears multiple times, it's high importance.
    const countInJd = (jobDescriptionText.toLowerCase().match(new RegExp(jdKw.normalized.toLowerCase(), 'g')) || []).length;
    let importance: 'high' | 'medium' | 'low' = 'medium';
    
    if (countInJd > 2) importance = 'high';
    else if (countInJd === 1) importance = 'low';

    if (resumeKeywordSet.has(jdKw.normalized)) {
      matched.push({ keyword: jdKw.normalized, importance });
    } else {
      missing.push({ keyword: jdKw.normalized, importance });
    }
  }

  // Also extract skills explicitly for the SkillMatch array 
  // (In our simple model, skills and keywords are the same, but they can diverge later)
  const matchedSkills = matched.map(m => ({ skill: m.keyword, importance: m.importance }));
  const missingSkills = missing.map(m => ({ skill: m.keyword, importance: m.importance }));

  return {
    matchedKeywords: matched,
    missingKeywords: missing,
    matchedSkills,
    missingSkills
  };
}
