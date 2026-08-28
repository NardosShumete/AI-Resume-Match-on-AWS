export type RequirementSource = 'explicit' | 'role-implied';
export type RequirementStatus = 'matched' | 'missing' | 'unverified';

export interface RequirementItem {
  requirement: string;
  source: RequirementSource;
  status: RequirementStatus;
  explanation: string;
}

export interface RequirementsCategory {
  matched: RequirementItem[];
  missing: RequirementItem[];
  unverified: RequirementItem[];
  score: number; // 0-100 integer
}

export interface RequirementsBreakdown {
  explicit: RequirementsCategory;
  roleImplied: RequirementsCategory;
  overallScore: number; // 0-100 integer
}

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
  roleCompatibility: number;      // 0-100 integer (25% weight)
  requiredQualifications: number; // 0-100 integer (25% weight)
  skillsMatch: number;            // 0-100 integer (15% weight)
  experienceRelevance: number;    // 0-100 integer (15% weight)
  keywordMatch: number;           // 0-100 integer (10% weight)
  resumeQuality: number;          // 0-100 integer (10% weight)
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
  
  atsScore: number;               // 0-100 integer
  status: AnalysisStatus;
  
  scoreBreakdown: ScoreBreakdown;
  
  matchedKeywords: KeywordMatch[];
  missingKeywords: MissingKeyword[];
  
  matchedSkills: SkillMatch[];
  missingSkills: SkillMatch[];
  
  criticalMismatch: boolean;
  roleDomain: RoleDomain;
  
  requirementsBreakdown: RequirementsBreakdown;
  requiredQualifications: QualificationsList;
  preferredQualifications?: QualificationsList;
  
  recommendations: AiRecommendation[];
  bulletRewrites: BulletRewrite[];
  skillsGap: SkillsGap[];
  formattingTips: string[];
  
  summary: string;
}

