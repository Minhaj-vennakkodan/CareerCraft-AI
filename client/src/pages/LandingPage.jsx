import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, FileText, Globe, Star, Zap, Shield, Share2, Eye, Download, 
  ChevronRight, HelpCircle, ArrowRight, Menu, X, Check, Laptop, Terminal, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly / yearly

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const ctaAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-brand-deepblue-dark text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Decorative Lights */}
      <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-brand-purple/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-brand-cyan/20 blur-[130px] pointer-events-none" />

      {/* ============================================================== */}
      {/* NAVIGATION HEADER */}
      {/* ============================================================== */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark ? 'bg-brand-deepblue-dark/80 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white shadow-lg">
              <Sparkles size={18} />
            </span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 dark:from-white dark:to-slate-400 bg-clip-text text-transparent dark:text-transparent text-slate-900">
              CareerCraft<span className="text-brand-cyan font-semibold">.AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className={`hover:text-brand-cyan transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Features</a>
            <a href="#how-it-works" className={`hover:text-brand-cyan transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>How It Works</a>
            <a href="#templates" className={`hover:text-brand-cyan transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Templates</a>
            <a href="#pricing" className={`hover:text-brand-cyan transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Pricing</a>
            <a href="#faq" className={`hover:text-brand-cyan transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>FAQs</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${
                isDark ? 'border-slate-800 hover:bg-slate-900 text-yellow-400' : 'border-slate-200 hover:bg-slate-100 text-brand-purple'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <Link to="/dashboard" className="px-5 py-2.5 rounded-lg bg-brand-deepblue-light text-sm font-semibold border border-slate-850 hover:bg-slate-900 text-white transition-all">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-semibold hover:text-brand-cyan transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Sign In
                </Link>
                <button 
                  onClick={ctaAction}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-purple/20 transition-all active:scale-95"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${
                isDark ? 'border-slate-800 hover:bg-slate-900 text-yellow-400' : 'border-slate-200 hover:bg-slate-100 text-brand-purple'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={isDark ? 'text-slate-300' : 'text-slate-700'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:hidden px-6 py-4 border-t flex flex-col gap-4 shadow-xl ${
              isDark ? 'bg-brand-deepblue bg-slate-950/95 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className={`text-sm hover:text-brand-cyan font-medium ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className={`text-sm hover:text-brand-cyan font-medium ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>How It Works</a>
            <a href="#templates" onClick={() => setMobileMenuOpen(false)} className={`text-sm hover:text-brand-cyan font-medium ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>Templates</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className={`text-sm hover:text-brand-cyan font-medium ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className={`text-sm hover:text-brand-cyan font-medium ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>FAQs</a>
            <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-brand-deepblue-light text-sm font-semibold border border-slate-850 text-white">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={`w-full text-center py-2.5 rounded-lg border text-sm font-medium ${
                  isDark ? 'border-slate-800 hover:bg-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  Sign In
                </Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); ctaAction(); }}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-sm font-semibold"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </motion.div>
        )}
      </header>

      {/* ============================================================== */}
      {/* HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Decorative elements */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase transition-colors mb-6 backdrop-blur-md border-brand-purple/30 text-brand-purple-light bg-brand-purple/5">
          <Sparkles size={14} className="text-brand-cyan animate-pulse" />
          AI-Powered Resume Builder
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Build <span className="bg-gradient-to-r from-brand-purple-light to-brand-cyan bg-clip-text text-transparent">ATS-Friendly Resumes</span> & Land Your Dream Job with AI.
        </h1>

        <p className={`text-base sm:text-xl mt-6 max-w-2xl font-normal leading-relaxed ${
          isDark ? 'text-slate-405 text-slate-350' : 'text-slate-600'
        }`}>
          Create resumes matching recruiter ATS filters, optimize project descriptions with active verbs, and download professional layouts in minutes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full justify-center">
          <button 
            onClick={ctaAction}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-brand-purple-dark hover:to-brand-cyan-dark text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand-purple/20 transition-all active:scale-[0.98]"
          >
            Create Free Resume <ArrowRight size={18} />
          </button>
          <a 
            href="#templates"
            className={`w-full sm:w-auto px-8 py-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isDark 
                ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 text-white' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
            }`}
          >
            Explore Layouts
          </a>
        </div>

        {/* Dashboard/Editor Mockup Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`w-full max-w-5xl mt-16 p-3 rounded-2xl border relative shadow-2xl overflow-hidden pointer-events-none select-none ${
            isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className={`w-full h-6 rounded-t-lg flex items-center gap-1.5 px-3 mb-2 ${
            isDark ? 'bg-slate-900/50' : 'bg-slate-100'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className={`text-[10px] ml-4 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>careercraft.ai/builder/demo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[380px] text-left p-1 rounded-b-lg">
            {/* Mock Left Form */}
            <div className={`p-4 rounded-lg flex flex-col gap-3 overflow-hidden ${isDark ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-800/50">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-purple-light flex items-center gap-1.5">
                  <Terminal size={14} /> Resume Builder Workspace
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">Auto-Saved</span>
              </div>
              <div className="space-y-3 mt-1 text-xs">
                <div>
                  <div className="h-3.5 w-16 bg-slate-800 rounded mb-1.5 opacity-60" />
                  <div className="h-9 w-full bg-slate-950/50 border border-slate-800/80 rounded" />
                </div>
                <div>
                  <div className="h-3.5 w-28 bg-slate-800 rounded mb-1.5 opacity-60" />
                  <div className="h-20 w-full bg-slate-950/50 border border-slate-800/80 rounded p-2 text-[10px] text-slate-400 font-mono">
                    // AI Enhanced summary...<br/>
                    Proven track record engineering scalable react.js platforms reducing latency.
                  </div>
                </div>
                <div className="p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-lg flex justify-between items-center mt-2">
                  <div>
                    <div className="font-bold text-slate-200">AI Project Improver</div>
                    <div className="text-[10px] text-slate-400">Enhance descriptions using action verbs.</div>
                  </div>
                  <div className="px-3 py-1 rounded bg-brand-purple text-white text-[10px] font-bold">Optimize</div>
                </div>
              </div>
            </div>

            {/* Mock Right Preview */}
            <div className="p-4 rounded-lg border border-brand-cyan/15 bg-slate-950 flex flex-col gap-3 relative shadow-inner overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">ATS SCORE: 94%</div>
              <div className="border-b border-slate-850 pb-2">
                <div className="h-5 w-36 bg-gradient-to-r from-brand-purple to-brand-cyan rounded mb-1.5" />
                <div className="h-3 w-24 bg-slate-850 rounded" />
              </div>
              <div className="space-y-2 mt-1">
                <div className="h-3 w-16 bg-slate-850 rounded" />
                <div className="space-y-1">
                  <div className="h-2.5 w-full bg-slate-900 rounded" />
                  <div className="h-2.5 w-[90%] bg-slate-900 rounded" />
                  <div className="h-2.5 w-[75%] bg-slate-900 rounded" />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-3 w-20 bg-slate-850 rounded" />
                <div className="h-14 w-full border border-slate-850 rounded p-2 text-[9px] text-slate-450 font-sans">
                  🏆 <span className="font-bold">Project Fragranzia E-commerce:</span> Engineered stateful cart management reducing rendering cycles.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================== */}
      {/* FEATURES SECTION */}
      {/* ============================================================== */}
      <section id="features" className={`py-20 border-t ${
        isDark ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Powerful tools built to accelerate your career.
            </h2>
            <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Everything you need to polish your professional identity, ace automated screenings, and present your work elegantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-purple/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-purple/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Summary Builder</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Synthesize achievements, education, and target stack parameters into a premium, keyword-rich statement.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-cyan/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-cyan/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">ATS Score Checker</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Audit your resume layout instantly. Identify missing keywords, formatting errors, and get actionable suggestions.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-purple/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-purple/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Styling</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Change fonts, colors, and margins in real-time. Apply Modern, Minimalist, or Professional templates instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-cyan/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-cyan/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-4">
                <Download size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">High-Quality Export</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Export clean, multi-page, pixel-perfect PDF resumes optimized for automatic parser crawlers.
              </p>
            </div>

            {/* Feature 5 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-purple/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-purple/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Custom Templates</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Select from Modern, Minimal, Developer, and Creative patterns. Adjust spacing, fonts, and accents instantly.
              </p>
            </div>

            {/* Feature 6 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-cyan/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-cyan/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-4">
                <Eye size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-time Analytics</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Monitor downloads, view counts, and traffic channels (such as LinkedIn or Direct) on charts.
              </p>
            </div>

            {/* Feature 7 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-purple/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-purple/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4">
                <Share2 size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">QR Code Sharing</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Generate sharing cards containing QR codes mapping directly to your online PDF resume download file.
              </p>
            </div>

            {/* Feature 8 */}
            <div 
              onClick={ctaAction}
              className={`p-6 rounded-xl border hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80 hover:border-brand-cyan/50' : 'bg-white border-slate-200 hover:shadow-lg hover:border-brand-cyan/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Project Improver</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                Convert basic task names into impact-focused project bullet points demonstrating quantifiable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* HOW IT WORKS */}
      {/* ============================================================== */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Design your professional presence in four steps.
          </h2>
          <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Simple, automated wizard logic helps you generate premium assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className={`hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] z-0 ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`} />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-lg border-4 border-slate-950 shadow-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-lg mb-2">Create Resume</h3>
            <p className={`text-sm max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Input details via our reactive builder wizard fields or import old summaries.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-brand-cyan text-white flex items-center justify-center font-bold text-lg border-4 border-slate-950 shadow-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-lg mb-2">AI Refinement</h3>
            <p className={`text-sm max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Let AI rephrase descriptions using strong action verbs and recommend missing skills.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-lg border-4 border-slate-950 shadow-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-lg mb-2">Visual Layouts</h3>
            <p className={`text-sm max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Select from multiple layouts (Modern, Professional, Minimal) and customize colors.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-brand-cyan text-white flex items-center justify-center font-bold text-lg border-4 border-slate-950 shadow-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-lg mb-2">Download PDF</h3>
            <p className={`text-sm max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Download your recruiter-ready, ATS-compliant PDF resume instantly.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SHOWCASE TEMPLATES */}
      {/* ============================================================== */}
      <section id="templates" className={`py-20 border-t ${
        isDark ? 'border-slate-900 bg-slate-950/20' : 'border-slate-200 bg-slate-100/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Recruiter-tested templates.
            </h2>
            <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Toggle spacing, layouts, and typography. Handcrafted for clean readability.
            </p>
          </div>

          {/* Tab Showcase Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-6 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="px-2.5 py-1 rounded bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider">Modern Style</span>
                <h3 className="text-xl font-bold mt-4 mb-2">Modern Sidebar</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Features a sleek two-column sidebar layout, colored accents, and distinct skills blocks to represent engineering and professional skills.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500 border border-slate-950" />
                <span className="w-6 h-6 rounded-full bg-cyan-400 border border-slate-950" />
                <span className="w-6 h-6 rounded-full bg-emerald-400 border border-slate-950" />
              </div>
            </div>

            <div className={`p-6 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="px-2.5 py-1 rounded bg-brand-cyan/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">Minimalist Style</span>
                <h3 className="text-xl font-bold mt-4 mb-2">Elegant Minimal</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Clean margins, sleek line spacers, and high typography weights. Focuses purely on clean textual descriptions.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-950" />
                <span className="w-6 h-6 rounded-full bg-slate-600 border border-slate-950" />
                <span className="w-6 h-6 rounded-full bg-slate-350 border border-slate-950" />
              </div>
            </div>

            <div className={`p-6 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="px-2.5 py-1 rounded bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider">Corporate Layout</span>
                <h3 className="text-xl font-bold mt-4 mb-2">Classic Executive</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Traditional layouts with header margins, formal column alignment, and classic blue elements suited for interviews.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-900 border border-slate-950" />
                <span className="w-6 h-6 rounded-full bg-slate-700 border border-slate-950" />
                <span className="w-6 h-6 rounded-full bg-zinc-800 border border-slate-950" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TESTIMONIALS */}
      {/* ============================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Approved by professionals.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-6 rounded-xl border relative ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className={`text-sm leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              "The ATS Checker is amazing. It immediately identified that I was missing the keyword 'Kubernetes' in my developer profile. Added it and got 3 interviews in a week!"
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white">S</div>
              <div>
                <div className="font-bold text-sm">Sarah Jenkins</div>
                <div className="text-xs text-slate-505">React Developer</div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border relative ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className={`text-sm leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              "The custom layouts and styles saved me hours. I simply compiled my experiences in the resume builder, selected a minimalist theme, and downloaded my PDF resume."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-white">M</div>
              <div>
                <div className="font-bold text-sm">Marcus Chen</div>
                <div className="text-xs text-slate-505">Full Stack Engineer</div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border relative ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className={`text-sm leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              "The AI description helper was a lifesaver. I wrote down short project sentences and it expanded them into bullet points using action verbs."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white">A</div>
              <div>
                <div className="font-bold text-sm">Alex Petrov</div>
                <div className="text-xs text-slate-505">CS Student</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PRICING SECTION */}
      {/* ============================================================== */}
      <section id="pricing" className={`py-20 border-t ${
        isDark ? 'border-slate-900 bg-slate-950/30' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Start for free and upgrade as you grow your career assets.
            </p>

            {/* Toggle Billing */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full border mt-6 bg-slate-900/50 border-slate-800">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-brand-purple text-white' : 'text-slate-400'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  billingCycle === 'yearly' ? 'bg-brand-purple text-white' : 'text-slate-400'
                }`}
              >
                Yearly <span className="px-1.5 py-0.2 rounded bg-brand-cyan text-slate-950 text-[9px] font-extrabold uppercase">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div>
                <h3 className="text-xl font-bold mb-2">Free Plan</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Perfect for freshers and student project drafts.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}> / forever</span>
                </div>
                <hr className={`my-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> 1 Active Resume Draft
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> 3 AI Optimizations per month
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> Basic PDF Print Layouts
                  </li>
                  <li className="flex items-center gap-2.5 opacity-40">
                    <X size={16} className="text-red-500" /> Advanced AI Refinements
                  </li>
                  <li className="flex items-center gap-2.5 opacity-40">
                    <X size={16} className="text-red-500" /> Live Visitor Charts
                  </li>
                </ul>
              </div>
              <button 
                onClick={ctaAction}
                className={`w-full mt-8 py-3 rounded-lg font-bold border transition-colors ${
                  isDark 
                    ? 'border-slate-800 hover:bg-slate-900 text-slate-200' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border bg-slate-900 border-brand-purple relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-brand-purple text-white text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-bl-lg tracking-wider">Recommended</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Pro Plan</h3>
                <p className="text-xs text-slate-400">Suited for job seekers, professionals, and freelancers.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '$12' : '$9'}
                  </span>
                  <span className="text-sm text-slate-400"> / month</span>
                </div>
                <hr className="my-6 border-slate-800" />
                <ul className="space-y-4 text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> Unlimited Resumes Creation
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> Unlimited AI Optimization Tasks
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> Access to Premium Layouts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> Advanced AI Tools & ATS Auditing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> Daily Traffic Analytics Charts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-brand-cyan" /> Google OAuth integration options
                  </li>
                </ul>
              </div>
              <button 
                onClick={ctaAction}
                className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-brand-purple-dark hover:to-brand-cyan-dark text-white font-bold shadow-lg shadow-brand-purple/20"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FAQ SECTION */}
      {/* ============================================================== */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-left">
          {[
            {
              q: "How does the AI Resume Summary generator work?",
              a: "The generator takes your active skills checklist, work experiences, and academic achievements, and sends them to the Gemini API. The AI then synthesizes a professional, high-impact paragraph optimized with action words and industry keywords."
            },
            {
              q: "What is an ATS score?",
              a: "An ATS (Applicant Tracking System) is software used by recruiters to filter resumes. Our checker scans your resume for keyword matches, sections alignment, contact completeness, and formatting, computing a compatibility score out of 100 with improvement tips."
            },
            {
              q: "Does this support custom resume styling options?",
              a: "Yes! You can customize fonts (Inter, Outfit, Playfair, Fira Code), select primary color schemes, and adjust line padding/margins from tight to loose in real-time."
            },
            {
              q: "How does the PDF download format stay ATS-compliant?",
              a: "Our exporter creates standard clean PDF formats, ensuring headers, tables, bullet points, and line text elements remain indexable and crawlable by candidate tracking parsers (avoiding SVG/image layouts that lock texts)."
            }
          ].map((item, index) => (
            <div 
              key={index}
              className={`rounded-xl border transition-colors ${
                isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between font-semibold text-sm sm:text-base text-left"
              >
                <span>{item.q}</span>
                <span className={`text-brand-cyan transition-transform duration-200 ${activeFaq === index ? 'rotate-90' : ''}`}>
                  <ChevronRight size={18} />
                </span>
              </button>
              {activeFaq === index && (
                <div className={`px-6 pb-5 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* FOOTER */}
      {/* ============================================================== */}
      <footer className={`py-12 border-t text-sm ${
        isDark ? 'border-slate-900 bg-slate-950 text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold">🛠️</span>
              <span className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>CareerCraft.AI</span>
            </div>
            <p className="text-xs">Build ATS-friendly resumes in minutes with AI.</p>
          </div>
          <div>
            <h4 className={`font-bold mb-3 ${isDark ? 'text-slate-350' : 'text-slate-800'}`}>Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-brand-cyan transition-colors">Features</a></li>
              <li><a href="#templates" className="hover:text-brand-cyan transition-colors">Templates</a></li>
              <li><a href="#pricing" className="hover:text-brand-cyan transition-colors">Pricing Plans</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-3 ${isDark ? 'text-slate-350' : 'text-slate-800'}`}>Company</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-brand-cyan cursor-pointer">About Us</span></li>
              <li><span className="hover:text-brand-cyan cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-brand-cyan cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-3 ${isDark ? 'text-slate-350' : 'text-slate-800'}`}>Support</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-brand-cyan cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-brand-cyan cursor-pointer">Contact Support</span></li>
              <li><span className="hover:text-brand-cyan cursor-pointer">API System Status</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t mt-8 pt-6 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© 2026 CareerCraft AI Inc. All rights reserved.</p>
          <p>Crafted by pair-programming with Antigravity.</p>
        </div>
      </footer>
    </div>
  );
}
