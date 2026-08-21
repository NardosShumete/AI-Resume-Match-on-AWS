import React from 'react';
import { Check, AlertCircle, Tag } from 'lucide-react';

interface KeywordSectionProps {
  matched: string[];
  missing: string[];
}

export const KeywordSection: React.FC<KeywordSectionProps> = ({ matched, missing }) => {
  return (
    <div className="linear-card rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-indigo-500" />
          Keyword Coverage Matrix
        </h3>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {Math.round((matched.length / (matched.length + missing.length || 1)) * 100)}% Coverage
        </span>
      </div>

      {/* Matched Keywords */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Detected Keywords ({matched.length})
          </span>
          <span className="text-[11px] text-muted-foreground">High ATS Weight</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {matched.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Missing Keywords ({missing.length})
          </span>
          <span className="text-[11px] text-rose-500 font-semibold">Recommended to Add</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {missing.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {kw}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
          💡 Adding 2-3 of these missing terms to your project bullets or technical skills section can increase your match score by +12%.
        </p>
      </div>

    </div>
  );
};
