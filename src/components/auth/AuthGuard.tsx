import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Allow open guest access across all routes
  return <>{children}</>;
};

