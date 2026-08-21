import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../stores/useResumeStore';
import { UploadDropzone } from '../components/analyzer/UploadDropzone';
import { JobInformationForm } from '../components/analyzer/JobInformationForm';
import { JobDescriptionInput } from '../components/analyzer/JobDescriptionInput';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const Analyzer: React.FC = () => {
  const navigate = useNavigate();
  const {
    resumeFile,
    resumeMetadata,
    pdfState,
    companyName,
    jobTitle,
    jobDescription,
    status,
    errorMessage,
    loadExampleData,
    analyzeResume,
  } = useResumeStore();

  const isFormValid = Boolean(pdfState === 'success' && resumeMetadata && companyName.trim() && jobTitle.trim() && jobDescription.trim().length > 30);

  useEffect(() => {
    if (status === 'completed') {
      navigate('/results');
    }
  }, [status, navigate]);

  const checklist = [
    { label: 'Resume PDF parsed', ready: Boolean(pdfState === 'success' && resumeMetadata) },
    { label: 'Target company & role', ready: Boolean(companyName.trim() && jobTitle.trim()) },
    { label: 'Job description text', ready: Boolean(jobDescription.trim().length > 30) },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-md">
              ATS Studio
            </span>
            <span className="text-xs text-muted-foreground">• Ready to match</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Resume & Job Matcher
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provide the job details and your resume to simulate an ATS parser pass.
          </p>
        </div>

        {/* Header Right Actions & Readiness */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadExampleData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/60 dark:to-violet-950/60 hover:from-indigo-100 hover:to-violet-100 dark:hover:from-indigo-900/60 dark:hover:to-violet-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs transition-all active:scale-[0.98]"
            title="Populate an example resume and job description to test the ATS engine immediately"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            ✨ Load Example Data
          </button>

          {/* Readiness Pill Status */}
          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/90 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    item.ready ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  title={item.label}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-foreground">
              {checklist.filter((i) => i.ready).length} / 3 Steps Ready
            </span>
          </div>
        </div>
      </div>

      {/* Informational Guidance Callout */}
      <div className="rounded-2xl p-4 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">How it works:</span> Upload your PDF resume and paste target job requirements. The engine parses key competencies, evaluates your ATS score, and generates targeted AI bullet point rewrites.
          </div>
        </div>
        <button
          type="button"
          onClick={loadExampleData}
          className="shrink-0 font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          Load Example Data →
        </button>
      </div>

      {/* Main Grid: Two columns */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* Left Column: Job Spec (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="linear-card rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                  1
                </span>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Target Job Details</h2>
              </div>
            </div>

            <JobInformationForm />
            <JobDescriptionInput />
          </div>
        </div>

        {/* Right Column: Resume Upload & Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Card */}
          <div className="linear-card rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
              <span className="w-6 h-6 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs flex items-center justify-center border border-violet-500/20">
                2
              </span>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Upload Resume</h2>
            </div>

            <UploadDropzone />
          </div>

          {/* Checklist Card */}
          <div className="linear-card rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Pre-Analysis Checks
            </h3>

            <div className="space-y-2 text-xs">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-900 last:border-0">
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.ready ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-600 font-medium">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
          {errorMessage}
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="linear-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80">
        <div className="text-center sm:text-left">
          <p className="text-sm font-bold text-foreground">
            {isFormValid ? 'Everything is ready for processing!' : 'Fill in all fields to start analysis'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Takes ~2 seconds • Analyzes formatting, keywords & seniority gap
          </p>
        </div>

        <button
          onClick={analyzeResume}
          disabled={!isFormValid || status === 'processing'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {status === 'processing' ? (
            <>
              <Zap className="w-4 h-4 animate-spin text-amber-300" />
              Scoring ATS Match...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run Full ATS Match Analysis
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default Analyzer;
