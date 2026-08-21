export const normalizePdfText = (rawText: string): string => {
  if (!rawText) return '';

  return rawText
    // Replace multiple spaces with a single space
    .replace(/[^\S\r\n]+/g, ' ')
    // Replace 3 or more consecutive newlines with exactly 2 newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim spaces at the beginning and end of each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();
};
