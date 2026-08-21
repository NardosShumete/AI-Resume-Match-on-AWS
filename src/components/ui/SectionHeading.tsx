import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string; // part of title to gradient-ify
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlight,
  subtitle,
  centered = true,
  className,
}) => {
  // Build title with optional highlighted segment
  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) {
      return <span>{title}</span>;
    }
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={cn(centered ? 'text-center' : '', 'mb-12', className)}>
      {badge && (
        <div className={cn('mb-4', centered ? 'flex justify-center' : '')}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed', centered ? 'mx-auto' : '')}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
