export function calculateImpactScore(resumeText: string): number {
  let score = 0;
  if (!resumeText) return 0;
  
  const lowerText = resumeText.toLowerCase();
  
  // Look for numbers, percentages, and dollar amounts
  const percentages = (resumeText.match(/\b\d+(?:\.\d+)?%/g) || []).length;
  const money = (resumeText.match(/\$\d+(?:,\d+)*(?:\.\d+)?(?:k|m|b| billion| million| thousand)?/gi) || []).length;
  const bigNumbers = (resumeText.match(/\b\d{3,}\b/g) || []).length; // Numbers > 99
  
  score += (percentages * 5);
  score += (money * 10);
  score += (bigNumbers * 2);
  
  // Look for strong action verbs
  const actionVerbs = ['achieved', 'improved', 'increased', 'decreased', 'reduced', 'optimized', 'spearheaded', 'managed', 'led', 'architected', 'developed', 'launched', 'delivered', 'automated', 'streamlined'];
  let verbsCount = 0;
  for (const verb of actionVerbs) {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(lowerText)) {
      verbsCount++;
    }
  }
  
  score += (verbsCount * 4);
  
  // Ensure we don't punish people who are just starting out TOO aggressively,
  // but true impact (100) requires solid metrics.
  // We'll give a base of 30 just for having a decent length.
  let finalScore = resumeText.length > 1000 ? 30 : 10;
  finalScore += score;
  
  return Math.min(100, Math.max(0, finalScore));
}
