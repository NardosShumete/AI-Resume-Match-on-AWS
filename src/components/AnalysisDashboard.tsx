import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, AlertCircle, FileEdit, TrendingUp, User } from 'lucide-react';
import { mockAnalysisResult } from '../mockData';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, items, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg mb-3 overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-accent/30 hover:bg-accent/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <h4 className="font-semibold text-card-foreground">{title}</h4>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-card border-t border-border">
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-primary/50" />
                <p className="text-sm text-card-foreground leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const AnalysisDashboard: React.FC = () => {
  const data = mockAnalysisResult;

  // Circular gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  let scoreColor = 'text-green-500';
  let strokeColor = 'stroke-green-500';
  if (data.score < 50) {
    scoreColor = 'text-red-500';
    strokeColor = 'stroke-red-500';
  } else if (data.score < 80) {
    scoreColor = 'text-amber-500';
    strokeColor = 'stroke-amber-500';
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Left Column - Score & Keywords */}
      <div className="md:col-span-1 space-y-6">
        {/* Gauge Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">ATS Match Score</h3>
          
          <div className="relative flex items-center justify-center mb-4">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
              />
              <circle
                className={`transition-all duration-1000 ease-out ${strokeColor}`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>{data.score}%</span>
              <span className="text-xs text-muted-foreground mt-1">Match</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {data.score >= 80 ? 'Excellent match! You are highly likely to pass ATS screening.' : 'Good start, but some improvements needed.'}
          </p>
        </div>

        {/* Keywords Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Keyword Analysis</h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Found Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.matchingKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-md">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <X className="w-4 h-4 text-red-500" /> Missing Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-md">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Recommendations */}
      <div className="md:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-card-foreground">Actionable Feedback</h3>
          </div>
          
          <AccordionItem
            title="Experience Improvements"
            icon={<TrendingUp className="w-5 h-5" />}
            items={data.experienceImprovements}
            defaultOpen={true}
          />
          
          <AccordionItem
            title="Formatting & Tone"
            icon={<FileEdit className="w-5 h-5" />}
            items={data.formattingTone}
          />
          
          <AccordionItem
            title="Skills Gap Analysis"
            icon={<User className="w-5 h-5" />}
            items={data.skillsGap}
          />
        </div>
      </div>

    </div>
  );
};
