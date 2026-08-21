import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('./public/sample-resume.pdf'));

doc.fontSize(24).text('Alex Chen', { align: 'center' });
doc.fontSize(14).text('Senior Frontend Developer', { align: 'center' });
doc.moveDown();

doc.fontSize(12).text('Summary:', { underline: true });
doc.text('Passionate and detail-oriented frontend developer with over 5 years of experience building modern, responsive, and accessible web applications using React, TypeScript, and Vite. Strong focus on UI/UX, performance optimization, and writing clean, maintainable code.');
doc.moveDown();

doc.text('Experience:', { underline: true });
doc.text('Tech Innovators Inc. - Senior Frontend Developer (2023 - Present)');
doc.text('- Led the migration of a legacy dashboard to a modern React + Vite stack.');
doc.text('- Improved application loading time by 40% using code splitting and lazy loading.');
doc.moveDown();

doc.text('Skills:', { underline: true });
doc.text('JavaScript, TypeScript, React, Next.js, Tailwind CSS, Zustand, Redux, HTML5, CSS3, Webpack, Vite, Git, Jest, Cypress.');
doc.moveDown();

doc.end();
console.log('Sample PDF generated at ./public/sample-resume.pdf');
