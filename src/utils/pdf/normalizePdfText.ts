export const normalizePdfText = (rawText: string, maxLength: number = 25000): string => {
  if (!rawText) return '';

  const cleaned = rawText
    // Strip non-printable control characters, NULL bytes, and replacement glyphs
    .replace(/[\x00-\x08\x0B-\x1F\x7F\uFFFD]/g, '')
    // Replace multiple spaces and tabs with a single space
    .replace(/[ \t]+/g, ' ')
    // Replace 3 or more consecutive newlines with exactly 2 newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim spaces at the beginning and end of each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();

  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength).trim();
  }

  return cleaned;
};
