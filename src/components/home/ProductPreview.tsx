import React, { useState } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, ArrowUpRight, Check, FileCode } from 'lucide-react';
export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'match' | 'diff'>('diff');
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (0.87 * circumference);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer Glow frame */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Main Glass/Zinc Card */}
      <div className="linear-card rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-zinc-950/90 text-foreground">

        {/* Window Topbar */}
        <div className="px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] code-font text-muted-foreground ml-2 flex items-center gap-1.5">
              <FileCode className="w-3 h-3 text-indigo-500" />
              resume_analysis_v2.json
            </span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800/60 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-2 py-0.5 rounded-md transition-all ${activeTab === 'diff'
                  ? 'bg-white dark:bg-zinc-700 text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              AI Rewriter
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`px-2 py-0.5 rounded-md transition-all ${activeTab === 'match'
                  ? 'bg-white dark:bg-zinc-700 text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              ATS Breakdown
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">

          {/* Header Summary Pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Senior Frontend Engineer</span>
                <span className="text-[10px] font-medium text-muted-foreground">@ Stripe</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Matched against 42 job requirements</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <Check className="w-3 h-3 stroke-[2.5]" />
              87% Score
            </div>
          </div>

          {activeTab === 'diff' ? (
            /* AI Bullet Diff View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Live Resume Bullet Optimization
                </span>
                <span className="text-[10px] font-medium text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  +18% ATS Impact
                </span>
              </div>

              {/* Before Bullet */}
              <div className="p-3 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  <AlertCircle className="w-3 h-3" />
                  Before (Weak ATS Signal)
                </div>
                <p className="text-xs text-muted-foreground line-through decoration-rose-500/60">
                  "Responsible for developing frontend features and working with the design team on UI components."
                </p>
              </div>

              {/* After AI Bullet */}
              <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  <CheckCircle2 className="w-3 h-3" />
                  AI Suggested Rewrite (High Impact)
                </div>
                <p className="text-xs text-foreground font-medium">
                  "Architected <span className="text-indigo-600 dark:text-indigo-400 font-semibold">16+ React & TypeScript</span> components, boosting Core Web Vitals score by <span className="text-emerald-600 dark:text-emerald-400 font-semibold">28%</span> across 1.2M monthly users."
                </p>
              </div>
            </div>
          ) : (
            /* ATS Breakdown View */
            <div className="grid grid-cols-5 gap-3 items-center">
              {/* Radial Dial */}
              <div className="col-span-2 flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 text-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-zinc-200 dark:text-zinc-800" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000"
                      stroke="url(#gradient-hero-card)"
                    />
                    <defs>
                      <linearGradient id="gradient-hero-card" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold tracking-tight text-foreground">87%</span>
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase">ATS Match</span>
                  </div>
                </div>
              </div>

              {/* Progress Rows */}
              <div className="col-span-3 space-y-2">
                {[
                  { label: 'Keyword Match', val: 94, color: 'bg-emerald-500' },
                  { label: 'Skills Alignment', val: 88, color: 'bg-indigo-500' },
                  { label: 'Measurable Impact', val: 78, color: 'bg-cyan-500' },
                  { label: 'ATS Format Score', val: 92, color: 'bg-violet-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] font-semibold mb-0.5">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground">{item.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Preview Grid */}
          <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex items-center justify-between text-[11px] mb-2 font-semibold text-muted-foreground">
              <span>Detected Skills</span>
              <span className="text-indigo-500 hover:underline cursor-pointer flex items-center">
                14 found <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'TypeScript', 'Next.js', 'Tailwind', 'GraphQL'].map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  {kw}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold border border-amber-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Docker (Missing)
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
