import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2 } from 'lucide-react';

type UploadState = 'idle' | 'parsing' | 'ready';

interface UploadZoneProps {
  onUpload: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    
    setFileName(file.name);
    setUploadState('parsing');
    
    // Simulate parsing delay
    setTimeout(() => {
      setUploadState('ready');
      onUpload();
    }, 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 ${
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border bg-card hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
          disabled={uploadState === 'parsing'}
        />

        {uploadState === 'idle' && (
          <>
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload your Resume</h3>
            <p className="text-muted-foreground mb-4">
              Drag & drop your PDF file here, or click to browse
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <FileText className="w-3 h-3" />
              PDF up to 5MB
            </div>
          </>
        )}

        {uploadState === 'parsing' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analyzing Resume...</h3>
            <p className="text-muted-foreground">Extracting keywords and experience</p>
          </div>
        )}

        {uploadState === 'ready' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Complete</h3>
            <p className="text-muted-foreground">{fileName}</p>
          </div>
        )}
      </div>
    </div>
  );
};
