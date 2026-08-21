import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Plus, Target, Trophy, TrendingUp, Sparkles, Search, Layers } from 'lucide-react';
import { mockAnalyses } from '../data/mockAnalyses';
import { ResumeCard } from '../components/home/ResumeCard';
import { useResumeStore } from '../stores/useResumeStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { reset } = useResumeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'recent'>('all');

  const totalAnalyses = mockAnalyses.length;
  const averageScore = Math.round(mockAnalyses.reduce((acc, curr) => acc + curr.score, 0) / totalAnalyses);
  const bestMatch = Math.max(...mockAnalyses.map(a => a.score));

  const filteredAnalyses = mockAnalyses.filter((item) => {
    const matchesSearch = item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resumeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === 'high') return item.score >= 80;
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
            <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-md">
              Pro Suite
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name ?? 'User'}. Track and optimize your active resume versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            <TrendingUp className="w-3 h-3" /> +2 this week
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
            <TrendingUp className="w-3 h-3" /> +8% vs initial draft
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
          <p className="text-[11px] text-muted-foreground font-semibold mt-1">
            UX Designer @ Creative
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
            18
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Ready to copy-paste
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
              All Reports ({mockAnalyses.length})
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

        {/* Cards Grid */}
        {filteredAnalyses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAnalyses.map((analysis) => (
              <ResumeCard key={analysis.id} analysis={analysis} />
            ))}
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
