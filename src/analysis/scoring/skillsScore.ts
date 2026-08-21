import type { SkillMatch } from '../../types/analysis';

export function calculateSkillsScore(matched: SkillMatch[], missing: SkillMatch[]): number {
  if (matched.length === 0 && missing.length === 0) return 100;

  // For this simplified version, skills are treated similarly to keywords,
  // but we can weigh high-priority skills more heavily here if desired.
  
  const weights = {
    high: 5, // Penalize high priority skill misses heavily
    medium: 2,
    low: 1
  };

  let earned = 0;
  let total = 0;

  for (const m of matched) {
    earned += weights[m.importance];
    total += weights[m.importance];
  }

  for (const m of missing) {
    total += weights[m.importance];
  }

  if (total === 0) return 100;

  return Math.round((earned / total) * 100);
}
