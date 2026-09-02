import type { ScoreBreakdown } from '../../types/analysis';

export interface DeterministicScoringInput {
  roleCompatibility: number;       // 0-100
  requiredQualifications: number;  // 0-100
  skillsMatch: number;             // 0-100
  experienceRelevance: number;     // 0-100
  keywordMatch: number;            // 0-100
  resumeQuality: number;           // 0-100
  isRegulatedRole?: boolean;
  missingCriticalCredential?: boolean;
}

export interface DeterministicScoringResult {
  scoreBreakdown: ScoreBreakdown;
  atsScore: number;                // 0-100 integer
  criticalMismatch: boolean;
}

export const ATS_WEIGHTS = {
  roleCompatibility: 0.25,
  requiredQualifications: 0.20,
  skillsMatch: 0.20,
  experienceRelevance: 0.20,
  keywordMatch: 0.10,
  resumeQuality: 0.05
} as const;

export function clampScore(score: number | undefined | null): number {
  if (typeof score !== 'number' || isNaN(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Pure synchronous deterministic function to calculate final ATS score and breakdown.
 * Enforces hard-mismatch gate thresholds:
 * 1. Regulated role with missing critical credential => atsScore <= 18, criticalMismatch = true
 * 2. Role compatibility severely low (< 30) => atsScore <= 20, criticalMismatch = true
 * 3. Isolated Resume Quality cannot lift mismatched candidates over threshold.
 */
export function calculateDeterministicAtsScore(input: DeterministicScoringInput): DeterministicScoringResult {
  const scoreBreakdown: ScoreBreakdown = {
    roleCompatibility: clampScore(input.roleCompatibility),
    requiredQualifications: clampScore(input.requiredQualifications),
    skillsMatch: clampScore(input.skillsMatch),
    experienceRelevance: clampScore(input.experienceRelevance),
    keywordMatch: clampScore(input.keywordMatch),
    resumeQuality: clampScore(input.resumeQuality)
  };

  const rawScore = 
    (scoreBreakdown.roleCompatibility * ATS_WEIGHTS.roleCompatibility) +
    (scoreBreakdown.requiredQualifications * ATS_WEIGHTS.requiredQualifications) +
    (scoreBreakdown.skillsMatch * ATS_WEIGHTS.skillsMatch) +
    (scoreBreakdown.experienceRelevance * ATS_WEIGHTS.experienceRelevance) +
    (scoreBreakdown.keywordMatch * ATS_WEIGHTS.keywordMatch) +
    (scoreBreakdown.resumeQuality * ATS_WEIGHTS.resumeQuality);

  let finalAtsScore = clampScore(rawScore);
  let criticalMismatch = false;

  // Gate 1: Regulated role missing mandatory credentials/licenses
  if (input.isRegulatedRole && input.missingCriticalCredential) {
    finalAtsScore = Math.min(finalAtsScore, 18);
    criticalMismatch = true;
  }
  // Gate 2: Severe Unrelated role/domain mismatch
  else if (scoreBreakdown.roleCompatibility < 30) {
    // A severe domain mismatch should crush the final score regardless of keyword overlap
    finalAtsScore = Math.min(finalAtsScore, 20);
    criticalMismatch = true;
  }
  // Additional Gate for Experience/Qualifications missing entirely
  else if (scoreBreakdown.roleCompatibility < 50 && scoreBreakdown.requiredQualifications < 20) {
    finalAtsScore = Math.min(finalAtsScore, 35);
  }

  return {
    scoreBreakdown,
    atsScore: finalAtsScore,
    criticalMismatch
  };
}

export function calculateAtsScore(breakdown: ScoreBreakdown): number {
  return calculateDeterministicAtsScore(breakdown).atsScore;
}

