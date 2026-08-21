import React from 'react';
import { Target, Search, Sparkles, TrendingUp, Check, Layers, ArrowUpRight } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  return (
    <section className="py-20 border-t border-zinc-200/60 dark:border-zinc-800/60">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Engine Capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-3">
          Engineered to pass every ATS filter
        </h2>
        <p className="text-muted-foreground text-base">
          Applicant Tracking Systems reject over 75% of resumes before a human recruiter even sees them. Here is how ResuMatch AI helps you win.
        </p>
      </div>

      {/* Bento Grid (2x2) */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Card 1: ATS Match Algorithm */}
        <div className="linear-card card-hover rounded-2xl p-7 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                99.4% Accuracy
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Deep ATS Parser Emulation
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We simulate exact parsing algorithms from top tier ATS providers (Greenhouse, Lever, Workday, Taleo) to test formatting, heading hierarchy, and date extraction.
            </p>
          </div>

          {/* Mini Interactive Visual */}
          <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Format & Hierarchy Score
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">98 / 100</span>
            </div>
            <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full w-[98%]" />
            </div>
          </div>
        </div>

        {/* Card 2: Keyword Intelligence */}
        <div className="linear-card card-hover rounded-2xl p-7 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                Weighted Matching
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Weighted Keyword Heatmap
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Not all keywords carry the same weight. Our NLP model prioritizes core requirements over generic buzzwords so you know exactly what to add.
            </p>
          </div>

          {/* Mini Keyword Tag Visual */}
          <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[2.5]" /> React 19 (High Weight)
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[2.5]" /> TypeScript (Core)
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              + AWS Cloud (Missing)
            </span>
          </div>
        </div>

        {/* Card 3: AI Bullet Optimizer */}
        <div className="linear-card card-hover rounded-2xl p-7 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                Action-Driven
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Action & Metric Bullet Re-writer
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transform passive duty statements into high-converting quantified accomplishments using the Google X-Y-Z formula (Accomplished [X], measured by [Y], by doing [Z]).
            </p>
          </div>

          {/* Mini Bullet visual */}
          <div className="mt-6 p-3.5 rounded-xl bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/20 text-xs">
            <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block mb-1">
              Google X-Y-Z Formula
            </span>
            <p className="text-foreground font-medium">
              "Increased API throughput by <span className="text-emerald-500 font-bold">45%</span> by migrating REST endpoints to GraphQL."
            </p>
          </div>
        </div>

        {/* Card 4: Recruiter Match & Seniority Score */}
        <div className="linear-card card-hover rounded-2xl p-7 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                Seniority Gap
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Role Fit & Skills Gap Analysis
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Identify where your experience level sits relative to the employer's expectations and get actionable suggestions on how to bridge qualifications.
            </p>
          </div>

          {/* Mini seniority visual */}
          <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-muted-foreground">Target Role Level:</span>
              <p className="font-bold text-foreground">Senior Engineer (5+ YOE)</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Optimal Fit <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
