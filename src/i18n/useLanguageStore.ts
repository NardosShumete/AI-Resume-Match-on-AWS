import { create } from 'zustand';
import type { Language, TranslationDictionary } from './types';
import { en } from './en';
import { am } from './am';

const LANGUAGE_KEY = 'resumatch-language';

const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  am,
};

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'am' || saved === 'en') {
      return saved;
    }
  } catch (err) {
    console.warn('Failed to read language preference from localStorage:', err);
  }
  return 'en';
};

interface LanguageState {
  language: Language;
  t: TranslationDictionary;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getInitialLanguage(),
  t: dictionaries[getInitialLanguage()],
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANGUAGE_KEY, lang);
      } catch (err) {
        console.warn('Failed to persist language preference to localStorage:', err);
      }
    }
    set({
      language: lang,
      t: dictionaries[lang],
    });
  },
}));

export const getTranslation = (lang: Language): TranslationDictionary => {
  return dictionaries[lang] || dictionaries.en;
};
