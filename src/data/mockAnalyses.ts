import type { AnalysisResult } from '../types/analysis';

export const mockAnalyses: AnalysisResult[] = [
  {
    id: '1',
    resumeName: 'Frontend Developer Resume.pdf',
    jobTitle: 'Frontend Developer',
    companyName: 'JS Mastery',
    date: 'Oct 15, 2026',
    atsScore: 82,
    status: 'Strong',
    scoreBreakdown: {
      roleCompatibility: 90,
      requiredQualifications: 100,
      skillsMatch: 78,
      experienceRelevance: 82,
      keywordMatch: 85,
      resumeQuality: 85,
    },
    matchedKeywords: [
      { keyword: 'React', importance: 'high' },
      { keyword: 'TypeScript', importance: 'high' },
      { keyword: 'JavaScript', importance: 'high' },
      { keyword: 'Next.js', importance: 'medium' },
      { keyword: 'Git', importance: 'medium' },
      { keyword: 'REST API', importance: 'medium' }
    ],
    missingKeywords: [
      { keyword: 'Docker', importance: 'medium' },
      { keyword: 'AWS', importance: 'high' },
      { keyword: 'Kubernetes', importance: 'low' },
      { keyword: 'CI/CD', importance: 'medium' }
    ],
    roleDomain: { candidate: 'Software Engineering', target: 'Software Engineering' },
    requiredQualifications: {
      matched: ['Bachelor\'s Degree in Computer Science or related field', '3+ years experience with React'],
      missing: ['Experience with AWS']
    },
    matchedSkills: [
      { skill: 'React', importance: 'high' },
      { skill: 'TypeScript', importance: 'high' }
    ],
    missingSkills: [
      { skill: 'AWS', importance: 'high' }
    ],
    summary: 'This resume is a strong match for the Frontend Developer role, demonstrating solid experience in React and TypeScript. However, it lacks cloud and containerization experience which are emphasized in the job description.',
    recommendations: [
      {
        section: 'Experience',
        priority: 'high',
        issue: 'Several experience bullets describe responsibilities rather than measurable results.',
        recommendation: 'Rewrite bullets using action + task + measurable result.'
      },
      {
        section: 'Formatting',
        priority: 'medium',
        issue: 'Inconsistent date formats (e.g., "10/2021" vs "Oct 2021").',
        recommendation: 'Standardize all dates to "Month YYYY" format.'
      }
    ],
    bulletRewrites: [
      {
        original: 'Worked on improving page load time.',
        improved: 'Improved page load time by 20% through implementation of lazy loading and code splitting.',
        reason: 'Adds measurable impact (20%) and specific technical methods (lazy loading, code splitting).'
      }
    ],
    skillsGap: [
      {
        skill: 'AWS & Docker',
        importance: 'high',
        recommendation: 'Consider adding a personal project that uses Docker and deploys to AWS.'
      }
    ],
    formattingTips: [
      'Standardize all dates to "Month YYYY" format.',
      'Ensure standard section headers are used (e.g., "Experience" instead of "Places I worked").'
    ]
  }
];

