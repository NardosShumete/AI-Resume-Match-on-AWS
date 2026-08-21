import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { ProductPreview } from './ProductPreview';

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative pt-6 pb-20 md:py-16">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-900/90 text-foreground border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-muted-foreground">ResuMatch AI 2.0</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-bold">
              Next-Gen ATS Analyzer <Zap className="w-3 h-3 fill-current" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Beat the ATS filters.{' '}
            <br className="hidden sm:inline" />
            <span className="gradient-text">Land 3x more interviews.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
            Compare your resume directly against any job description in seconds. Get instant ATS compatibility scores, pinpoint missing keywords, and receive tailored AI bullet improvements.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Link
              to={isAuthenticated ? '/analyzer' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Analyze My Resume Free
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-foreground border border-zinc-200 dark:border-zinc-800 transition-all active:scale-[0.99]"
            >
              Explore Sample Dashboard
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ATS Scoring
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Tested on Greenhouse & Lever algorithms</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Keyword Heatmap
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Missing skill & requirement detection</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                Private & Secure
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Zero data sold, instant in-browser preview</p>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 relative">
          <ProductPreview />
        </div>

      </div>
    </section>
  );
};
