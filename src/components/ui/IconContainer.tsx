import React from 'react';
import { cn } from '../../lib/utils';

interface IconContainerProps {
  children: React.ReactNode;
  color?: 'indigo' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  color = 'indigo',
  size = 'md',
  className,
}) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  };

  const sizes = {
    sm: 'w-9 h-9 rounded-lg [&>svg]:w-4 [&>svg]:h-4',
    md: 'w-12 h-12 rounded-xl [&>svg]:w-5 [&>svg]:h-5',
    lg: 'w-16 h-16 rounded-2xl [&>svg]:w-7 [&>svg]:h-7',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center flex-shrink-0',
        colors[color],
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
};
