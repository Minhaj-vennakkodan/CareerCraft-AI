import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, FileText, Download, Globe, Shield, RefreshCw, Plus, Trash2, 
  ChevronDown, ChevronUp, Save, Eye, ArrowLeft, Send, Check, QrCode, Loader, X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { useBuilder } from '../context/BuilderContext';
import { useTheme } from '../context/ThemeContext';
import ResumeTemplates from '../templates/ResumeTemplates';

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const { 
    resume, loading, saving, error, loadResume, updateLocalResume, forceSave 
  } = useBuilder();

  // Navigation tabs: 'edit' or 'ats'
  const [activeTab, setActiveTab] = useState('edit');
  // Expandable accordions
  const [activeSection, setActiveSection] = useState('personal');

  // AI loading indicators
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  // ATS Analysis results state
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);

  // Cover Letter generation state
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);



  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  // Handle personal info edits
  const handlePersonalInfoChange = (field, val) => {
    updateLocalResume({
      personalInfo: {
        ...resume.personalInfo,
        [field]: val
      }
    });
  };

  // Helper to add list items
  const addListItem = (sectionName, defaultValue) => {
    updateLocalResume({
      [sectionName]: [...(resume[sectionName] || []), defaultValue]
    });
  };

  // Helper to update list items
  const updateListItem = (sectionName, index, updatedObj) => {
    const newList = [...(resume[sectionName] || [])];
    newList[index] = { ...newList[index], ...updatedObj };
    updateLocalResume({ [sectionName]: newList });
  };

  // Helper to delete list items
  const deleteListItem = (sectionName, index) => {
    const newList = [...(resume[sectionName] || [])];
    newList.splice(index, 1);
    updateLocalResume({ [sectionName]: newList });
  };

  // ==========================================
  // AI INTEGRATION HANDLERS
  // ==========================================
  
  // AI Summary Generator
  const generateAISummary = async () => {
    if (!resume.skills?.length && !resume.experience?.length) {
      alert("Please add some skills or experiences first so the AI has context.");
      return;
    }
    setAiLoading(true);
    try {
      const skillsCsv = resume.skills.map(s => s.name).join(', ');
      const expCsv = resume.experience.map(e => `${e.position} at ${e.company}`).join(', ');
      const eduCsv = resume.education.map(e => e.institution).join(', ');

      const res = await api.post('/ai/resume-summary', {
        skills: skillsCsv,
        experience: expCsv,
        education: eduCsv
      });
      updateLocalResume({ summary: res.data.summary });
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Project Description Generator
  const generateAIProjectBullets = async (index) => {
    const project = resume.projects[index];
    if (!project.title) {
      alert("Please provide a project name first.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post('/ai/project-description', {
        projectName: project.title,
        technologies: (project.technologies || []).join(', ')
      });
      const bulletsText = res.data.bullets.join('\n');
      updateListItem('projects', index, { description: bulletsText });
    } catch (err) {
      console.error('Failed to generate project bullet points:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Skill Suggestions
  const getAISkillSuggestions = async () => {
    const role = resume.personalInfo?.title;
    if (!role) {
      alert("Please specify a job title in your Personal Details first.");
      return;
    }
    setAiLoading(true);
    setAiSuggestions(null);
    try {
      const res = await api.post('/ai/skills', {
        jobRole: role,
        experience: 'Mid Level'
      });
      setAiSuggestions(res.data.skills);
    } catch (err) {
      console.error('Failed to generate suggested skills:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Text Polisher / Enhancer
  const polishTextSection = async (section, index, originalText, isSummary = false) => {
    if (!originalText.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/enhance', { text: originalText });
      if (isSummary) {
        updateLocalResume({ summary: res.data.text });
      } else {
        updateListItem(section, index, { description: res.data.text });
      }
    } catch (err) {
      console.error('Failed to polish text:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // ==========================================
  // ATS CHECKER HANDLER
  // ==========================================
  const runATSScan = async () => {
    setAtsLoading(true);
    setAtsAnalysis(null);
    try {
      const res = await api.post('/ai/ats-check', { resumeData: resume });
      setAtsAnalysis(res.data.analysis);
      setActiveTab('ats');
    } catch (err) {
      console.error('ATS evaluation error:', err);
    } finally {
      setAtsLoading(false);
    }
  };

  // AI Cover Letter Generator
  const generateAICoverLetter = async () => {
    if (!jobTitle || !companyName) {
      alert("Please specify a job title and company name first.");
      return;
    }
    setCoverLetterLoading(true);
    setCoverLetterText('');
    try {
      const res = await api.post('/ai/cover-letter', {
        resumeData: resume,
        jobTitle,
        companyName,
        jobDescription
      });
      setCoverLetterText(res.data.coverLetter);
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setCoverLetterLoading(false);
    }
  };



  // ==========================================
  // PDF EXPORT
  // ==========================================
  const handleDownloadPDF = async () => {
    await forceSave();
    // Log download action for analytics
    await api.post('/analytics/download', { resumeId: resume._id });
    window.print();
  };

  if (loading || !resume) {
    return (
      <div className="min-h-screen bg-brand-deepblue-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-brand-purple inline-block animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading Resume Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-brand-deepblue-dark text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* ============================================================== */}
      {/* HEADER CONTROL BAR */}
      {/* ============================================================== */}
      <header className={`sticky top-0 z-40 border-b no-print backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-950/80 border-slate-850' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className={`p-2 rounded-lg border transition-colors ${
              isDark ? 'border-slate-800 hover:bg-slate-900 text-slate-400' : 'border-slate-250 hover:bg-slate-100 text-slate-650'
            }`}>
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base leading-none">{resume.title}</h2>
              <span className="text-[10px] text-slate-505 flex items-center gap-1.5 mt-1">
                {saving ? (
                  <>
                    <RefreshCw size={10} className="animate-spin text-brand-purple-light" /> Auto-saving...
                  </>
                ) : (
                  <>
                    <Check size={10} className="text-brand-success" /> Auto-saved
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Run ATS Check */}
            <button 
              onClick={runATSScan}
              disabled={atsLoading}
              className={`px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800 text-slate-350 hover:bg-slate-900' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {atsLoading ? <Loader size={14} className="animate-spin" /> : <Shield size={14} className="text-brand-cyan" />}
              ATS Checker
            </button>



            {/* Download PDF */}
            <button 
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-lg bg-brand-cyan hover:bg-brand-cyan-dark text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* WORKSPACE BODY */}
      {/* ============================================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-[1700px] w-full mx-auto p-4 sm:p-6 gap-6 min-h-[calc(100vh-64px)]">
        
        {/* ==================== LEFT EDITOR PANEL ==================== */}
        <div className="flex flex-col gap-4 no-print text-left">
          
          {/* Tab Selector */}
          <div className="flex border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-colors ${
                activeTab === 'edit' 
                  ? 'border-brand-purple text-brand-purple-light font-extrabold' 
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              Resume Editor
            </button>
            <button 
              onClick={() => { if (atsAnalysis) setActiveTab('ats'); else runATSScan(); }}
              className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'ats' 
                  ? 'border-brand-purple text-brand-purple-light font-extrabold' 
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              ATS Audit Report {atsAnalysis && `(${atsAnalysis.score}%)`}
            </button>
            <button 
              onClick={() => setActiveTab('cover')}
              className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'cover' 
                  ? 'border-brand-purple text-brand-purple-light font-extrabold' 
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              <Sparkles size={14} className="text-brand-cyan" /> AI Cover Letter
            </button>
          </div>

          {/* ==================== TABS CONTENT ==================== */}
          <AnimatePresence mode="wait">
            
            {/* EDIT VIEW */}
            {activeTab === 'edit' && (
              <motion.div 
                key="edit-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 overflow-y-auto max-h-[80vh] pr-2 pb-10"
              >
                
                {/* 1. Personal Details */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'personal' ? '' : 'personal')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Personal Information</span>
                    {activeSection === 'personal' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'personal' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-semibold">
                      <div>
                        <label className="block text-slate-450 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={resume.personalInfo.name} 
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-450 mb-1">Job Title</label>
                        <input 
                          type="text" 
                          value={resume.personalInfo.title} 
                          onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-450 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={resume.personalInfo.email} 
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-450 mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          value={resume.personalInfo.phone} 
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-450 mb-1">Location (City, Country)</label>
                        <input 
                          type="text" 
                          value={resume.personalInfo.location} 
                          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-450 mb-1">LinkedIn Profile</label>
                        <input 
                          type="text" 
                          value={resume.personalInfo.linkedin} 
                          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-450 mb-1">GitHub Username</label>
                        <input 
                          type="text" 
                          value={resume.personalInfo.github} 
                          onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-450 mb-1">Website URL</label>
                        <input 
                          type="text" 
                          value={resume.personalInfo.website} 
                          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                          className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                            isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Professional Summary */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center font-bold text-base mb-2">
                    <button 
                      onClick={() => setActiveSection(activeSection === 'summary' ? '' : 'summary')}
                      className="flex-1 flex justify-between items-center text-left"
                    >
                      <span>Professional Summary</span>
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={generateAISummary}
                        disabled={aiLoading}
                        className="px-2.5 py-1 rounded bg-brand-purple/20 text-brand-purple-light hover:bg-brand-purple text-xs font-bold flex items-center gap-1"
                      >
                        <Sparkles size={12} /> AI Generate
                      </button>
                      {activeSection === 'summary' ? <ChevronUp size={16} onClick={() => setActiveSection('')} /> : <ChevronDown size={16} onClick={() => setActiveSection('summary')} />}
                    </div>
                  </div>

                  {activeSection === 'summary' && (
                    <div className="mt-4 space-y-3">
                      <textarea 
                        rows={4}
                        value={resume.summary}
                        onChange={(e) => updateLocalResume({ summary: e.target.value })}
                        className={`w-full p-3 rounded text-xs border focus:outline-none focus:ring-1 focus:ring-brand-purple leading-relaxed ${
                          isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                      <button 
                        onClick={() => polishTextSection('summary', null, resume.summary, true)}
                        className="px-3 py-1.5 rounded border text-xs font-semibold text-slate-300 border-slate-750 hover:bg-slate-900 flex items-center gap-1.5"
                      >
                        <Sparkles size={12} className="text-brand-cyan" /> Polish summary keywords
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Education */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'education' ? '' : 'education')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Education ({resume.education?.length || 0})</span>
                    {activeSection === 'education' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'education' && (
                    <div className="mt-4 space-y-4">
                      {resume.education?.map((edu, index) => (
                        <div key={index} className="p-3.5 rounded border border-slate-800 bg-slate-950/20 space-y-3 relative">
                          <button 
                            onClick={() => deleteListItem('education', index)}
                            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-500 mb-1">Institution</label>
                              <input 
                                type="text" 
                                value={edu.institution || ''}
                                onChange={(e) => updateListItem('education', index, { institution: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Degree / Certification</label>
                              <input 
                                type="text" 
                                value={edu.degree || ''}
                                onChange={(e) => updateListItem('education', index, { degree: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Field of Study</label>
                              <input 
                                type="text" 
                                value={edu.fieldOfStudy || ''}
                                onChange={(e) => updateListItem('education', index, { fieldOfStudy: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">GPA / Score</label>
                              <input 
                                type="text" 
                                value={edu.gpa || ''}
                                onChange={(e) => updateListItem('education', index, { gpa: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Start Date</label>
                              <input 
                                type="text" 
                                placeholder="MM/YYYY"
                                value={edu.startDate || ''}
                                onChange={(e) => updateListItem('education', index, { startDate: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">End Date (or Current)</label>
                              <input 
                                type="text" 
                                placeholder="MM/YYYY or Present"
                                value={edu.endDate || ''}
                                onChange={(e) => updateListItem('education', index, { endDate: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addListItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Education Record
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Experience */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Work Experience ({resume.experience?.length || 0})</span>
                    {activeSection === 'experience' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'experience' && (
                    <div className="mt-4 space-y-4">
                      {resume.experience?.map((exp, index) => (
                        <div key={index} className="p-3.5 rounded border border-slate-800 bg-slate-950/20 space-y-3 relative">
                          <button 
                            onClick={() => deleteListItem('experience', index)}
                            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-505 mb-1">Company / Organization</label>
                              <input 
                                type="text" 
                                value={exp.company || ''}
                                onChange={(e) => updateListItem('experience', index, { company: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Role / Position</label>
                              <input 
                                type="text" 
                                value={exp.position || ''}
                                onChange={(e) => updateListItem('experience', index, { position: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Start Date</label>
                              <input 
                                type="text" 
                                placeholder="MM/YYYY"
                                value={exp.startDate || ''}
                                onChange={(e) => updateListItem('experience', index, { startDate: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">End Date (or Present)</label>
                              <input 
                                type="text" 
                                placeholder="MM/YYYY or Present"
                                value={exp.endDate || ''}
                                onChange={(e) => updateListItem('experience', index, { endDate: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-slate-505">Description & Impact</label>
                                <button 
                                  onClick={() => polishTextSection('experience', index, exp.description)}
                                  className="text-[10px] text-brand-cyan hover:underline font-bold flex items-center gap-1"
                                >
                                  <Sparkles size={10} /> AI Polish bullets
                                </button>
                              </div>
                              <textarea 
                                rows={3}
                                value={exp.description || ''}
                                onChange={(e) => updateListItem('experience', index, { description: e.target.value })}
                                className="w-full p-2.5 rounded bg-slate-950/50 border border-slate-800 text-white font-mono text-[11px] leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addListItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', description: '' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Work Experience
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Projects */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'projects' ? '' : 'projects')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Projects ({resume.projects?.length || 0})</span>
                    {activeSection === 'projects' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'projects' && (
                    <div className="mt-4 space-y-4">
                      {resume.projects?.map((proj, index) => (
                        <div key={index} className="p-3.5 rounded border border-slate-800 bg-slate-950/20 space-y-3 relative">
                          <button 
                            onClick={() => deleteListItem('projects', index)}
                            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-505 mb-1">Project Name</label>
                              <input 
                                type="text" 
                                value={proj.title || ''}
                                onChange={(e) => updateListItem('projects', index, { title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Project Link (or GitHub)</label>
                              <input 
                                type="text" 
                                value={proj.link || ''}
                                onChange={(e) => updateListItem('projects', index, { link: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-slate-505 mb-1">Technologies used (Comma separated)</label>
                              <input 
                                type="text" 
                                placeholder="React, Node.js, Tailwind CSS"
                                value={(proj.technologies || []).join(', ')}
                                onChange={(e) => updateListItem('projects', index, { technologies: e.target.value.split(',').map(s => s.trim()) })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-slate-505">Details & Description</label>
                                <button 
                                  onClick={() => generateAIProjectBullets(index)}
                                  className="text-[10px] text-brand-purple-light hover:underline font-bold flex items-center gap-1"
                                >
                                  <Sparkles size={10} /> AI Generate impact bullet points
                                </button>
                              </div>
                              <textarea 
                                rows={3}
                                value={proj.description || ''}
                                onChange={(e) => updateListItem('projects', index, { description: e.target.value })}
                                className="w-full p-2.5 rounded bg-slate-950/50 border border-slate-800 text-white font-mono text-[11px] leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addListItem('projects', { title: '', description: '', technologies: [], link: '' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Project Details
                      </button>
                    </div>
                  )}
                </div>

                {/* 6. Skills */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center font-bold text-base mb-2">
                    <button 
                      onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')}
                      className="flex-1 flex justify-between items-center text-left"
                    >
                      <span>Skills ({resume.skills?.length || 0})</span>
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={getAISkillSuggestions}
                        disabled={aiLoading}
                        className="px-2.5 py-1 rounded bg-brand-purple/20 text-brand-purple-light hover:bg-brand-purple text-xs font-bold flex items-center gap-1"
                      >
                        <Sparkles size={12} /> AI Suggest
                      </button>
                      {activeSection === 'skills' ? <ChevronUp size={16} onClick={() => setActiveSection('')} /> : <ChevronDown size={16} onClick={() => setActiveSection('skills')} />}
                    </div>
                  </div>

                  {activeSection === 'skills' && (
                    <div className="mt-4 space-y-4">
                      {/* Render suggested tags */}
                      {aiSuggestions && (
                        <div className="p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-lg">
                          <span className="block text-[10px] text-brand-purple-light font-extrabold uppercase tracking-wide mb-2">Suggested Skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {aiSuggestions.map(sk => (
                              <button
                                key={sk}
                                onClick={() => {
                                  if (!resume.skills.find(s => s.name.toLowerCase() === sk.toLowerCase())) {
                                    addListItem('skills', { name: sk, level: 'Intermediate' });
                                  }
                                }}
                                className="px-2 py-0.5 rounded bg-brand-deepblue-light border border-slate-800 text-[10px] text-slate-300 hover:border-brand-purple hover:text-white"
                              >
                                + {sk}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                        {resume.skills?.map((sk, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              value={sk.name || ''}
                              onChange={(e) => updateListItem('skills', index, { name: e.target.value })}
                              className="flex-1 px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              placeholder="React, CSS, SQL..."
                            />
                            <select
                              value={sk.level || 'None'}
                              onChange={(e) => updateListItem('skills', index, { level: e.target.value })}
                              className="px-2 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                            >
                              <option value="None">Level (None)</option>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Expert">Expert</option>
                            </select>
                            <button 
                              onClick={() => deleteListItem('skills', index)}
                              className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => addListItem('skills', { name: '', level: 'None' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Skill Tag
                      </button>
                    </div>
                  )}
                </div>

                {/* 7. Certifications */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'certifications' ? '' : 'certifications')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Certifications ({resume.certifications?.length || 0})</span>
                    {activeSection === 'certifications' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'certifications' && (
                    <div className="mt-4 space-y-4">
                      {resume.certifications?.map((cert, index) => (
                        <div key={index} className="p-3.5 rounded border border-slate-800 bg-slate-950/20 space-y-3 relative">
                          <button 
                            onClick={() => deleteListItem('certifications', index)}
                            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-505 mb-1">Certification Title</label>
                              <input 
                                type="text" 
                                value={cert.name || ''}
                                onChange={(e) => updateListItem('certifications', index, { name: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Issuing Authority</label>
                              <input 
                                type="text" 
                                value={cert.issuer || ''}
                                onChange={(e) => updateListItem('certifications', index, { issuer: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Issue Date</label>
                              <input 
                                type="text" 
                                placeholder="MM/YYYY"
                                value={cert.issueDate || ''}
                                onChange={(e) => updateListItem('certifications', index, { issueDate: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Credential URL Link</label>
                              <input 
                                type="text" 
                                value={cert.link || ''}
                                onChange={(e) => updateListItem('certifications', index, { link: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addListItem('certifications', { name: '', issuer: '', issueDate: '', link: '' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Certification Record
                      </button>
                    </div>
                  )}
                </div>

                {/* 8. Achievements */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'achievements' ? '' : 'achievements')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Achievements ({resume.achievements?.length || 0})</span>
                    {activeSection === 'achievements' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'achievements' && (
                    <div className="mt-4 space-y-4">
                      {resume.achievements?.map((ach, index) => (
                        <div key={index} className="p-3.5 rounded border border-slate-800 bg-slate-950/20 space-y-3 relative">
                          <button 
                            onClick={() => deleteListItem('achievements', index)}
                            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="grid grid-cols-1 gap-3 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-505 mb-1">Title</label>
                              <input 
                                type="text" 
                                value={ach.title || ''}
                                onChange={(e) => updateListItem('achievements', index, { title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                                placeholder="Winner of hackathon, Best employee..."
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Description</label>
                              <textarea 
                                rows={2}
                                value={ach.description || ''}
                                onChange={(e) => updateListItem('achievements', index, { description: e.target.value })}
                                className="w-full p-2 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addListItem('achievements', { title: '', description: '' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Achievement
                      </button>
                    </div>
                  )}
                </div>

                {/* 9. Languages */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'languages' ? '' : 'languages')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Languages ({resume.languages?.length || 0})</span>
                    {activeSection === 'languages' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'languages' && (
                    <div className="mt-4 space-y-4">
                      {resume.languages?.map((lang, index) => (
                        <div key={index} className="p-3.5 rounded border border-slate-800 bg-slate-950/20 space-y-3 relative">
                          <button 
                            onClick={() => deleteListItem('languages', index)}
                            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-505 mb-1">Language</label>
                              <input 
                                type="text" 
                                value={lang.name || ''}
                                onChange={(e) => updateListItem('languages', index, { name: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                                placeholder="English, Malayalam..."
                              />
                            </div>
                            <div>
                              <label className="block text-slate-550 mb-1">Proficiency</label>
                              <input 
                                type="text" 
                                value={lang.proficiency || ''}
                                onChange={(e) => updateListItem('languages', index, { proficiency: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                                placeholder="Native, Professional..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addListItem('languages', { name: '', proficiency: '' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Language
                      </button>
                    </div>
                  )}
                </div>

                {/* 10. Custom Sections */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => setActiveSection(activeSection === 'custom' ? '' : 'custom')}
                    className="w-full flex justify-between items-center font-bold text-base"
                  >
                    <span>Custom Sections ({resume.customSections?.length || 0})</span>
                    {activeSection === 'custom' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {activeSection === 'custom' && (
                    <div className="mt-4 space-y-4">
                      {resume.customSections?.map((csec, index) => (
                        <div key={index} className="p-3.5 rounded border border-slate-800 bg-slate-950/20 space-y-3 relative">
                          <button 
                            onClick={() => deleteListItem('customSections', index)}
                            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="grid grid-cols-1 gap-3 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-505 mb-1">Section Title</label>
                              <input 
                                type="text" 
                                value={csec.title || ''}
                                onChange={(e) => updateListItem('customSections', index, { title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded bg-slate-950/50 border border-slate-800 text-white"
                                placeholder="Extra Activities, Reference Links..."
                              />
                            </div>
                            <div>
                              <label className="block text-slate-505 mb-1">Section Content</label>
                              <textarea 
                                rows={3}
                                value={csec.content || ''}
                                onChange={(e) => updateListItem('customSections', index, { content: e.target.value })}
                                className="w-full p-2 rounded bg-slate-950/50 border border-slate-800 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addListItem('customSections', { title: '', content: '' })}
                        className="w-full py-2.5 rounded border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} /> Add Custom Section
                      </button>
                    </div>
                  )}
                </div>

                {/* Styling Customs Customizer */}
                <div className={`p-4 rounded-xl border border-brand-purple/20 bg-brand-purple/5`}>
                  <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">⚙️ Template Design Settings</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-400 mb-1">Resume Template Layout</label>
                      <select
                        value={resume.templateName}
                        onChange={(e) => updateLocalResume({ templateName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                      >
                        <option value="Modern">Modern Developer</option>
                        <option value="Professional">Professional Executive</option>
                        <option value="Minimal">Minimal Elegant</option>
                        <option value="Corporate">Classic Corporate</option>
                        <option value="Creative">Bold Asymmetric Accent</option>
                        <option value="Developer">Technical GitHub Theme</option>
                        <option value="Academic">Academic CV</option>
                        <option value="Startup">Vibrant Startup</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Accent Theme Color</label>
                      <div className="flex gap-2 items-center mt-1">
                        <input 
                          type="color" 
                          value={resume.primaryColor}
                          onChange={(e) => updateLocalResume({ primaryColor: e.target.value })}
                          className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{resume.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Font Family Style</label>
                      <select
                        value={resume.fontName}
                        onChange={(e) => updateLocalResume({ fontName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                      >
                        <option value="Inter">Sans-Serif: Inter</option>
                        <option value="Outfit">Modern Sans: Outfit</option>
                        <option value="Playfair Display">Elegant Serif: Playfair</option>
                        <option value="Fira Code">Terminal Mono: Fira Code</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Margins & Line Spacing</label>
                      <select
                        value={resume.spacing}
                        onChange={(e) => updateLocalResume({ spacing: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                      >
                        <option value="Tight">Tight spacing</option>
                        <option value="Normal">Normal spacing</option>
                        <option value="Loose">Loose spacing</option>
                      </select>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ATS ANALYSIS VIEW */}
            {activeTab === 'ats' && atsAnalysis && (
              <motion.div 
                key="ats-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left"
              >
                {/* Score Circle Progress */}
                <div className={`p-6 rounded-xl border flex flex-col sm:flex-row items-center gap-6 ${
                  isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full rotate-[-90deg]">
                      <circle cx="56" cy="56" r="48" className="stroke-slate-850 fill-none" strokeWidth="8" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="48" 
                        className="stroke-brand-cyan fill-none transition-all duration-1000" 
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - atsAnalysis.score / 100)}
                      />
                    </svg>
                    <span className="absolute text-2xl font-black text-white">{atsAnalysis.score}%</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-extrabold text-base mb-1">ATS Optimization Grade</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                      {atsAnalysis.score >= 80 ? 'Your resume is highly optimized for recruiter bots!' : 'Your resume requires optimization. Follow recommendations below.'}
                    </p>
                    <button 
                      onClick={runATSScan}
                      disabled={atsLoading}
                      className="px-3 py-1.5 mt-3 rounded bg-slate-950 border border-slate-850 hover:bg-slate-900 font-bold text-[10px] text-slate-350 flex items-center gap-1.5"
                    >
                      <RefreshCw size={10} className={atsLoading ? 'animate-spin' : ''} /> Re-scan Resume Layout
                    </button>
                  </div>
                </div>

                {/* Missing Keywords Box */}
                <div className={`p-5 rounded-xl border ${
                  isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <span className="block text-[10px] text-brand-warning uppercase font-extrabold tracking-wider mb-2">Recommended Missing Keywords:</span>
                  <div className="flex flex-wrap gap-2">
                    {atsAnalysis.missingKeywords?.length === 0 ? (
                      <span className="text-xs text-brand-success">None! All target skill categories matches are valid.</span>
                    ) : (
                      atsAnalysis.missingKeywords?.map(kw => (
                        <button
                          key={kw}
                          onClick={() => {
                            if (!resume.skills.find(s => s.name.toLowerCase() === kw.toLowerCase())) {
                              addListItem('skills', { name: kw, level: 'Intermediate' });
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-brand-warning/10 border border-brand-warning/20 text-brand-warning hover:border-brand-warning text-[10px]"
                        >
                          + Add {kw}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Detailed checklist */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-250">Optimization Recommendations</h4>
                  <div className="space-y-2">
                    {atsAnalysis.suggestions?.map((sug, i) => (
                      <div key={i} className={`p-3 rounded text-xs leading-relaxed flex items-start gap-2.5 ${
                        isDark ? 'bg-slate-950/40 border border-slate-850' : 'bg-white border-slate-250 text-slate-800'
                      }`}>
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* AI COVER LETTER VIEW */}
            {activeTab === 'cover' && (
              <motion.div 
                key="cover-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-left overflow-y-auto max-h-[80vh] pr-2 pb-10"
              >
                <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-200">AI Cover Letter Generator</h3>
                    <p className="text-xs text-slate-400 mt-1">Generate a highly tailored cover letter based on your resume and a target job details.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-400 mb-1">Target Job Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Software Engineer"
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)}
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                          isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Target Company Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Google"
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                          isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="text-xs font-semibold">
                    <label className="block text-slate-400 mb-1">Job Description (Optional)</label>
                    <textarea 
                      rows={5}
                      placeholder="Paste the job description here for a tailored cover letter..."
                      value={jobDescription} 
                      onChange={(e) => setJobDescription(e.target.value)}
                      className={`w-full p-3 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple text-xs leading-relaxed ${
                        isDark ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <button 
                    onClick={generateAICoverLetter}
                    disabled={coverLetterLoading || !jobTitle || !companyName}
                    className="w-full py-2.5 rounded bg-brand-cyan hover:bg-brand-cyan-dark text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {coverLetterLoading ? (
                      <>
                        <Loader size={14} className="animate-spin text-slate-950" /> Generating Cover Letter...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Generate Tailored Cover Letter
                      </>
                    )}
                  </button>
                </div>

                {coverLetterText && (
                  <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-brand-purple-light uppercase tracking-wider">Generated Cover Letter:</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(coverLetterText);
                          alert("Cover letter copied to clipboard!");
                        }}
                        className="px-2.5 py-1 rounded border border-slate-800 hover:bg-slate-900 text-[10px] font-bold text-slate-300 transition-colors"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <textarea 
                      readOnly
                      rows={15}
                      value={coverLetterText}
                      className={`w-full p-3 font-mono text-[11px] leading-relaxed rounded border focus:outline-none focus:ring-0 ${
                        isDark ? 'bg-slate-950/40 border-slate-850 text-slate-350' : 'bg-slate-50 border-slate-250 text-slate-800'
                      }`}
                    />
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ==================== RIGHT PREVIEW PANEL ==================== */}
        <div className="relative border border-slate-850 bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[85vh] p-8 flex flex-col justify-start">
          
          {/* Printable Layout Blueprint */}
          <div id="resume-printable-area" className="print-canvas">
            <ResumeTemplates resume={resume} />
          </div>

        </div>

      </div>
    </div>
  );
}
