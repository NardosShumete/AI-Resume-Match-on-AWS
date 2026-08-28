import type { SkillMatch } from '../../types/analysis';

export function calculateSkillsScore(matched: SkillMatch[], missing: SkillMatch[]): number {
  if (!matched || !missing) return 0;
  if (matched.length === 0 && missing.length === 0) return 0;
  if (matched.length === 0 && missing.length > 0) return 0;

  const weights = {
    high: 5,
    medium: 2,
    low: 1
  };

  let earned = 0;
  let total = 0;

  for (const m of matched) {
    const w = weights[m.importance] || 2;
    earned += w;
    total += w;
  }

  for (const m of missing) {
    const w = weights[m.importance] || 2;
    total += w;
  }

  if (total === 0) return 0;

  return Math.round((earned / total) * 100);
}

