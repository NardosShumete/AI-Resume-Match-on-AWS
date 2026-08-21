import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, loading, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

    const variants = {
      primary:
        'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98]',
      secondary:
        'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.98]',
      outline:
        'border border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-[0.98]',
      ghost:
        'text-muted-foreground hover:text-foreground hover:bg-accent/60 active:scale-[0.98]',
      danger:
        'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98]',
    };

    const sizes = {
      sm: 'text-sm px-4 py-2',
      md: 'text-sm px-5 py-2.5',
      lg: 'text-base px-7 py-3.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
