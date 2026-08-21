import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Frown } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-up">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-200/40 dark:border-indigo-500/20 flex items-center justify-center">
          <Frown className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-md">
          4
        </div>
      </div>

      <h1 className="text-5xl font-black text-foreground mb-3">404</h1>
      <h2 className="text-xl font-bold text-foreground mb-3">Page not found</h2>
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
      </p>

      <div className="flex gap-3">
        <Link to="/">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" size="md">
            View Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
