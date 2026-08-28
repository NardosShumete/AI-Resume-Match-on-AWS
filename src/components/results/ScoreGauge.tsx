import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLanguageStore } from '../../i18n/useLanguageStore';
import { formatScore, formatScoreNumber } from '../../utils/scoreFormatter';

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const safeScore = formatScoreNumber(score);
  const [animatedScore, setAnimatedScore] = useState(0);
  const { t } = useLanguageStore();

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(safeScore), 100);
    return () => clearTimeout(timer);
  }, [safeScore]);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const isExcellent = safeScore >= 85;
  const isGood = safeScore >= 70;

  const tierText = isExcellent ? t.scoreTiers.strong : isGood ? t.scoreTiers.good : t.scoreTiers.needsImprovement;
  const badgeStyle = isExcellent 
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
    : isGood 
      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
      : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';

  return (
    <div className="linear-card rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 flex flex-col items-center text-center relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t.results.overallMatch}
        </span>
        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeStyle}`}>
          <Trophy className="w-3 h-3" /> {tierText}
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative w-40 h-40 my-2 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-zinc-100 dark:text-zinc-800"
          />
          {/* Animated Progress Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#ats-results-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="ats-results-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-foreground tabular-nums">
            {formatScore(animatedScore)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
            {t.resumeCard.atsScore}
          </span>
        </div>
      </div>

      {/* Summary Description */}
      <div className="mt-2 space-y-1.5">
        <p className="text-sm font-bold text-foreground">
          {tierText}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.results.overallMatch}: {formatScore(animatedScore)}
        </p>
      </div>

    </div>
  );
};

