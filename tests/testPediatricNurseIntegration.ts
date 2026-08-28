import { analyzeResume } from '../backend/src/analysis/engine.js';

const ALEX_MORGAN_RESUME = `Alex Morgan
Senior Full-Stack Engineer
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA | github.com/alexmorgan | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 5+ years of experience architecting and delivering scalable cloud web applications using React, TypeScript, Node.js, and AWS. Proven track record of improving application latency by 35% and boosting engineering velocity through CI/CD automation and test-driven development.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
- Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, Webpack, Responsive Design
- Backend & APIs: Node.js, Express, REST APIs, GraphQL, Microservices Architecture
- Cloud & DevOps: AWS (Lambda, S3, ECS, CloudWatch), Docker, GitHub Actions, CI/CD
- Databases: PostgreSQL, MongoDB, Redis, Prisma ORM
- Testing & Quality: Jest, React Testing Library, Cypress, TDD, Agile/Scrum

PROFESSIONAL EXPERIENCE
Senior Full-Stack Developer | CloudScale Solutions | Jan 2022 – Present
- Architected and deployed scalable customer-facing dashboard in React & TypeScript serving 150k+ daily active users, reducing initial page load time by 40% via code splitting and memoization.
- Engineered 12+ secure microservices and RESTful API endpoints using Node.js and PostgreSQL, achieving 99.98% service uptime and sub-100ms response times.
- Spearheaded migration of legacy deployment pipelines to Docker and GitHub Actions CI/CD on AWS ECS, reducing deployment cycle times from 45 minutes to 8 minutes.
- Implemented comprehensive end-to-end testing suites with Jest and Cypress, elevating overall test coverage from 62% to 88%.

Software Engineer | Apex Digital Labs | Jun 2019 – Dec 2021
- Developed interactive web components and responsive single-page applications using React, Redux, and REST APIs for enterprise fintech clients.
- Optimized database indexing and query structures in PostgreSQL, decreasing average database query latency by 30%.
- Integrated third-party payment gateways and webhook ingestion pipelines handling over $2M in monthly transaction volume.
- Collaborated in cross-functional agile sprints with UX designers and product managers to deliver 6 major feature releases ahead of schedule.

EDUCATION & CERTIFICATIONS
- Bachelor of Science in Computer Science | University of California, Berkeley (2019)
- AWS Certified Solutions Architect – Associate (2023)
- Meta Front-End Developer Professional Certificate (2021)`;

const TARGET_JOB_DESCRIPTION = `who have been experience for 1 year in hospital and have GPA above 3.5.`;

async function run() {
  console.log('--- Testing Pediatric Nurse (AB Hospital) vs Alex Morgan SWE Resume ---');
  
  const result = await analyzeResume(
    ALEX_MORGAN_RESUME,
    TARGET_JOB_DESCRIPTION,
    'Alex Morgan - Resume.pdf',
    'AB Hospital',
    'Pediatric Nurse',
    'en'
  );

  console.log('Result ATS Score:', result.atsScore);
  console.log('Result Status:', result.status);
  console.log('Critical Mismatch Flag:', result.criticalMismatch);
  console.log('Role Domain:', result.roleDomain);
  console.log('Score Breakdown:', JSON.stringify(result.scoreBreakdown, null, 2));
  console.log('Matched Keywords:', result.matchedKeywords);
  console.log('Missing Keywords:', result.missingKeywords);
  console.log('Matched Skills:', result.matchedSkills);
  console.log('Missing Skills:', result.missingSkills);
  console.log('Required Qualifications:', result.requiredQualifications);
  console.log('AI Recommendations:', result.recommendations);
}

run().catch(console.error);
