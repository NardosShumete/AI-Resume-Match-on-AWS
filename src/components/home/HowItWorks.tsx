import React from 'react';
import { Upload, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: '01',
    title: 'Upload Your Resume',
    desc: 'Drag and drop your PDF resume. Our parser instantly extracts work history, education, skills, and bullet structures.',
    icon: <Upload className="w-5 h-5" />,
    tag: 'PDF Support',
  },
  {
    step: '02',
    title: 'Provide Job Posting',
    desc: 'Paste the target job description or select one of our curated tech role templates to test against real-world specs.',
    icon: <FileText className="w-5 h-5" />,
    tag: 'NLP Extraction',
  },
  {
    step: '03',
    title: 'Unlock Full ATS Report',
    desc: 'Receive your comprehensive 0-100% ATS score, exact missing keywords, formatting flags, and tailored bullet rewrites.',
    icon: <Sparkles className="w-5 h-5" />,
    tag: 'Instant Results',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 border-t border-zinc-200/60 dark:border-zinc-800/60">
      
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Workflow
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-3">
          3-step path to an interview-ready resume
        </h2>
        <p className="text-muted-foreground text-base">
          From upload to detailed actionable recommendations in less than 15 seconds.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid md:grid-cols-3 gap-6 relative">
        {steps.map((item, index) => (
          <div
            key={item.step}
            className="linear-card card-hover rounded-2xl p-7 flex flex-col justify-between relative group"
          >
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6">
                <span className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 text-foreground font-black text-xs flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                  {item.step}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground bg-zinc-100/80 dark:bg-zinc-800/60 px-2.5 py-1 rounded-md">
                  {item.tag}
                </span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>

            {index < 2 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-zinc-400 dark:text-zinc-600 pointer-events-none">
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-14 p-8 rounded-3xl linear-card bg-gradient-to-r from-indigo-900/10 via-violet-900/10 to-transparent border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h4 className="text-xl font-bold text-foreground">Ready to optimize your application?</h4>
          <p className="text-sm text-muted-foreground mt-1">Upload your resume and test our scoring engine with zero setup.</p>
        </div>
        <Link
          to="/analyzer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-all whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          Test My Resume Now
        </Link>
      </div>

    </section>
  );
};
