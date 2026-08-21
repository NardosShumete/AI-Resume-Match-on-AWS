import { describe, it, expect } from 'vitest';
import { countWords, countCharacters } from '../src/utils/pdf/countWords';
import { normalizePdfText } from '../src/utils/pdf/normalizePdfText';
import { validatePdf } from '../src/utils/pdf/validatePdf';

describe('PDF Parser Utils & Security Audit Unit Tests', () => {
  it('1. Correctly counts words and characters', () => {
    const text = 'Full-Stack Developer with React, TypeScript, and AWS skills.';
    expect(countWords(text)).toBe(8);
    expect(countCharacters(text)).toBe(text.length);
  });

  it('2. Normalizes raw PDF text (removes multiple spaces and weird line breaks)', () => {
    const raw = 'John    Doe \r\n\r\n Software   Engineer  ';
    const normalized = normalizePdfText(raw);
    expect(normalized).not.toContain('   ');
    expect(normalized).toContain('John Doe');
  });

  it('3. PDF Validator validates size and file type properly', () => {
    const validFile = new File(['%PDF-1.4 test content'], 'resume.pdf', { type: 'application/pdf' });
    expect(validatePdf(validFile).valid).toBe(true);

    const invalidFile = new File(['text content'], 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    expect(validatePdf(invalidFile).valid).toBe(false);
  });

  it('4. Security Audit: GEMINI_API_KEY is not exposed in frontend client variables', () => {
    // import.meta.env should not expose GEMINI_API_KEY directly to the browser
    const env = (import.meta as any).env || {};
    expect(env.VITE_GEMINI_API_KEY).toBeUndefined();
    expect(process.env.VITE_GEMINI_API_KEY).toBeUndefined();
  });
});
