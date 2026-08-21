import React from 'react';
import { Sparkles, FileCode2 } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';

const samplePresets = [
  {
    company: 'Stripe',
    title: 'Senior Frontend Engineer',
    desc: `About the Role:
We are looking for a Senior Frontend Engineer to build world-class dashboard interfaces for our global payments platform.

Requirements:
- 5+ years of experience with modern React, TypeScript, and state management.
- Strong understanding of web performance, Core Web Vitals, and accessibility (a11y).
- Experience building reusable design systems with Tailwind CSS and CSS Modules.
- Familiarity with REST APIs, GraphQL, and modern CI/CD deployment pipelines.
- Track record of shipping customer-facing features with high reliability.`,
  },
  {
    company: 'Linear',
    title: 'Product Engineer',
    desc: `About the Role:
Linear is looking for a Product Engineer to craft fast, delightful developer tooling experiences.

Responsibilities & Requirements:
- Build realtime, collaborative web applications using TypeScript and Next.js.
- Strong product intuition and high standards for UI micro-interactions.
- Proficiency with sync engines, optimistic UI updates, and WebSocket protocols.
- Experience with Docker, cloud infrastructure (AWS/GCP), and test automation.`,
  },
];

export const JobDescriptionInput: React.FC = () => {
  const { jobDescription, setJobDescription, setCompanyDetails } = useResumeStore();
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOptimal = wordCount >= 60;

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setCompanyDetails(preset.company, preset.title);
    setJobDescription(preset.desc);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Job Description & Requirements <span className="text-rose-500">*</span>
        </label>
        <span
          className={`text-[11px] font-semibold ${
            wordCount === 0
              ? 'text-muted-foreground'
              : isOptimal
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {wordCount} words {wordCount > 0 && (isOptimal ? '• Optimal depth' : '• Paste more text')}
        </span>
      </div>

      {/* Preset Quick-Fill Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground flex items-center gap-1 text-[11px] whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-indigo-500" /> Example roles:
        </span>
        {samplePresets.map((p) => (
          <button
            key={p.company}
            type="button"
            onClick={() => handleApplyPreset(p)}
            className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-500 hover:text-white text-muted-foreground text-[11px] font-semibold transition-colors whitespace-nowrap border border-zinc-200 dark:border-zinc-700"
          >
            {p.title} @ {p.company}
          </button>
        ))}
      </div>

      <textarea
        className="w-full min-h-[200px] px-3.5 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 leading-relaxed resize-y"
        placeholder="Paste the full job posting text here (responsibilities, required skills, preferred qualifications)..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <FileCode2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
        Tip: Pasting the full section including requirements helps the NLP engine find precise keyword overlaps.
      </p>
    </div>
  );
};
