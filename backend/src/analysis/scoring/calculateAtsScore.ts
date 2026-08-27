import type { ScoreBreakdown } from '../../types/analysis';

export function calculateAtsScore(breakdown: ScoreBreakdown): number {
  // Weights (must sum to 1.0)
  const weights = {
    roleCompatibility: 0.25,
    requiredQualifications: 0.25,
    skillsMatch: 0.15,
    experienceRelevance: 0.15,
    keywordMatch: 0.10,
    resumeQuality: 0.10
  };

  const finalScore = 
    (breakdown.roleCompatibility * weights.roleCompatibility) +
    (breakdown.requiredQualifications * weights.requiredQualifications) +
    (breakdown.skillsMatch * weights.skillsMatch) +
    (breakdown.experienceRelevance * weights.experienceRelevance) +
    (breakdown.keywordMatch * weights.keywordMatch) +
    (breakdown.resumeQuality * weights.resumeQuality);
    
  return Math.round(finalScore);
}
