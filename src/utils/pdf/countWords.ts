export const countWords = (text: string): number => {
  if (!text) return 0;
  // Match one or more word characters or punctuation combined to form words
  const words = text.trim().match(/\S+/g);
  return words ? words.length : 0;
};

export const countCharacters = (text: string): number => {
  if (!text) return 0;
  return text.trim().length;
};
