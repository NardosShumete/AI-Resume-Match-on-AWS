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

export interface RoleDomain {
  candidate: string;
  target: string;
}

export interface QualificationsList {
  matched: string[];
  missing: string[];
}

export interface ScoreBreakdown {
  roleCompatibility: number;
  requiredQualifications: number;
  skillsMatch: number;
  experienceRelevance: number;
  keywordMatch: number;
  resumeQuality: number;
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
  
  criticalMismatch?: boolean;
  roleDomain?: RoleDomain;
  requiredQualifications: QualificationsList;
  preferredQualifications?: QualificationsList;
  
  recommendations: AiRecommendation[];
  bulletRewrites: BulletRewrite[];
  skillsGap: SkillsGap[];
  formattingTips: string[];
  
  summary: string;
}
