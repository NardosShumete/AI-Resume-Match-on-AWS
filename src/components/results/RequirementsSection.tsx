import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, ShieldCheck, FileCheck2 } from 'lucide-react';
import type { RequirementsBreakdown, RequirementItem } from '../../types/analysis';
import { useLanguageStore } from '../../i18n/useLanguageStore';
import { formatScore } from '../../utils/scoreFormatter';

interface RequirementsSectionProps {
  requirementsBreakdown?: RequirementsBreakdown;
}

export const RequirementsSection: React.FC<RequirementsSectionProps> = ({ requirementsBreakdown }) => {
  const { t } = useLanguageStore();

  if (!requirementsBreakdown) return null;

  const renderRequirementList = (items: RequirementItem[], title: string, score: number, icon: React.ReactNode, description: string) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <h4 className="text-xs font-bold text-foreground">{title}</h4>
              <p className="text-[11px] text-muted-foreground">{description}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 tabular-nums">
            {formatScore(score)}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, idx) => {
              const isMatched = item.status === 'matched';
              const isMissing = item.status === 'missing';
              const isUnverified = item.status === 'unverified';

              return (
                <div
                  key={`${item.requirement}-${idx}`}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                    isMatched
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                      : isMissing
                      ? 'bg-rose-500/5 border-rose-500/20 text-foreground'
                      : 'bg-amber-500/5 border-amber-500/20 text-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold flex items-center gap-1.5">
                      {isMatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                      {isMissing && <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />}
                      {isUnverified && <HelpCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                      {item.requirement}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isMatched
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : isMissing
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  {item.explanation && (
                    <p className="text-muted-foreground text-[11px] pl-5 leading-relaxed">
                      {item.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-1">No requirements specified in this category.</p>
        )}
      </div>
    );
  };

  const explicitItems = [
    ...(requirementsBreakdown.explicit?.matched || []),
    ...(requirementsBreakdown.explicit?.missing || []),
    ...(requirementsBreakdown.explicit?.unverified || [])
  ];

  const roleImpliedItems = [
    ...(requirementsBreakdown.roleImplied?.matched || []),
    ...(requirementsBreakdown.roleImplied?.missing || []),
    ...(requirementsBreakdown.roleImplied?.unverified || [])
  ];

  return (
    <div className="linear-card rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 space-y-6">
      {/* Main Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-teal-500" />
          {t.breakdown.requiredQualifications} (Provenance Audit)
        </h3>
        <span className="text-xs font-bold text-foreground tabular-nums">
          Overall: {formatScore(requirementsBreakdown.overallScore)}
        </span>
      </div>

      {/* Explicit Requirements */}
      {renderRequirementList(
        explicitItems,
        'Explicit Requirements (Job Description)',
        requirementsBreakdown.explicit?.score ?? 0,
        <FileCheck2 className="w-4 h-4 text-indigo-500" />,
        'Directly stated in the job posting text'
      )}

      {/* Role-Implied Standards */}
      {renderRequirementList(
        roleImpliedItems,
        'Role-Implied Standards (Industry Baseline)',
        requirementsBreakdown.roleImplied?.score ?? 0,
        <ShieldCheck className="w-4 h-4 text-emerald-500" />,
        'Standard baseline qualifications and licenses for this occupation'
      )}
    </div>
  );
};
