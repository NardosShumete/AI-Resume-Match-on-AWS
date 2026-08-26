import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../../i18n/useLanguageStore';
import type { Language } from '../../i18n/types';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold">
      <div className="flex items-center gap-1 pl-1.5 pr-1 text-muted-foreground">
        <Globe className="w-3.5 h-3.5" />
      </div>
      
      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          language === 'en'
            ? 'bg-white dark:bg-zinc-800 text-foreground font-bold shadow-xs border border-zinc-200/60 dark:border-zinc-700/60'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Switch to English"
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => toggleLanguage('am')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          language === 'am'
            ? 'bg-white dark:bg-zinc-800 text-foreground font-bold shadow-xs border border-zinc-200/60 dark:border-zinc-700/60'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="ወደ አማርኛ ቀይር"
      >
        አማ
      </button>
    </div>
  );
};
