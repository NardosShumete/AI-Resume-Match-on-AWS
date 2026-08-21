export function calculateFormattingScore(resumeText: string): number {
  let score = 100;
  
  if (!resumeText) return 0;
  
  // 1. Missing contact info proxy (look for email pattern)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  if (!hasEmail) score -= 15;
  
  // 2. Weird characters / bad OCR
  const weirdChars = (resumeText.match(/[\uFFFD\u0000-\u0008\u000B-\u001F]/g) || []).length;
  if (weirdChars > 10) score -= 20;
  else if (weirdChars > 0) score -= (weirdChars * 2);
  
  // 3. Very long lines (often indicates layout tables breaking the parser)
  const lines = resumeText.split('\n');
  const longLines = lines.filter(l => l.length > 250).length;
  if (longLines > 5) score -= 15;
  
  // 4. Too short / too long
  if (resumeText.length < 500) score -= 30; // Very short
  if (resumeText.length > 10000) score -= 10; // Extremely long, might confuse ATS

  return Math.min(100, Math.max(0, score));
}
