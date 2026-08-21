import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, FileText, Building2 } from 'lucide-react';
import { useResumeStore } from '../stores/useResumeStore';
import { ScoreGauge } from '../components/results/ScoreGauge';
import { ScoreBreakdown } from '../components/results/ScoreBreakdown';
import { KeywordSection } from '../components/results/KeywordSection';
import { FeedbackAccordion } from '../components/results/FeedbackAccordion';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResults, reset } = useResumeStore();

  useEffect(() => {
    if (!analysisResults) {
      navigate('/dashboard');
    }
  }, [analysisResults, navigate]);

  if (!analysisResults) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {analysisResults.jobTitle}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-md flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {analysisResults.companyName}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" /> {analysisResults.resumeName}
            </span>
            <span>•</span>
            <span>Analyzed on {analysisResults.date}</span>
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              reset();
              navigate('/analyzer');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-foreground border border-zinc-200 dark:border-zinc-800 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Analyze Another Job
          </button>

          <button
            onClick={() => alert('Exporting detailed ATS report as PDF... (Feature ready in Phase 2)')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Full Audit
          </button>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* Left Column (5 cols): Gauge, Breakdown, Keywords */}
        <div className="lg:col-span-5 space-y-6">
          <ScoreGauge score={analysisResults.atsScore} />
          <ScoreBreakdown categories={analysisResults.scoreBreakdown} />
          <KeywordSection
            matched={analysisResults.matchedKeywords}
            missing={analysisResults.missingKeywords}
          />
        </div>

        {/* Right Column (7 cols): Feedback Accordions */}
        <div className="lg:col-span-7 space-y-6">
          <FeedbackAccordion 
            recommendations={analysisResults.recommendations}
            bulletRewrites={analysisResults.bulletRewrites}
            skillsGap={analysisResults.skillsGap}
          />
        </div>

      </div>

    </div>
  );
};

export default Results;
