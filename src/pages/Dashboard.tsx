import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target, Trophy, TrendingUp, Sparkles, Search, Layers, Trash2, ArrowRight } from 'lucide-react';
import { ResumeCard } from '../components/home/ResumeCard';
import { useResumeStore } from '../stores/useResumeStore';

const Dashboard: React.FC = () => {
  const { reset, history, clearHistory, loadSampleHistory } = useResumeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high'>('all');

  const totalAnalyses = history.length;
  const averageScore = totalAnalyses > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.atsScore, 0) / totalAnalyses) : 0;
  const bestMatch = totalAnalyses > 0 ? Math.max(...history.map(a => a.atsScore)) : 0;
  const bestMatchItem = history.find(a => a.atsScore === bestMatch);
  const totalBulletFixes = history.reduce((acc, curr) => acc + (curr.bulletRewrites?.length || 0), 0);

  const filteredAnalyses = history.filter((item) => {
    const matchesSearch = item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resumeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === 'high') return item.atsScore >= 80;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              ATS Overview
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md">
              Live Workspace
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome to ResuMatch. Track and optimize your active resume scans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-200 dark:border-rose-500/20"
              title="Clear all saved scan history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Scans
            </button>
          )}

          <Link
            to="/analyzer"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New ATS Analysis
          </Link>
        </div>
      </div>

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="linear-card rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">Total Resumes Checked</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            {totalAnalyses}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Active scans
          </p>
        </div>

        {/* Metric 2 */}
        <div className="linear-card rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">Avg ATS Match Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            {averageScore}%
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Target: ≥ 80%
          </p>
        </div>

        {/* Metric 3 */}
        <div className="linear-card rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">Highest Score</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            {bestMatch}%
          </div>
          <p className="text-[11px] text-muted-foreground font-semibold mt-1 truncate">
            {bestMatchItem ? `${bestMatchItem.jobTitle} @ ${bestMatchItem.companyName}` : 'No active scans'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="linear-card rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">AI Bullet Fixes</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            {totalBulletFixes}
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Generated rewrites
          </p>
        </div>

      </div>

      {/* Resume List Section */}
      <div className="space-y-4">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by role, company, or file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Reports ({history.length})
            </button>
            <button
              onClick={() => setActiveFilter('high')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'high'
                  ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Top Matches (80%+)
            </button>
          </div>

        </div>

        {/* Cards Grid or Empty State */}
        {filteredAnalyses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAnalyses.map((analysis) => (
              <ResumeCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="linear-card rounded-3xl p-10 sm:p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground mb-1">No ATS Scans Yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Upload your resume and test it against target job descriptions, or load verified sample reports to preview the workspace analytics.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={loadSampleHistory}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-foreground transition-all"
              >
                ✨ Load Example Scans
              </button>
              <Link
                to="/analyzer"
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md transition-all"
              >
                Start New ATS Scan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="linear-card rounded-2xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-semibold text-muted-foreground">No reports matching "{searchQuery}"</p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
