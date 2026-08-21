export interface ParsedResume {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  other: string;
}

export function parseResumeSections(text: string): ParsedResume {
  const result: ParsedResume = {
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: '',
    other: '',
  };

  if (!text) return result;

  // Split text by lines
  const lines = text.split('\n');

  let currentSection: keyof ParsedResume = 'other';
  let isFirstSection = true;

  // Regular expressions to identify common resume headings
  const sectionRegexes: Record<keyof ParsedResume, RegExp> = {
    summary: /^(summary|profile|professional summary|objective|about me)\s*$/i,
    experience: /^(experience|work experience|professional experience|employment history|work history)\s*$/i,
    education: /^(education|academic background|academic history)\s*$/i,
    skills: /^(skills|technical skills|core competencies|technologies)\s*$/i,
    projects: /^(projects|personal projects|academic projects)\s*$/i,
    certifications: /^(certifications|licenses|awards|honors)\s*$/i,
    other: /^(languages|references|hobbies|interests|volunteer experience)\s*$/i,
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    let matchedSection: keyof ParsedResume | null = null;

    // Check if the line is a heading (usually short and matches our regexes)
    if (trimmedLine.length < 40) {
      for (const [section, regex] of Object.entries(sectionRegexes)) {
        if (regex.test(trimmedLine)) {
          matchedSection = section as keyof ParsedResume;
          break;
        }
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      isFirstSection = false;
      continue; // Don't include the heading itself in the section text
    }

    // Heuristic: If it's the very beginning of the resume before any clear heading, 
    // it's usually contact info or summary. We'll dump it into 'other' or 'summary'
    if (isFirstSection && result.other.length < 500 && trimmedLine.length > 50) {
        // If it's a long paragraph at the start, it's likely a summary
        currentSection = 'summary';
    }

    // Append line to current section
    result[currentSection] += trimmedLine + '\n';
  }

  // Trim all sections
  for (const key of Object.keys(result) as (keyof ParsedResume)[]) {
    result[key] = result[key].trim();
  }

  return result;
}
