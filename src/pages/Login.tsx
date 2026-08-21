import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8">
      <LoginForm />
    </div>
  );
};

export default Login;
