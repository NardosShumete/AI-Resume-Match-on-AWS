export type Language = 'en' | 'am';

export interface TranslationDictionary {
  nav: {
    brand: string;
    overview: string;
    analyzer: string;
    liveWorkspace: string;
  };
  header: {
    language: string;
    english: string;
    amharic: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    clearScans: string;
    newAnalysis: string;
    totalResumes: string;
    activeScans: string;
    avgMatchRate: string;
    targetRate: string;
    highestScore: string;
    noActiveScans: string;
    bulletFixes: string;
    generatedRewrites: string;
    searchPlaceholder: string;
    allReports: string;
    topMatches: string;
    noScansTitle: string;
    noScansDesc: string;
    loadExampleScans: string;
    startNewScan: string;
    noMatchingReports: string;
  };
  resumeCard: {
    atsScore: string;
    viewAnalysis: string;
    rewritesCount: string;
    skillsGapCount: string;
  };
  analyzer: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    uploadTitle: string;
    uploadDesc: string;
    dragDropText: string;
    selectPdf: string;
    extractingPdf: string;
    extractSuccess: string;
    pdfError: string;
    words: string;
    pages: string;
    chooseAnotherFile: string;
    jobDetailsTitle: string;
    companyLabel: string;
    companyPlaceholder: string;
    titleLabel: string;
    titlePlaceholder: string;
    jdLabel: string;
    jdPlaceholder: string;
    loadSampleData: string;
    analyzeButton: string;
    analyzingButton: string;
    backButton: string;
    fillRequiredFields: string;
  };
  loading: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    pleaseWait: string;
  };
  results: {
    backToDashboard: string;
    analyzedOn: string;
    analyzeAnother: string;
    exportPdf: string;
    overallMatch: string;
    matchBreakdown: string;
    keywordMatching: string;
    matchedKeywords: string;
    missingKeywords: string;
    matchedSkills: string;
    missingSkills: string;
    aiFeedbackTitle: string;
    recommendationsTab: string;
    bulletRewritesTab: string;
    skillsGapTab: string;
    issue: string;
    section: string;
    priority: string;
    recommendation: string;
    originalBullet: string;
    improvedBullet: string;
    reason: string;
    skill: string;
    importance: string;
    high: string;
    medium: string;
    low: string;
    noRecommendations: string;
    noRewrites: string;
    noSkillsGap: string;
  };
  breakdown: {
    keywordMatch: string;
    skillsMatch: string;
    experienceRelevance: string;
    formatting: string;
    impact: string;
  };
  scoreTiers: {
    strong: string;
    good: string;
    needsImprovement: string;
  };
  footer: {
    tagline: string;
    rights: string;
    privacyNote: string;
  };
  notFound: {
    title: string;
    desc: string;
    backHome: string;
  };
}
