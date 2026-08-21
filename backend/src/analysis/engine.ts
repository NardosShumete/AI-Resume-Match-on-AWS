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
import { generateAiFeedback } from '../services/gemini';
import { v4 as uuidv4 } from 'uuid';

export async function analyzeResume(resumeText: string, jobDescriptionText: string, resumeName: string, companyName: string, jobTitle: string): Promise<AnalysisResult> {
  // 1. Deterministic Parsing
  const parsedResume = parseResumeSections(resumeText);
  const parsedJd = parseJobDescription(jobDescriptionText);

  // 2. Keyword & Skill Extraction
  const { matchedKeywords, missingKeywords, matchedSkills, missingSkills } = matchKeywords(resumeText, jobDescriptionText);

  // 3. Scoring
  const keywordScore = calculateKeywordScore(matchedKeywords, missingKeywords);
  const skillsScore = calculateSkillsScore(matchedSkills, missingSkills);
  const expScore = calculateExperienceScore(parsedResume, parsedJd);
  const formattingScoreVal = calculateFormattingScore(resumeText);
  const impactScoreVal = calculateImpactScore(resumeText);

  const scoreBreakdown = {
    keywordMatch: keywordScore,
    skillsMatch: skillsScore,
    experienceRelevance: expScore,
    formatting: formattingScoreVal,
    impact: impactScoreVal
  };

  const atsScore = calculateAtsScore(scoreBreakdown);
  const tier = getScoreTier(atsScore);

  // 4. AI Feedback Generation
  // Pass missing high-importance skills specifically
  const criticalMissingSkills = missingSkills
    .filter(s => s.importance === 'high' || s.importance === 'medium')
    .map(s => s.skill);

  const aiFeedback = await generateAiFeedback(resumeText, jobDescriptionText, atsScore, criticalMissingSkills);

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
    matchedSkills,
    missingSkills,
    scoreBreakdown,
    recommendations: aiFeedback.recommendations,
    bulletRewrites: aiFeedback.bulletRewrites,
    skillsGap: aiFeedback.skillsGap,
    formattingTips: [],
    summary: 'Analysis completed successfully.'
  };
}
