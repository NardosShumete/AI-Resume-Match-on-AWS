import type { AnalysisResult, RequirementsBreakdown, RequirementItem } from '../types/analysis';
import { parseResumeSections } from './resumeParser';
import { parseJobDescription } from './jobDescriptionParser';
import { matchKeywords } from './matchKeywords';
import { calculateKeywordScore } from './scoring/keywordScore';
import { calculateSkillsScore } from './scoring/skillsScore';
import { calculateExperienceScore } from './scoring/experienceScore';
import { calculateFormattingScore } from './scoring/formattingScore';
import { calculateImpactScore } from './scoring/impactScore';
import { calculateDeterministicAtsScore } from './scoring/calculateAtsScore';
import { getScoreTier } from '../utils/scoreTier';
import { generateAiFeedback, analyzeAtsSemantics } from '../services/gemini';
import { v4 as uuidv4 } from 'uuid';

export async function analyzeResume(
  resumeText: string,
  jobDescriptionText: string,
  resumeName: string,
  companyName: string,
  jobTitle: string,
  language: 'en' | 'am' = 'en'
): Promise<AnalysisResult> {
  // 1. Deterministic Parsing
  const parsedResume = parseResumeSections(resumeText);
  const parsedJd = parseJobDescription(jobDescriptionText);

  // 2. Keyword & Skill Extraction
  const { matchedKeywords, missingKeywords, matchedSkills, missingSkills } = matchKeywords(resumeText, jobDescriptionText);

  // 3. AI-driven Semantic ATS Analysis
  const semantics = await analyzeAtsSemantics(resumeText, jobDescriptionText);

  // 4. Requirement Provenance Breakdown (Explicit vs Role-Implied)
  let reqItems: RequirementItem[] = semantics.requirements || [];
  if (reqItems.length === 0 && (semantics.requiredQualifications?.matched?.length > 0 || semantics.requiredQualifications?.missing?.length > 0)) {
    reqItems = [
      ...semantics.requiredQualifications.matched.map(req => ({
        requirement: req,
        source: 'explicit' as const,
        status: 'matched' as const,
        explanation: 'Requirement verified in resume.'
      })),
      ...semantics.requiredQualifications.missing.map(req => ({
        requirement: req,
        source: 'explicit' as const,
        status: 'missing' as const,
        explanation: 'Requirement not verified in resume.'
      }))
    ];
  }

  const explicitReqs = reqItems.filter(r => r.source === 'explicit');
  const roleImpliedReqs = reqItems.filter(r => r.source === 'role-implied');

  const calcCategoryScore = (items: RequirementItem[], defaultScore: number): number => {
    if (items.length === 0) return defaultScore;
    const matchedCount = items.filter(i => i.status === 'matched').length;
    return Math.round((matchedCount / items.length) * 100);
  };

  const defaultReqScore = semantics.roleCompatibilityScore < 30 ? 10 : 70;
  const explicitScore = calcCategoryScore(explicitReqs, defaultReqScore);
  const roleImpliedScore = calcCategoryScore(roleImpliedReqs, defaultReqScore);

  let overallRequirementsScore: number;
  if (explicitReqs.length > 0 && roleImpliedReqs.length > 0) {
    overallRequirementsScore = Math.round(0.6 * explicitScore + 0.4 * roleImpliedScore);
  } else if (explicitReqs.length > 0) {
    overallRequirementsScore = explicitScore;
  } else if (roleImpliedReqs.length > 0) {
    overallRequirementsScore = roleImpliedScore;
  } else {
    overallRequirementsScore = defaultReqScore;
  }

  // Penalize required qualifications if critical credential missing
  if (semantics.isRegulatedRole && semantics.missingCriticalCredential) {
    overallRequirementsScore = Math.min(overallRequirementsScore, 10);
  } else if (semantics.roleCompatibilityScore < 30) {
    overallRequirementsScore = Math.min(overallRequirementsScore, 15);
  }

  const requirementsBreakdown: RequirementsBreakdown = {
    explicit: {
      matched: explicitReqs.filter(r => r.status === 'matched'),
      missing: explicitReqs.filter(r => r.status === 'missing'),
      unverified: explicitReqs.filter(r => r.status === 'unverified'),
      score: explicitScore
    },
    roleImplied: {
      matched: roleImpliedReqs.filter(r => r.status === 'matched'),
      missing: roleImpliedReqs.filter(r => r.status === 'missing'),
      unverified: roleImpliedReqs.filter(r => r.status === 'unverified'),
      score: roleImpliedScore
    },
    overallScore: overallRequirementsScore
  };

  // 5. Calculate Component Scores
  // A. Skills Score
  const semanticSkillsScore = (() => {
    const total = semantics.skills.matched.length + semantics.skills.missing.length;
    if (total > 0) {
      return Math.round((semantics.skills.matched.length / total) * 100);
    }
    return calculateSkillsScore(matchedSkills, missingSkills);
  })();

  let skillsScore = semanticSkillsScore;
  if (semantics.roleCompatibilityScore < 30) {
    skillsScore = Math.min(skillsScore, 15);
  }

  // B. Experience Relevance Score
  const expDeterministic = calculateExperienceScore(parsedResume, parsedJd, jobTitle);
  let expScore = Math.round((expDeterministic + semantics.experienceRelevanceScore) / 2);
  if (semantics.roleCompatibilityScore < 30) {
    expScore = Math.min(expScore, 15);
  }

  // C. Keyword Match Score
  let keywordScore = calculateKeywordScore(matchedKeywords, missingKeywords);
  if (semantics.roleCompatibilityScore < 30) {
    keywordScore = Math.min(keywordScore, 20);
  }

  // D. Resume Quality Score (Independent metric)
  const formattingScoreVal = calculateFormattingScore(resumeText);
  const impactScoreVal = calculateImpactScore(resumeText);
  const resumeQualityScore = Math.round((formattingScoreVal + impactScoreVal) / 2);

  // 6. Pure Deterministic ATS Scoring & Gates
  const scoringResult = calculateDeterministicAtsScore({
    roleCompatibility: semantics.roleCompatibilityScore,
    requiredQualifications: overallRequirementsScore,
    skillsMatch: skillsScore,
    experienceRelevance: expScore,
    keywordMatch: keywordScore,
    resumeQuality: resumeQualityScore,
    isRegulatedRole: semantics.isRegulatedRole,
    missingCriticalCredential: semantics.missingCriticalCredential
  });

  const atsScore = scoringResult.atsScore;
  const criticalMismatch = scoringResult.criticalMismatch;
  const scoreBreakdown = scoringResult.scoreBreakdown;
  const tier = getScoreTier(atsScore);

  // 7. Skills & AI Feedback
  const finalMatchedSkills = semantics.skills.matched.length > 0 
    ? semantics.skills.matched.map(s => ({ skill: s, importance: 'high' as const }))
    : matchedSkills;
    
  const finalMissingSkills = semantics.skills.missing.length > 0
    ? semantics.skills.missing.map(s => ({ skill: s, importance: 'high' as const }))
    : missingSkills;

  const criticalMissingSkills = finalMissingSkills
    .filter(s => s.importance === 'high' || s.importance === 'medium')
    .map(s => s.skill);

  const aiFeedback = await generateAiFeedback(resumeText, jobDescriptionText, atsScore, criticalMissingSkills, language);

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return {
    id: uuidv4(),
    jobTitle,
    companyName,
    date: today,
    resumeName,
    atsScore,
    status: tier,
    matchedKeywords,
    missingKeywords,
    matchedSkills: finalMatchedSkills,
    missingSkills: finalMissingSkills,
    criticalMismatch,
    roleDomain: semantics.roleDomain,
    requirementsBreakdown,
    requiredQualifications: semantics.requiredQualifications,
    preferredQualifications: semantics.preferredQualifications,
    scoreBreakdown,
    recommendations: aiFeedback.recommendations,
    bulletRewrites: aiFeedback.bulletRewrites,
    skillsGap: aiFeedback.skillsGap,
    formattingTips: [],
    summary: criticalMismatch 
      ? `Analysis complete. A significant role domain mismatch was detected between ${semantics.roleDomain.candidate} and ${semantics.roleDomain.target}.`
      : 'Analysis completed successfully.'
  };
}

