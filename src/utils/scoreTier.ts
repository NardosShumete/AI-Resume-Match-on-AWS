import type { AnalysisStatus } from '../types/analysis';

export function getScoreTier(score: number): AnalysisStatus {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
}
