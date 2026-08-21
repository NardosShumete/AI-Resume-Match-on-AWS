// A simplified, deterministic dictionary of tech skills and keywords
const SKILL_DICTIONARY: Record<string, string[]> = {
  'JavaScript': ['javascript', 'js', 'es6'],
  'TypeScript': ['typescript', 'ts'],
  'Python': ['python', 'py'],
  'Java': ['java', 'j2ee'],
  'C#': ['c#', 'csharp', 'c sharp'],
  'C++': ['c++'],
  'Go': ['golang', 'go'],
  'Ruby': ['ruby', 'ror', 'ruby on rails'],
  'PHP': ['php'],
  
  'React': ['react', 'react.js', 'reactjs', 'react js'],
  'Next.js': ['nextjs', 'next.js', 'next js'],
  'Vue': ['vue', 'vue.js', 'vuejs'],
  'Angular': ['angular', 'angularjs', 'angular.js'],
  'Svelte': ['svelte'],
  'Node.js': ['node', 'node.js', 'nodejs'],
  'Django': ['django'],
  'Laravel': ['laravel'],
  'Spring Boot': ['spring boot', 'springboot'],
  
  'AWS': ['aws', 'amazon web services'],
  'Azure': ['azure', 'microsoft azure'],
  'GCP': ['gcp', 'google cloud', 'google cloud platform'],
  
  'Docker': ['docker', 'containerization'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'Terraform': ['terraform'],
  'CI/CD': ['ci/cd', 'continuous integration', 'continuous deployment', 'github actions', 'jenkins', 'gitlab ci'],
  'Git': ['git', 'version control'],
  
  'SQL': ['sql'],
  'MySQL': ['mysql'],
  'PostgreSQL': ['postgresql', 'postgres'],
  'MongoDB': ['mongodb', 'mongo'],
  'Redis': ['redis'],
  
  'Agile': ['agile', 'scrum', 'kanban'],
  'Leadership': ['leadership', 'mentoring', 'team lead'],
  'Communication': ['communication', 'written communication', 'verbal communication'],
  'Problem Solving': ['problem solving', 'troubleshooting'],
};

export interface ExtractedKeyword {
  normalized: string;
  originalMatches: string[];
}

export function extractKeywords(text: string): ExtractedKeyword[] {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const foundKeywords: ExtractedKeyword[] = [];
  
  // We use word boundaries where possible, but some terms like 'c++' or 'next.js' need special care
  // To keep it simple and deterministic, we search for exact substring matches bounded by spaces/punctuation
  
  for (const [normalized, variations] of Object.entries(SKILL_DICTIONARY)) {
    const originalMatches: string[] = [];
    
    for (const variation of variations) {
      // Escape special regex chars like . or + 
      const escaped = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Look for the variation with word boundaries (or start/end of string, or punctuation)
      // We use a custom boundary check because \b doesn't work well with C++ or C#
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:[^a-zA-Z0-9_#+]|$)`, 'i');
      
      if (regex.test(lowerText)) {
        originalMatches.push(variation);
      }
    }
    
    if (originalMatches.length > 0) {
      foundKeywords.push({
        normalized,
        originalMatches
      });
    }
  }
  
  return foundKeywords;
}
