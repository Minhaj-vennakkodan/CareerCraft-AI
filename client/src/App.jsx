import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BuilderProvider } from './context/BuilderContext';

import LandingPage from './pages/LandingPage';
import AuthPages from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import PortfolioView from './pages/PortfolioView';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-purple animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BuilderProvider>
          <Router>
            <Routes>
              {/* Public Marketing Homepage */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Public Portfolio URL */}
              <Route path="/portfolio/:slug" element={<PortfolioView />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<AuthPages />} />
              <Route path="/signup" element={<AuthPages />} />

              {/* SaaS Dashboard Pages (Protected) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/builder/:id" element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </BuilderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
