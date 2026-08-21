export const validatePdf = (file: File | null): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file extension as a fallback to mime type
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  const isPdfMime = file.type === 'application/pdf';

  if (!isPdfExtension && !isPdfMime) {
    return { valid: false, error: 'Please upload a PDF file.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected PDF is empty.' };
  }

  const MAX_SIZE_MB = 20;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `This resume is larger than the ${MAX_SIZE_MB} MB limit.` };
  }

  return { valid: true };
};
