import { analyzeResume } from './src/analysis/engine';
import { mockAnalyses } from './src/data/mockAnalyses';

const resumeText = `
John Doe
Software Engineer
john@example.com

SUMMARY
Passionate Senior Software Engineer with 8 years of experience building scalable web applications using React, Node.js, and AWS.

EXPERIENCE
TechCorp - Senior Frontend Engineer
Jan 2019 - Present
- Spearheaded the development of a new React dashboard, increasing user engagement by 40%.
- Managed a team of 4 engineers to deliver features on time.
- Optimized performance, reducing load times by 2 seconds.

EDUCATION
B.S. Computer Science
University of Tech - 2018

SKILLS
JavaScript, TypeScript, React, Node.js, AWS, Docker
`;

const jdText = `
We are looking for a Senior Software Engineer with strong experience in React and Node.js. 
You should have at least 5 years of experience.
Knowledge of AWS and Docker is a big plus.
Must be a strong leader who has managed teams.
`;

async function run() {
  try {
    console.log("Starting analysis...");
    const result = await analyzeResume(resumeText, jdText, 'john_resume.pdf', 'ExampleCorp', 'Senior Software Engineer');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Analysis Error:", error);
  }
}

run();
