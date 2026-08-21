export interface AnalysisResult {
  id: string;
  resumeName: string;
  jobTitle: string;
  companyName: string;
  date: string;
  score: number;
  status: 'Excellent' | 'Strong' | 'Good' | 'Needs Work' | 'Critical';
  categories: {
    keywordMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    formatting: number;
    tone: number;
  };
  keywords: {
    matched: string[];
    missing: string[];
  };
  feedback: {
    id: string;
    category: string;
    issue: string;
    whyItMatters: string;
    recommendation: string;
  }[];
}

export const mockAnalyses: AnalysisResult[] = [
  {
    id: '1',
    resumeName: 'Frontend Developer Resume.pdf',
    jobTitle: 'Frontend Developer',
    companyName: 'JS Mastery',
    date: 'Oct 15, 2026',
    score: 82,
    status: 'Strong',
    categories: {
      keywordMatch: 85,
      skillsMatch: 78,
      experienceMatch: 82,
      formatting: 90,
      tone: 80,
    },
    keywords: {
      matched: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Git', 'REST API'],
      missing: ['Docker', 'AWS', 'Kubernetes', 'CI/CD'],
    },
    feedback: [
      {
        id: 'f1',
        category: 'Experience Improvements',
        issue: 'Several experience bullets describe responsibilities rather than measurable results.',
        whyItMatters: 'ATS systems and recruiters benefit from specific achievements and measurable impact.',
        recommendation: 'Rewrite bullets using action + task + measurable result (e.g., "Improved load time by 20% by lazy loading images").',
      },
      {
        id: 'f2',
        category: 'Formatting & Tone',
        issue: 'Inconsistent date formats (e.g., "10/2021" vs "Oct 2021").',
        whyItMatters: 'ATS parsers might fail to accurately calculate your total years of experience.',
        recommendation: 'Standardize all dates to "Month YYYY" format.',
      },
      {
        id: 'f3',
        category: 'Skills Gap Analysis',
        issue: 'Missing cloud deployment skills (AWS, Docker).',
        whyItMatters: 'The job description heavily emphasizes managing your own deployments.',
        recommendation: 'Add any relevant side projects where you used Docker or deployed to AWS/Vercel.',
      }
    ]
  },
  {
    id: '2',
    resumeName: 'Product Manager.pdf',
    jobTitle: 'Product Manager',
    companyName: 'TechFlow',
    date: 'Oct 10, 2026',
    score: 65,
    status: 'Good',
    categories: {
      keywordMatch: 60,
      skillsMatch: 70,
      experienceMatch: 65,
      formatting: 85,
      tone: 85,
    },
    keywords: {
      matched: ['Agile', 'Scrum', 'Jira', 'Roadmapping', 'User Stories'],
      missing: ['Data Analytics', 'SQL', 'A/B Testing', 'Stakeholder Management'],
    },
    feedback: [
      {
        id: 'f4',
        category: 'Keyword Recommendations',
        issue: 'Missing key data-oriented keywords.',
        whyItMatters: 'Modern PM roles require strong data-driven decision making evidence.',
        recommendation: 'Include terms like "A/B Testing", "SQL", and "Data Analytics" in your core skills or experience context.',
      }
    ]
  },
  {
    id: '3',
    resumeName: 'UX_Designer_Final.pdf',
    jobTitle: 'Senior UX Designer',
    companyName: 'Creative Solutions',
    date: 'Sep 28, 2026',
    score: 91,
    status: 'Excellent',
    categories: {
      keywordMatch: 95,
      skillsMatch: 88,
      experienceMatch: 92,
      formatting: 98,
      tone: 90,
    },
    keywords: {
      matched: ['Figma', 'Prototyping', 'User Research', 'Wireframing', 'UI Design', 'Design Systems'],
      missing: ['Framer', 'Motion Design'],
    },
    feedback: [
      {
        id: 'f5',
        category: 'Resume Strengths',
        issue: 'Excellent use of quantifiable metrics in case studies.',
        whyItMatters: 'Designers who can prove business impact are highly sought after.',
        recommendation: 'Ensure your portfolio link is prominent, as recruiters will definitely click it based on this resume.',
      }
    ]
  }
];
