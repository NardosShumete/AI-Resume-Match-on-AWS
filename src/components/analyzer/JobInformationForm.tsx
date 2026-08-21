import React from 'react';
import { Building2, Briefcase } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';

export const JobInformationForm: React.FC = () => {
  const { companyName, jobTitle, setCompanyDetails } = useResumeStore();

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
          Company Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="e.g. Stripe, Linear, Vercel"
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            value={companyName}
            onChange={(e) => setCompanyDetails(e.target.value, jobTitle)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
          Target Role Title <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            value={jobTitle}
            onChange={(e) => setCompanyDetails(companyName, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
