// Multi-domain skill and credential dictionary
const MULTI_DOMAIN_DICTIONARY: Record<string, string[]> = {
  // --- TECH & SOFTWARE ---
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
  'Git': ['git', 'version control', 'github', 'gitlab'],
  'SQL': ['sql'],
  'PostgreSQL': ['postgresql', 'postgres'],
  'MySQL': ['mysql'],
  'MongoDB': ['mongodb', 'mongo'],
  'Redis': ['redis'],
  'GraphQL': ['graphql'],
  'REST APIs': ['rest api', 'rest apis', 'restful api', 'restful apis', 'rest'],
  'Microservices': ['microservices', 'microservice'],

  // --- HEALTHCARE, NURSING & MEDICAL ---
  'Nursing': ['nursing', 'nurse', 'registered nurse', 'rn', 'bsn', 'msn', 'lpn'],
  'Pediatric Care': ['pediatric', 'pediatrics', 'pediatric nurse', 'pediatric care'],
  'Hospital Experience': ['hospital', 'hospital experience', 'clinical setting', 'inpatient'],
  'Clinical Experience': ['clinical', 'clinical experience', 'clinical practice', 'clinical skills'],
  'Patient Care': ['patient care', 'patient assessment', 'direct patient care', 'bedside care'],
  'ICU / Critical Care': ['icu', 'intensive care', 'critical care', 'picu', 'nicu'],
  'Emergency Care': ['emergency', 'er', 'trauma', 'triage'],
  'BLS / ACLS Certification': ['bls', 'acls', 'cpr', 'pals', 'basic life support', 'advanced cardiac life support'],
  'Medication Administration': ['medication administration', 'pharmacology', 'iv therapy', 'dosages'],
  'EHR / EMR Systems': ['ehr', 'emr', 'epic', 'cerner', 'electronic health records', 'medical records'],
  'Vital Signs Monitoring': ['vital signs', 'triage', 'patient monitoring', 'telemetry'],
  'Doctor / Physician': ['doctor', 'physician', 'medical doctor', 'md', 'residency', 'fellowship'],

  // --- CYBERSECURITY & NETWORKING ---
  'Cybersecurity': ['cybersecurity', 'information security', 'infosec', 'cyber security'],
  'Firewall Management': ['firewall', 'firewalls', 'palo alto', 'fortinet', 'cisco asa'],
  'Malware Analysis': ['malware analysis', 'reverse engineering', 'threat analysis'],
  'CCTV & Surveillance': ['cctv', 'surveillance', 'video surveillance', 'camera installation'],
  'Network Administration': ['network installation', 'networking', 'tcp/ip', 'dns', 'dhcp', 'vpn', 'routing', 'switching'],
  'Access Control': ['access control', 'identity management', 'iam', 'active directory'],
  'Penetration Testing': ['penetration testing', 'pen testing', 'ethical hacking', 'vulnerability assessment'],
  'SIEM / SOC': ['siem', 'soc', 'splunk', 'qradar', 'incident response'],

  // --- FINANCE & ACCOUNTING ---
  'Financial Analysis': ['financial analysis', 'financial modeling', 'forecasting', 'valuation'],
  'Accounting & GAAP': ['gaap', 'accounting', 'general ledger', 'reconciliation', 'cpa'],
  'Audit & Compliance': ['internal audit', 'external audit', 'compliance', 'sox'],

  // --- ACADEMIC & GENERAL QUALIFICATIONS ---
  'GPA Requirement': ['gpa above 3.5', 'gpa > 3.5', 'gpa', 'grade point average', 'gpa 3.5', 'academic standing'],
  'Bachelor Degree': ['bachelor', 'b.s.', 'b.a.', 'bs in computer science', 'bsn', 'undergraduate degree'],
  'Master Degree': ['master', 'm.s.', 'm.a.', 'msn', 'mba', 'postgraduate'],
  '1+ Year Experience': ['1 year', '1+ year', '1+ years', 'one year experience'],
  '3+ Years Experience': ['3+ years', '3 years', 'three years experience'],
  '5+ Years Experience': ['5+ years', '5 years', 'five years experience'],
};

// Common generic stop words to ignore during dynamic term extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  // Generic non-informative filler terms
  'work', 'working', 'worked', 'experience', 'experienced', 'seeking', 'responsibilities', 'responsibility', 'required', 'requirement',
  'requirements', 'candidate', 'position', 'role', 'job', 'team', 'company', 'looking', 'join', 'must', 'skills', 'ability', 'proficient'
]);

export interface ExtractedKeyword {
  normalized: string;
  originalMatches: string[];
}

export function extractKeywords(text: string): ExtractedKeyword[] {
  if (!text || typeof text !== 'string') return [];
  
  const lowerText = text.toLowerCase();
  const foundKeywords: ExtractedKeyword[] = [];
  const foundSet = new Set<string>();
  
  // 1. Check known domain dictionary
  for (const [normalized, variations] of Object.entries(MULTI_DOMAIN_DICTIONARY)) {
    const originalMatches: string[] = [];
    
    for (const variation of variations) {
      const escaped = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
      foundSet.add(normalized.toLowerCase());
    }
  }

  // 2. Dynamic multi-word / significant phrase extraction
  // Extract key 2-to-3 word phrases and meaningful acronyms not caught in dictionary
  const cleaned = text.replace(/[^a-zA-Z0-9\s.+-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ').filter(w => w.length > 1);

  for (let i = 0; i < words.length; i++) {
    const w1 = words[i].toLowerCase();
    
    // Check specific qualification phrases like "gpa above 3.5", "1 year in hospital"
    if (i < words.length - 1) {
      const w2 = words[i + 1].toLowerCase();
      const twoGram = `${w1} ${w2}`;
      
      // If contains numbers and nouns (e.g. "1 year", "3.5 gpa")
      if (/\d/.test(twoGram) && !foundSet.has(twoGram)) {
        if (!STOP_WORDS.has(w1) || !STOP_WORDS.has(w2)) {
          foundKeywords.push({
            normalized: twoGram,
            originalMatches: [twoGram]
          });
          foundSet.add(twoGram);
        }
      }
    }

    // Capitalized or distinct technical/domain acronyms (e.g., GPA, ICU, CCTV, HIPAA, BSN)
    const rawWord = words[i];
    if (/^[A-Z]{2,5}$/.test(rawWord) && !STOP_WORDS.has(w1) && !foundSet.has(w1)) {
      foundKeywords.push({
        normalized: rawWord,
        originalMatches: [rawWord]
      });
      foundSet.add(w1);
    }
  }
  
  return foundKeywords;
}

