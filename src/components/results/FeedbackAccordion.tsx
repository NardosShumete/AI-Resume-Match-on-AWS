import React, { useState } from 'react';
import { ChevronDown, TrendingUp, FileEdit, User, Sparkles, Copy, Check, AlertCircle } from 'lucide-react';
import type { AiRecommendation, BulletRewrite, SkillsGap } from '../../types/analysis';

interface FeedbackAccordionProps {
  recommendations: AiRecommendation[];
  bulletRewrites: BulletRewrite[];
  skillsGap: SkillsGap[];
}

export const FeedbackAccordion: React.FC<FeedbackAccordionProps> = ({ 
  recommendations, 
  bulletRewrites, 
  skillsGap 
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'Experience Improvements': true,
    'Formatting & Tone': true,
    'Skills Gap Analysis': true,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggle = (category: string) => {
    setOpenItems((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderAccordionItem = (
    title: string, 
    itemsCount: number, 
    icon: React.ReactNode, 
    color: string, 
    badge: string,
    children: React.ReactNode
  ) => {
    if (itemsCount === 0) return null;
    const isOpen = openItems[title] ?? false;

    return (
      <div className="linear-card rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 transition-all">
        {/* Header Button */}
        <button
          onClick={() => toggle(title)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ${color} border border-zinc-200 dark:border-zinc-700`}>
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{title}</h3>
              <span className="text-[11px] text-muted-foreground">{itemsCount} items detected</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
              {badge}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Accordion Body */}
        {isOpen && (
          <div className="p-5 pt-0 border-t border-zinc-200/80 dark:border-zinc-800 space-y-4 mt-3">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">Actionable ATS Improvements</h2>
          <p className="text-xs text-muted-foreground">Prioritized checklist to maximize ATS parser pass-rate.</p>
        </div>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
          {recommendations.length + bulletRewrites.length + skillsGap.length} Fixes Available
        </span>
      </div>

      {/* Bullet Rewrites */}
      {renderAccordionItem(
        'Experience Improvements',
        bulletRewrites.length,
        <TrendingUp className="w-4 h-4" />,
        'text-indigo-500',
        'High Impact',
        bulletRewrites.map((item, idx) => {
          const id = `br-${idx}`;
          return (
            <div key={id} className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  Weak Bullet Point Detected
                </div>
                <div className="text-xs text-muted-foreground pl-5 leading-relaxed bg-white dark:bg-zinc-800 p-2 rounded-md mt-1 italic border border-zinc-200 dark:border-zinc-700">
                  "{item.original}"
                </div>
                <p className="text-xs text-muted-foreground pl-5 leading-relaxed mt-2">
                  <strong className="text-foreground">Why it matters:</strong> {item.reason}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs leading-relaxed text-foreground">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Recommended Rewrite (XYZ Formula):</span>{' '}
                    {item.improved}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(id, item.improved)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
                  title="Copy recommendation"
                >
                  {copiedId === id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Formatting & General Recommendations */}
      {renderAccordionItem(
        'Formatting & Optimization',
        recommendations.length,
        <FileEdit className="w-4 h-4" />,
        'text-violet-500',
        'ATS Parser Fix',
        recommendations.map((item, idx) => {
          const id = `rec-${idx}`;
          return (
            <div key={id} className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  {item.issue}
                </div>
                <p className="text-xs text-muted-foreground pl-5 leading-relaxed">
                  <strong className="text-foreground">Priority:</strong> <span className="uppercase">{item.priority}</span>
                </p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs leading-relaxed text-foreground">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Recommendation:</span>{' '}
                    {item.recommendation}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Skills Gap Analysis */}
      {renderAccordionItem(
        'Skills Gap Analysis',
        skillsGap.length,
        <User className="w-4 h-4" />,
        'text-cyan-500',
        'Qualification',
        skillsGap.map((item, idx) => {
          const id = `sg-${idx}`;
          return (
            <div key={id} className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  Missing Key Skill: {item.skill}
                </div>
                <p className="text-xs text-muted-foreground pl-5 leading-relaxed">
                  <strong className="text-foreground">Importance:</strong> <span className="uppercase">{item.importance}</span>
                </p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs leading-relaxed text-foreground">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">How to bridge this gap:</span>{' '}
                    {item.recommendation}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
