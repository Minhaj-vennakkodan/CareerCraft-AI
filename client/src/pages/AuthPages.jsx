import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Key, Mail, Lock, ShieldCheck, ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AuthPages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, signup, googleLoginSimulate } = useAuth();
  const { isDark } = useTheme();

  // Determine current mode ('login' or 'signup' or 'forgot')
  const [mode, setMode] = useState('login');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) return 'Name is required.';
      if (formData.password.length < 6) return 'Password must be at least 6 characters.';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        setSuccess('Logged in successfully!');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(res.message);
      }
    } else if (mode === 'signup') {
      const res = await signup(formData.name, formData.email, formData.password);
      if (res.success) {
        setSuccess('Account created successfully!');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(res.message);
      }
    } else if (mode === 'forgot') {
      // Mock forgot password
      setTimeout(() => {
        setSuccess('Password reset link sent to your email.');
        setMode('login');
      }, 1000);
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    // Simulate google authentication popup returning email
    setTimeout(async () => {
      const googleMock = {
        name: 'Mock Google User',
        email: 'googleuser@gmail.com',
        googleId: 'g_1234567890'
      };
      const res = await googleLoginSimulate(googleMock.name, googleMock.email, googleMock.googleId);
      if (res.success) {
        setSuccess('Logged in via Google!');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(res.message);
      }
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-brand-deepblue-dark' : 'bg-slate-50'
    }`}>
      {/* Background glowing decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-cyan/15 blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 m-4 rounded-2xl relative z-10 shadow-2xl glass-panel text-left border-slate-800"
        style={{
          background: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'
        }}
      >
        {/* Back Link to Landing */}
        <Link 
          to="/"
          className={`flex items-center gap-2 mb-6 text-sm transition-colors ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Dynamic header details */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={28} />
            </div>
          </div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {mode === 'login' && 'Log in to continue building your career assets.'}
            {mode === 'signup' && 'Get started with ATS-friendly tools and summaries.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Error / Success Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm mb-4"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2 rounded-lg text-sm mb-4"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <UserPlus size={18} />
                </span>
                <input 
                  type="text" 
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:border-brand-purple focus:ring-brand-purple/20' 
                      : 'bg-white border-slate-200 text-slate-900 focus:border-brand-purple focus:ring-brand-purple/20'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-white focus:border-brand-purple focus:ring-brand-purple/20' 
                    : 'bg-white border-slate-200 text-slate-900 focus:border-brand-purple focus:ring-brand-purple/20'
                }`}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-brand-purple-light hover:text-brand-purple font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:border-brand-purple focus:ring-brand-purple/20' 
                      : 'bg-white border-slate-200 text-slate-900 focus:border-brand-purple focus:ring-brand-purple/20'
                  }`}
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:border-brand-purple focus:ring-brand-purple/20' 
                      : 'bg-white border-slate-200 text-slate-900 focus:border-brand-purple focus:ring-brand-purple/20'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-brand-purple-dark hover:to-brand-cyan-dark text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader size={18} className="animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} /> Log In
              </>
            ) : mode === 'signup' ? (
              <>
                <UserPlus size={18} /> Create Account
              </>
            ) : (
              <>
                <Key size={18} /> Reset Password
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        {mode !== 'forgot' && (
          <>
            <div className="relative my-6 text-center">
              <span className={`absolute left-0 top-3 w-full border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
              <span className={`relative px-3 text-xs uppercase tracking-wider font-semibold ${
                isDark ? 'bg-slate-900/90 text-slate-500' : 'bg-white text-slate-500'
              }`}
                style={{
                  background: isDark ? '#141e33' : '#ffffff'
                }}
              >
                Or Continue With
              </span>
            </div>

            {/* Google Login Simulation */}
            <button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg border font-semibold flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] ${
                isDark 
                  ? 'bg-slate-950/60 border-slate-850 hover:bg-slate-900 text-slate-300' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.01-3.01 4.02v3.32h4.86c2.84-2.62 4.47-6.48 4.47-11.19z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.86-3.32c-1.35.9-3.08 1.45-5.1 1.45-3.92 0-7.25-2.64-8.43-6.19H1.47v3.42C3.45 20.52 7.42 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.57 13.03c-.3-.9-.47-1.87-.47-2.88 0-1.01.17-1.98.47-2.88V3.85H1.47C.53 5.71 0 7.79 0 10s.53 4.29 1.47 6.15l2.1-3.12z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.42 0 3.45 3.48 1.47 7.12l2.1 3.12c1.18-3.55 4.51-6.19 8.43-6.19z"
                />
              </svg>
              Google Account
            </button>
          </>
        )}

        {/* Footer switch state links */}
        <div className="mt-8 text-center text-sm">
          {mode === 'login' && (
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Don't have an account?{' '}
              <button 
                onClick={() => setMode('signup')}
                className="text-brand-purple-light hover:text-brand-purple font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Already have an account?{' '}
              <button 
                onClick={() => setMode('login')}
                className="text-brand-purple-light hover:text-brand-purple font-semibold transition-colors"
              >
                Log in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Remembered your password?{' '}
              <button 
                onClick={() => setMode('login')}
                className="text-brand-purple-light hover:text-brand-purple font-semibold transition-colors"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
