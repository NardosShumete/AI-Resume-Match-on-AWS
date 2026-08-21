export type PdfParserState = 'idle' | 'parsing' | 'success' | 'error';

export interface PdfMetadata {
  fileName: string;
  fileSize: number;
  pageCount: number;
  wordCount: number;
  characterCount: number;
  extractedText: string;
  previewUrl: string;
}
