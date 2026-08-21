import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle, Sparkles } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';
import { cn } from '../../lib/utils';

export const UploadDropzone: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const { resumeFile, setResumeFile } = useResumeStore();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    setIsParsing(true);
    setParseProgress(0);

    const interval = setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 20;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setParseProgress(100);
      setTimeout(() => {
        setIsParsing(false);
        setResumeFile(file);
      }, 250);
    }, 1400);
  };

  const handleUseDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const demoBlob = new Blob(['Demo Resume Content'], { type: 'application/pdf' });
    const demoFile = new File([demoBlob], 'Alex_Chen_Senior_Frontend_2026.pdf', {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    handleFile(demoFile);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Ready State
  if (resumeFile && !isParsing) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-5 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground truncate">{resumeFile.name}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <span>{formatBytes(resumeFile.size || 240000)}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for ATS Matching
              </span>
            </div>
          </div>
          <button
            onClick={() => setResumeFile(null)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Remove resume"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="h-1.5 w-full bg-emerald-500/20 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-full" />
        </div>
      </div>
    );
  }

  // Parsing State
  if (isParsing) {
    return (
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-8 flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
          <FileText className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <p className="font-bold text-sm text-foreground">Parsing PDF Structure & Hierarchy...</p>
          <p className="text-xs text-muted-foreground mt-0.5">Extracting work history, skills, and metrics</p>
        </div>
        <div className="w-full max-w-xs space-y-1.5">
          <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-200"
              style={{ width: `${parseProgress}%` }}
            />
          </div>
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(parseProgress)}%</p>
        </div>
      </div>
    );
  }

  // Idle Dropzone State
  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all duration-200 group',
        dragActive
          ? 'border-indigo-500 bg-indigo-500/5 shadow-inner'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleChange}
      />

      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
        <UploadCloud className="w-6 h-6 stroke-[2]" />
      </div>

      <p className="font-bold text-sm text-foreground">
        {dragActive ? 'Drop your PDF here' : 'Drop your resume PDF here'}
      </p>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2">browse files</span> from your computer
      </p>

      {/* Quick 1-click Demo Fill */}
      <button
        type="button"
        onClick={handleUseDemo}
        className="relative z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-indigo-500 hover:text-white transition-all shadow-xs border border-zinc-200 dark:border-zinc-700"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        Use Demo Sample Resume
      </button>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-4">
        <AlertCircle className="w-3 h-3" />
        PDF up to 20MB supported
      </div>
    </div>
  );
};
