import { useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// Vite-specific import for the worker URL. This ensures the worker is correctly resolved in both dev and production.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { useResumeStore } from '../stores/useResumeStore';
import { validatePdf } from '../utils/pdf/validatePdf';
import { renderPdfPreview } from '../utils/pdf/renderPdfPreview';
import { extractPdfText } from '../utils/pdf/extractPdfText';
import { normalizePdfText } from '../utils/pdf/normalizePdfText';
import { countWords, countCharacters } from '../utils/pdf/countWords';

// Initialize the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const usePdfParser = () => {
  const { 
    setResumeFile, 
    setResumeMetadata, 
    setPdfState, 
    setPdfError,
    resumeMetadata,
    resumeFile
  } = useResumeStore();

  const reset = useCallback(() => {
    setResumeFile(null);
    setResumeMetadata(null);
    setPdfState('idle');
    setPdfError(null);
  }, [setResumeFile, setResumeMetadata, setPdfState, setPdfError]);

  const parsePdf = useCallback(async (file: File) => {
    // 1. Reset state & Validate
    reset();
    const validation = validatePdf(file);
    if (!validation.valid) {
      setPdfState('error');
      setPdfError(validation.error || 'Invalid PDF file.');
      return;
    }

    setPdfState('parsing');
    setResumeFile(file);

    try {
      // 2. Load PDF document
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const pageCount = pdf.numPages;

      // 3. Generate Preview (Page 1)
      const previewUrl = await renderPdfPreview(pdf);
      
      // 4. Extract Text
      const rawText = await extractPdfText(pdf);
      
      // 5. Normalize Text
      const extractedText = normalizePdfText(rawText);

      if (!extractedText || extractedText.length < 50) {
        setPdfState('error');
        setPdfError("We couldn't extract readable text from this PDF. Your resume may be scanned/image-based. OCR support will be added in a future phase.");
        return;
      }

      // 6. Calculate Metadata
      const wordCount = countWords(extractedText);
      const characterCount = countCharacters(extractedText);

      // 7. Update Store
      setResumeMetadata({
        fileName: file.name,
        fileSize: file.size,
        pageCount,
        wordCount,
        characterCount,
        extractedText,
        previewUrl: previewUrl || '',
      });
      
      setPdfState('success');
      
    } catch (error) {
      console.error('PDF parsing error:', error);
      setPdfState('error');
      setPdfError(
        error instanceof Error 
          ? `Unable to read this PDF: ${error.message}` 
          : 'An unexpected error occurred while parsing the PDF.'
      );
    }
  }, [reset, setPdfState, setResumeFile, setResumeMetadata, setPdfError]);

  return {
    parsePdf,
    reset,
  };
};
