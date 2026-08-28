import type { KeywordMatch, MissingKeyword } from '../../types/analysis';

export function calculateKeywordScore(matched: KeywordMatch[], missing: MissingKeyword[]): number {
  if (!matched || !missing) return 0;
  if (matched.length === 0 && missing.length === 0) return 0;
  if (matched.length === 0 && missing.length > 0) return 0;

  let score = 0;
  let totalWeight = 0;

  const weights = {
    high: 3,
    medium: 2,
    low: 1
  };

  for (const m of matched) {
    const w = weights[m.importance] || 2;
    score += w;
    totalWeight += w;
  }

  for (const m of missing) {
    const w = weights[m.importance] || 2;
    totalWeight += w;
  }

  if (totalWeight === 0) return 0;

  const percentage = (score / totalWeight) * 100;
  return Math.round(percentage);
}

