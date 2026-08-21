import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ArrowRight, Building2, Check } from 'lucide-react';
import type { AnalysisResult } from '../../types/analysis';
import { useResumeStore } from '../../stores/useResumeStore';

interface ResumeCardProps {
  analysis: AnalysisResult;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ analysis }) => {
  const { setCurrentAnalysis } = useResumeStore();

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (analysis.atsScore / 100) * circumference;

  const isExcellent = analysis.atsScore >= 85;
  const isGood = analysis.atsScore >= 70;

  return (
    <div className="linear-card card-hover rounded-2xl p-5 flex flex-col justify-between group border border-zinc-200/80 dark:border-zinc-800">
      
      {/* Top Meta */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Company Badge Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center flex-shrink-0">
              {analysis.companyName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {analysis.jobTitle}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Building2 className="w-3 h-3" />
                {analysis.companyName}
              </p>
            </div>
          </div>

          {/* Radial Score Gauge */}
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 54 54" className="w-full h-full -rotate-90">
              <circle cx="27" cy="27" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-200 dark:text-zinc-800" />
              <circle
                cx="27" cy="27" r={radius}
                fill="none" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={isExcellent ? 'text-emerald-500' : isGood ? 'text-indigo-500' : 'text-amber-500'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold tabular-nums text-foreground">{analysis.atsScore}%</span>
            </div>
          </div>
        </div>

        {/* File pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 text-muted-foreground text-xs mb-3.5 w-fit">
          <FileText className="w-3 h-3" />
          <span className="truncate max-w-[200px]">{analysis.resumeName}</span>
        </div>

        {/* Keyword Tags */}
        <div className="space-y-1.5 mb-4">
          <div className="flex flex-wrap gap-1.5">
            {analysis.matchedKeywords.slice(0, 3).map((kw) => (
              <span
                key={kw.keyword}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                {kw.keyword}
              </span>
            ))}
            {analysis.missingKeywords.slice(0, 1).map((kw) => (
              <span
                key={kw.keyword}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              >
                +{kw.keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3.5 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between mt-2">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {analysis.date}
        </span>

        <Link
          to="/results"
          onClick={() => setCurrentAnalysis(analysis.id)}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
        >
          View Full Report
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
};
