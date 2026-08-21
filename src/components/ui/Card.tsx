import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glass = false,
  padding = 'md',
}) => {
  const base = 'rounded-2xl border bg-card';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        base,
        paddings[padding],
        hover && 'card-hover cursor-pointer',
        glass ? 'glass-card' : 'shadow-card border-border',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h3 className={cn('text-lg font-semibold text-foreground', className)}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={cn('text-sm text-muted-foreground mt-1', className)}>{children}</p>
);
