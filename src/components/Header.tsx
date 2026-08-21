import React, { useEffect, useState } from 'react';
import { Code, Moon, Sun, FileCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="border-b border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <FileCheck className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ResuMatch AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              <Code className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
