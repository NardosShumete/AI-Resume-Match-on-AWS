import type { KeywordMatch, MissingKeyword } from '../../types/analysis';

export function calculateKeywordScore(matched: KeywordMatch[], missing: MissingKeyword[]): number {
  if (!matched || !missing) return 0;
  if (matched.length === 0 && missing.length === 0) return 0; // Or a baseline? If JD had no keywords extracted, we can't evaluate.
  // If matched has items but missing is empty, it could mean the JD only had generic keywords that were matched.
  // We should still calculate normally, but if the total weight is very low (e.g. only 1 generic keyword matched),
  // we might want to cap it. But for now, let's just let the normal math handle it.

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

