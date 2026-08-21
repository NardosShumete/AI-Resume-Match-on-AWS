import type { PDFDocumentProxy, TextItem } from 'pdfjs-dist/types/src/display/api';

export const extractPdfText = async (pdf: PDFDocumentProxy): Promise<string> => {
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item) => {
          if ('str' in item) {
            return (item as TextItem).str;
          }
          return '';
        })
        .join(' ');

      fullText += `\n\n--- Page ${i} ---\n\n` + pageText;
    } catch (err) {
      console.warn(`Failed to extract text from page ${i}:`, err);
    }
  }

  return fullText.trim();
};
