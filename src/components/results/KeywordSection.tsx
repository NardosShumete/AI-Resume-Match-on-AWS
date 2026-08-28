import React from 'react';
import { Check, AlertCircle, Tag, Flame } from 'lucide-react';
import type { KeywordMatch, MissingKeyword } from '../../types/analysis';
import { useLanguageStore } from '../../i18n/useLanguageStore';
import { formatScore } from '../../utils/scoreFormatter';

interface KeywordSectionProps {
  matched?: KeywordMatch[];
  missing?: MissingKeyword[];
}

export const KeywordSection: React.FC<KeywordSectionProps> = ({ matched = [], missing = [] }) => {
  const { t } = useLanguageStore();

  const safeMatched = Array.isArray(matched) ? matched : [];
  const safeMissing = Array.isArray(missing) ? missing : [];
  const totalCount = safeMatched.length + safeMissing.length;
  const percentage = totalCount > 0 ? Math.round((safeMatched.length / totalCount) * 100) : 0;

  return (
    <div className="linear-card rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-indigo-500" />
          {t.results.keywordMatching}
        </h3>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          {formatScore(percentage)}
        </span>
      </div>

      {/* Matched Keywords */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {t.results.matchedKeywords} ({safeMatched.length})
          </span>
        </div>

        {safeMatched.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {safeMatched.map((kw) => (
              <span
                key={kw.keyword}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
                  kw.importance === 'high' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                {kw.keyword}
                {kw.importance === 'high' && <Flame className="w-3 h-3 ml-0.5 opacity-70" />}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No target keywords matched in resume.</p>
        )}
      </div>

      {/* Missing Keywords */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {t.results.missingKeywords} ({safeMissing.length})
          </span>
        </div>

        {safeMissing.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {safeMissing.map((kw) => (
              <span
                key={kw.keyword}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
                  kw.importance === 'high'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}
              >
                <AlertCircle className="w-3 h-3" />
                {kw.keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No missing critical keywords identified.</p>
        )}
      </div>

    </div>
  );
};

