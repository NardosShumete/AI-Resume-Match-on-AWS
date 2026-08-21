import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-400">

      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};
