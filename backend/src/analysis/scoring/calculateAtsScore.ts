import type { ScoreBreakdown } from '../../types/analysis';

export function calculateAtsScore(breakdown: ScoreBreakdown): number {
  // Weights (must sum to 1.0)
  const weights = {
    keywordMatch: 0.30,
    skillsMatch: 0.25,
    experienceRelevance: 0.20,
    formatting: 0.15,
    impact: 0.10
  };

  const finalScore = 
    (breakdown.keywordMatch * weights.keywordMatch) +
    (breakdown.skillsMatch * weights.skillsMatch) +
    (breakdown.experienceRelevance * weights.experienceRelevance) +
    (breakdown.formatting * weights.formatting) +
    (breakdown.impact * weights.impact);
    
  return Math.round(finalScore);
}
