/**
 * Centralized Score Value Formatter
 * 
 * Ensures all scores adhere strictly to the 0-100 integer contract.
 * Formats score with "%" symbol at render time only.
 * Returns "N/A" for missing/undefined/null/NaN data.
 */

export function formatScore(score: number | undefined | null): string {
  if (typeof score === 'number' && !isNaN(score)) {
    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    return `${clamped}%`;
  }
  return 'N/A';
}

export function formatScoreNumber(score: number | undefined | null): number {
  if (typeof score === 'number' && !isNaN(score)) {
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  return 0;
}

export function getScoreProgress(score: number | undefined | null): number {
  if (typeof score === 'number' && !isNaN(score)) {
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  return 0;
}
