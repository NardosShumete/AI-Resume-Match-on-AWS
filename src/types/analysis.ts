export interface KeywordMatch {
  keyword: string;
  importance: 'high' | 'medium' | 'low';
}

export interface MissingKeyword {
  keyword: string;
  importance: 'high' | 'medium' | 'low';
}

export interface SkillMatch {
  skill: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ScoreBreakdown {
  keywordMatch: number;
  skillsMatch: number;
  experienceRelevance: number;
  formatting: number;
  impact: number;
}

export interface AiRecommendation {
  section: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
}

export interface BulletRewrite {
  original: string;
  improved: string;
  reason: string;
}

export interface SkillsGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  recommendation: string;
}

export type AnalysisStatus = 'Excellent' | 'Strong' | 'Good' | 'Needs Work' | 'Critical';

export interface AnalysisResult {
  id: string;
  resumeName: string;
  jobTitle: string;
  companyName: string;
  date: string;
  
  atsScore: number;
  status: AnalysisStatus;
  
  scoreBreakdown: ScoreBreakdown;
  
  matchedKeywords: KeywordMatch[];
  missingKeywords: MissingKeyword[];
  
  matchedSkills: SkillMatch[];
  missingSkills: SkillMatch[];
  
  recommendations: AiRecommendation[];
  bulletRewrites: BulletRewrite[];
  skillsGap: SkillsGap[];
  formattingTips: string[];
  
  summary: string;
}
