import React from 'react';
import { Layers } from 'lucide-react';
import type { ScoreBreakdown as BreakdownType } from '../../types/analysis';
import { useLanguageStore } from '../../i18n/useLanguageStore';

interface ScoreBreakdownProps {
  categories: BreakdownType;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ categories }) => {
  const { t } = useLanguageStore();

  const metrics = [
    { label: t.breakdown.keywordMatch, val: categories.keywordMatch, color: 'bg-emerald-500' },
    { label: t.breakdown.skillsMatch, val: categories.skillsMatch, color: 'bg-indigo-500' },
    { label: t.breakdown.experienceRelevance, val: categories.experienceRelevance, color: 'bg-cyan-500' },
    { label: t.breakdown.formatting, val: categories.formatting, color: 'bg-violet-500' },
    { label: t.breakdown.impact, val: categories.impact, color: 'bg-amber-500' },
  ];

  return (
    <div className="linear-card rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-500" />
          {t.results.matchBreakdown}
        </h3>
        <span className="text-xs text-muted-foreground font-semibold">5 / 5</span>
      </div>

      <div className="space-y-3.5">
        {metrics.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">{item.label}</span>
              <span className="font-bold text-foreground tabular-nums">{item.val}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
