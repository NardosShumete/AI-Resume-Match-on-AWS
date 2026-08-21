import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, LogOut, Sparkles, FileText, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../stores/useAuthStore';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'ATS Engine', path: '/analyzer' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          isScrolled
            ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-border shadow-sm'
            : 'bg-background border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="ResuMatch AI Logo" className="w-9 h-9 rounded-xl object-cover transition-transform group-hover:scale-105" />
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-foreground">
                  ResuMatch
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-zinc-100/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
                      active
                        ? 'text-foreground bg-white dark:bg-zinc-800 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-zinc-800/40'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-6 h-6 rounded-md object-cover ring-1 ring-indigo-500/30"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:shadow-indigo-500/30 active:scale-[0.98]"
                >
                  <Sparkles className="w-3 h-3" />
                  Sign In
                  <ChevronRight className="w-3 h-3 opacity-70" />
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-foreground rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4 bg-card rounded-2xl border border-border shadow-2xl p-5 space-y-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-accent flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? 'Light mode' : 'Dark mode'}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="text-xs font-semibold text-rose-500"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
