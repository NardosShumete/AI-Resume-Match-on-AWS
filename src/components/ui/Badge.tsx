import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'ai' | 'secondary';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  className,
  dot,
}) => {
  const base = 'inline-flex items-center gap-1.5 font-semibold rounded-full border';

  const variants = {
    default:
      'bg-muted text-muted-foreground border-border',
    success:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    warning:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    error:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    info:
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    ai:
      'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-500/20',
    secondary:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const dotColors: Record<string, string> = {
    default: 'bg-muted-foreground',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-indigo-500',
    ai: 'bg-indigo-500',
    secondary: 'bg-violet-500',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
