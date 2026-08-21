import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageContainer } from './components/layout/PageContainer';
import { AuthGuard } from './components/auth/AuthGuard';

// Placeholder Pages (will be implemented next)
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <PageContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          
          <Route path="/analyzer" element={
            <AuthGuard>
              <Analyzer />
            </AuthGuard>
          } />
          
          <Route path="/results" element={
            <AuthGuard>
              <Results />
            </AuthGuard>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageContainer>
    </BrowserRouter>
  );
}

export default App;
