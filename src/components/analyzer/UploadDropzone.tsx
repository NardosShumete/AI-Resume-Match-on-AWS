import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle, Sparkles, FileWarning, Eye, Code } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';
import { usePdfParser } from '../../hooks/usePdfParser';
import { cn } from '../../lib/utils';

export const UploadDropzone: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const { resumeFile, resumeMetadata, pdfState, pdfError, loadSampleData } = useResumeStore();
  const { parsePdf, reset } = usePdfParser();

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
  }, [parsePdf]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file: File) => {
    setShowExtractedText(false);
    parsePdf(file);
  };

  const handleUseDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    loadSampleData();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Success / Ready State
  if (pdfState === 'success' && resumeMetadata) {
    return (
      <div className="space-y-4">
        {/* Success Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{resumeMetadata.fileName}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground font-medium">
                <span>{formatBytes(resumeMetadata.fileSize)}</span>
                <span>•</span>
                <span>{resumeMetadata.pageCount} page{resumeMetadata.pageCount !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{resumeMetadata.wordCount} words</span>
              </div>
            </div>
            <button
              onClick={reset}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Remove resume"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-1 w-full bg-emerald-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
        </div>

        {/* Preview & Debug Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PDF Visual Preview */}
          {resumeMetadata.previewUrl && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm flex flex-col">
              <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Page 1 Preview</span>
              </div>
              <div className="p-2 bg-zinc-100/50 dark:bg-zinc-900 flex-1 flex items-center justify-center">
                <img 
                  src={resumeMetadata.previewUrl} 
                  alt="Resume Preview" 
                  className="max-h-64 object-contain shadow-sm border border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
          )}

          {/* Extracted Text Developer View */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm flex flex-col">
            <button 
              onClick={() => setShowExtractedText(!showExtractedText)}
              className="w-full px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Extracted Text View</span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{showExtractedText ? 'Hide' : 'Show'}</span>
            </button>
            <div className="p-0 bg-zinc-50 dark:bg-zinc-900/30 flex-1 relative min-h-[8rem]">
              {showExtractedText ? (
                <div className="absolute inset-0 p-3 overflow-y-auto custom-scrollbar">
                  <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {resumeMetadata.extractedText}
                  </pre>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                   <p className="text-xs text-muted-foreground max-w-[220px]">
                     Inspect the plain text extracted from your PDF used for ATS keyword matching.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parsing State
  if (pdfState === 'parsing') {
    return (
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-8 flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
          <FileText className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <p className="font-bold text-sm text-foreground">Parsing PDF Structure & Text...</p>
          <p className="text-xs text-muted-foreground mt-0.5">Running local extraction engine</p>
        </div>
        <div className="w-full max-w-xs h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-1/2 rounded-full animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
      </div>
    );
  }

  // Idle Dropzone State (includes error display)
  return (
    <div className="space-y-3">
      {pdfState === 'error' && pdfError && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 flex gap-2.5 items-start">
          <FileWarning className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{pdfError}</p>
        </div>
      )}

      <div
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all duration-200 group',
          dragActive
            ? 'border-indigo-500 bg-indigo-500/5 shadow-inner'
            : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50',
          pdfState === 'error' && !dragActive && 'border-rose-500/40 hover:border-rose-500/60'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
        />

        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border",
          pdfState === 'error' 
            ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
            : "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
        )}>
          <UploadCloud className="w-6 h-6 stroke-[2]" />
        </div>

        <p className="font-bold text-sm text-foreground">
          {dragActive ? 'Drop your PDF here' : 'Drop your resume PDF here'}
        </p>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2">browse files</span> from your computer
        </p>

        {/* Quick 1-click Example Fill */}
        <button
          type="button"
          onClick={handleUseDemo}
          className="relative z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-indigo-600 hover:text-white transition-all shadow-xs border border-zinc-200 dark:border-zinc-700"
          title="Pre-fill with an example software engineering resume"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          ✨ Load Example Resume
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-4">
          <AlertCircle className="w-3 h-3" />
          Supports PDF format • 100% Client-side privacy
        </div>
      </div>
    </div>
  );
};
