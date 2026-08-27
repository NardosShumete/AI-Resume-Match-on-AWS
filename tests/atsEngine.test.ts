import { describe, it, expect } from 'vitest';
import { calculateAtsScore } from '../backend/src/analysis/scoring/calculateAtsScore';
import { calculateKeywordScore } from '../backend/src/analysis/scoring/keywordScore';
import { calculateSkillsScore } from '../backend/src/analysis/scoring/skillsScore';
import { calculateFormattingScore } from '../backend/src/analysis/scoring/formattingScore';
import { calculateImpactScore } from '../backend/src/analysis/scoring/impactScore';
import { matchKeywords } from '../backend/src/analysis/matchKeywords';
import { parseResumeSections } from '../backend/src/analysis/resumeParser';
import { parseJobDescription } from '../backend/src/analysis/jobDescriptionParser';

describe('ATS Engine Unit Tests', () => {
  const sampleResumeText = `
Alex Morgan
Senior Full-Stack Engineer
alex@example.com | (555) 019-2831 | San Francisco, CA

SUMMARY
Senior Software Engineer with 5+ years of experience in React, TypeScript, Node.js, and AWS.

SKILLS
React, TypeScript, JavaScript, Node.js, Express, REST API, GraphQL, PostgreSQL, AWS, Docker, Git, Jest

EXPERIENCE
Senior Software Engineer | TechCorp | 2021 - Present
- Architected React and TypeScript web app serving 100k daily users, reducing page load time by 35%.
- Built REST APIs and Node.js microservices hosted on AWS Lambda and ECS.
- Improved CI/CD pipelines using GitHub Actions, decreasing deployment duration by 40%.
`;

  const sampleJobDescription = `
We are looking for a Senior Full-Stack Engineer with experience in React, TypeScript, Node.js, REST API, and AWS.
Requirements:
- 4+ years of professional software development experience.
- Strong proficiency in React, TypeScript, and Node.js.
- Cloud experience with AWS and Docker containers.
- Database skills with PostgreSQL.
`;

  it('1. Calculates high score for strong resume/job match', () => {
    const { matchedKeywords, missingKeywords, matchedSkills, missingSkills } = matchKeywords(sampleResumeText, sampleJobDescription);
    const keywordScore = calculateKeywordScore(matchedKeywords, missingKeywords);
    const skillsScore = calculateSkillsScore(matchedSkills, missingSkills);
    const parsedResume = parseResumeSections(sampleResumeText);
    const parsedJd = parseJobDescription(sampleJobDescription);
    const formattingScore = calculateFormattingScore(sampleResumeText);
    const impactScore = calculateImpactScore(sampleResumeText);

    const breakdown = {
      roleCompatibility: 80,
      requiredQualifications: 90,
      skillsMatch: skillsScore,
      experienceRelevance: 80,
      keywordMatch: keywordScore,
      resumeQuality: (formattingScore + impactScore) / 2
    };

    const overallScore = calculateAtsScore(breakdown);
    expect(overallScore).toBeGreaterThan(70);
    expect(matchedKeywords.length).toBeGreaterThan(0);
  });

  it('2. Calculates low score for weak resume/job match', () => {
    const weakResume = 'Barista at Coffee Shop. Served coffee and handled cashier tasks for 2 years.';
    const { matchedKeywords, missingKeywords } = matchKeywords(weakResume, sampleJobDescription);
    const keywordScore = calculateKeywordScore(matchedKeywords, missingKeywords);
    expect(keywordScore).toBeLessThan(40);
  });

  it('3. Handles partial keyword matching', () => {
    const partialResume = 'Experience with React and JavaScript.';
    const { matchedKeywords } = matchKeywords(partialResume, sampleJobDescription);
    expect(matchedKeywords.some(k => k.keyword.toLowerCase() === 'react')).toBe(true);
  });

  it('4. Correctly identifies missing skills', () => {
    const noCloudResume = 'Developer with React, Node.js, and HTML experience.';
    const { missingSkills } = matchKeywords(noCloudResume, sampleJobDescription);
    expect(missingSkills.length).toBeGreaterThan(0);
  });

  it('5. Ignores case differences ("react" vs "REACT" vs "React")', () => {
    const upperResume = 'Proficient in REACT, TYPESCRIPT, and NODE.JS';
    const { matchedKeywords } = matchKeywords(upperResume, sampleJobDescription);
    expect(matchedKeywords.length).toBeGreaterThan(0);
  });

  it('6. Handles duplicate keywords gracefully', () => {
    const dupResume = 'React React React TypeScript TypeScript Node.js Node.js';
    const { matchedKeywords } = matchKeywords(dupResume, sampleJobDescription);
    const reactMatches = matchedKeywords.filter(k => k.keyword.toLowerCase() === 'react');
    expect(reactMatches.length).toBe(1);
  });

  it('7. Handles empty resume text safely', () => {
    const { matchedKeywords, missingKeywords } = matchKeywords('', sampleJobDescription);
    const score = calculateKeywordScore(matchedKeywords, missingKeywords);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('8. Handles empty job description text safely', () => {
    const { matchedKeywords } = matchKeywords(sampleResumeText, '');
    expect(matchedKeywords.length).toBe(0);
  });

  it('9. Handles very short resume text safely', () => {
    const formatting = calculateFormattingScore('Short resume');
    expect(formatting).toBeGreaterThanOrEqual(0);
  });

  it('10. Handles large resume text (> 15k chars)', () => {
    const largeResume = sampleResumeText.repeat(50);
    const { matchedKeywords } = matchKeywords(largeResume, sampleJobDescription);
    expect(matchedKeywords.length).toBeGreaterThan(0);
  });

  it('11. Handles special characters in tech skills (C++, C#, .NET, Node.js)', () => {
    const techResume = 'Experience with C++, C#, .NET, and Node.js';
    const techJd = 'Looking for C++ and .NET developers';
    const { matchedKeywords } = matchKeywords(techResume, techJd);
    expect(matchedKeywords.length).toBeGreaterThan(0);
  });

  it('12. Produces deterministic output for identical input', () => {
    const run1 = matchKeywords(sampleResumeText, sampleJobDescription);
    const run2 = matchKeywords(sampleResumeText, sampleJobDescription);
    expect(run1).toEqual(run2);
  });
});
