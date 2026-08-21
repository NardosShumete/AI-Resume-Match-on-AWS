import React, { useState } from 'react';
import { Briefcase, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const suggestions = [
  "Frontend Developer (React, TypeScript)",
  "Full Stack Engineer (Node.js, AWS)",
  "UX/UI Designer (Figma, Prototyping)"
];

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Job Description</h3>
            <p className="text-sm text-muted-foreground">Paste the target role description</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="text-xs bg-muted px-2 py-1 rounded-full">{wordCount} words</span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border mt-2 animate-in slide-in-from-top-2">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick fill:
            </span>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onChange(suggestion)}
                className="text-xs bg-accent hover:bg-primary/10 hover:text-primary transition-colors px-2 py-1 rounded-full border border-border"
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          <textarea
            className="w-full h-48 p-4 bg-background border border-input rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-shadow"
            placeholder="Paste the full job description here... Our AI will analyze the requirements and compare them against your resume."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
