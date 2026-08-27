import type { AnalysisResult } from '../types/analysis';
import { parseResumeSections } from './resumeParser';
import { parseJobDescription } from './jobDescriptionParser';
import { matchKeywords } from './matchKeywords';
import { calculateKeywordScore } from './scoring/keywordScore';
import { calculateSkillsScore } from './scoring/skillsScore';
import { calculateExperienceScore } from './scoring/experienceScore';
import { calculateFormattingScore } from './scoring/formattingScore';
import { calculateImpactScore } from './scoring/impactScore';
import { calculateAtsScore } from './scoring/calculateAtsScore';
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

  // Calculate required qualifications score based on critical requirements
  const totalReqs = semantics.requiredQualifications.matched.length + semantics.requiredQualifications.missing.length;
  const metReqs = semantics.requiredQualifications.matched.length;
  let requiredQualificationsScore = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 100;

  // Reduce requiredQualificationsScore if missing critical credential
  if (semantics.isRegulatedRole && semantics.missingCriticalCredential) {
    requiredQualificationsScore = Math.min(requiredQualificationsScore, 20); // Severely penalize
  }

  // Override deterministic skills with AI semantic skills for scoring
  const semanticSkillsScore = (() => {
    const total = semantics.skills.matched.length + semantics.skills.missing.length;
    if (total === 0) return calculateSkillsScore(matchedSkills, missingSkills); // fallback
    return Math.round((semantics.skills.matched.length / total) * 100);
  })();
  
  // Transform AI skills into SkillMatch for the UI
  const finalMatchedSkills = semantics.skills.matched.length > 0 
    ? semantics.skills.matched.map(s => ({ skill: s, importance: 'high' as const }))
    : matchedSkills;
    
  const finalMissingSkills = semantics.skills.missing.length > 0
    ? semantics.skills.missing.map(s => ({ skill: s, importance: 'high' as const }))
    : missingSkills;

  // 4. Scoring
  const keywordScore = calculateKeywordScore(matchedKeywords, missingKeywords);
  const skillsScore = semanticSkillsScore;
  const expScore = Math.round((calculateExperienceScore(parsedResume, parsedJd) + semantics.experienceRelevanceScore) / 2);
  const formattingScoreVal = calculateFormattingScore(resumeText);
  const impactScoreVal = calculateImpactScore(resumeText);
  
  const resumeQualityScore = Math.round((formattingScoreVal + impactScoreVal) / 2);

  const scoreBreakdown = {
    roleCompatibility: semantics.roleCompatibilityScore,
    requiredQualifications: requiredQualificationsScore,
    skillsMatch: skillsScore,
    experienceRelevance: expScore,
    keywordMatch: keywordScore,
    resumeQuality: resumeQualityScore
  };

  let atsScore = calculateAtsScore(scoreBreakdown);

  // HARD MISMATCH SAFEGUARD
  let criticalMismatch = false;
  if (semantics.isRegulatedRole && semantics.missingCriticalCredential) {
    atsScore = Math.min(atsScore, 20);
    criticalMismatch = true;
  } else if (semantics.roleCompatibilityScore < 30) {
    atsScore = Math.min(atsScore, 25);
    criticalMismatch = true;
  }

  const tier = getScoreTier(atsScore);

  // 4. AI Feedback Generation
  // Pass missing high-importance skills specifically
  const criticalMissingSkills = finalMissingSkills
    .filter(s => s.importance === 'high' || s.importance === 'medium')
    .map(s => s.skill);

  const aiFeedback = await generateAiFeedback(resumeText, jobDescriptionText, atsScore, criticalMissingSkills, language);

  // 5. Construct Final Result
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
    requiredQualifications: semantics.requiredQualifications,
    preferredQualifications: semantics.preferredQualifications,
    scoreBreakdown,
    recommendations: aiFeedback.recommendations,
    bulletRewrites: aiFeedback.bulletRewrites,
    skillsGap: aiFeedback.skillsGap,
    formattingTips: [],
    summary: 'Analysis completed successfully.'
  };
}
