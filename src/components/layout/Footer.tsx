import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Mail, Share2 } from 'lucide-react';
import { useLanguageStore } from '../../i18n/useLanguageStore';

export const Footer: React.FC = () => {
  const { t } = useLanguageStore();

  return (
    <footer className="w-full border-t border-border/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="ResuMatch AI Logo" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-sm">
              <span className="text-foreground">ResuMatch</span>
              <span className="gradient-text">.AI</span>
            </span>
            <span className="text-muted-foreground text-xs ml-2">
              © {new Date().getFullYear()} · {t.footer.rights}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">{t.nav.overview}</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              {t.nav.overview === 'Overview' ? 'Dashboard' : 'ዳሽቦርድ'}
            </Link>
            <span className="text-xs text-muted-foreground">{t.footer.privacyNote}</span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Code className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
