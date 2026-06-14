import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, FileText, Globe, Download, Eye, Clock, Trash2, Edit2, 
  ExternalLink, Sparkles, ChevronRight, CheckCircle2, ShieldAlert, X
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();

  const [stats, setStats] = useState({
    totalResumes: 0,
    totalPortfolios: 0,
    resumeViews: 0,
    portfolioViews: 0,
    downloads: 0,
    recentActivity: []
  });

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, resumesRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/resumes')
      ]);

      setStats(statsRes.data.data);
      setResumes(resumesRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateResume = async () => {
    setActionLoading(true);
    try {
      const res = await api.post('/resumes', { title: 'My New Resume' });
      navigate(`/builder/${res.data.data._id}`);
    } catch (err) {
      console.error('Create resume failed:', err);
      if (err.response?.data?.message?.includes('allows only 1 resume')) {
        setShowUpgradeModal(true);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteResume = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume? This will also delete any generated portfolio websites linked to it.')) {
      try {
        await api.delete(`/resumes/${id}`);
        fetchDashboardData(); // Refresh list
      } catch (err) {
        console.error('Delete resume failed:', err);
      }
    }
  };

  const simulateUpgrade = async () => {
    setUpgradeError('');
    try {
      const res = await updateProfile({ subscriptionTier: 'pro' });
      if (res.success) {
        setShowUpgradeModal(false);
        fetchDashboardData(); // Refresh page
      } else {
        setUpgradeError(res.message);
      }
    } catch (err) {
      setUpgradeError('Upgrade simulation failed.');
    }
  };

  // Metric Cards Helper
  const metricCards = [
    { name: 'Total Resumes', value: stats.totalResumes, icon: FileText, color: 'text-brand-purple' },
    { name: 'Downloads logged', value: stats.downloads, icon: Download, color: 'text-brand-warning' },
    { name: 'Resume Templates', value: 6, icon: Globe, color: 'text-brand-cyan' },
    { name: 'AI Enhancements Available', value: 'Unlimited', icon: Sparkles, color: 'text-brand-success' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ============================================================== */}
        {/* METRICS ROW */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div 
                key={i} 
                className={`p-6 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                  isDark ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80' : 'bg-white border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{card.name}</p>
                    <h3 className="text-3xl font-extrabold mt-2 tracking-tight">{card.value}</h3>
                  </div>
                  <span className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-950/50' : 'bg-slate-100'} ${card.color}`}>
                    <Icon size={20} />
                  </span>
                </div>
                {/* Glow detail */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-purple/20 to-brand-cyan/20" />
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* SUBROW: RESUMES & ACTIVITIES */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Resumes Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">My Resumes</h2>
              <button 
                onClick={handleCreateResume}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-brand-purple-dark hover:to-brand-cyan-dark text-white font-semibold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus size={14} /> New Resume
              </button>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-purple animate-spin" />
              </div>
            ) : resumes.length === 0 ? (
              <div className={`p-8 rounded-xl border text-center ${
                isDark ? 'bg-slate-900/20 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <FileText size={36} className="mx-auto text-slate-500 mb-3" />
                <h4 className="font-bold text-base mb-1">No resumes created yet</h4>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Create your first resume with AI helper tools in seconds.</p>
                <button 
                  onClick={handleCreateResume}
                  className="px-4 py-2 rounded-lg bg-brand-purple text-white text-xs font-semibold"
                >
                  Create Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {resumes.map(resume => {
                  return (
                    <div 
                      key={resume._id} 
                      className={`rounded-xl border flex flex-col justify-between overflow-hidden group hover:-translate-y-0.5 transition-all duration-200 ${
                        isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200 hover:shadow-lg'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-base group-hover:text-brand-cyan transition-colors">{resume.title}</h3>
                          <span className="text-[10px] text-slate-505 font-medium flex items-center gap-1">
                            <Clock size={10} /> {new Date(resume.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 my-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isDark ? 'bg-slate-950/60 text-slate-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            Style: {resume.templateName}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isDark ? 'bg-slate-950/60 text-slate-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            Fonts: {resume.fontName || 'Inter'}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className={`px-5 py-3.5 border-t flex justify-between items-center gap-2 ${
                        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-55 border-slate-200'
                      }`}>
                        <button 
                          onClick={() => handleDeleteResume(resume._id, event)}
                          className="p-2 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 size={13} />
                        </button>
                        <div className="flex gap-2">
                          <Link 
                            to={`/builder/${resume._id}`}
                            className="px-4 py-1.5 rounded bg-brand-purple text-white hover:bg-brand-purple-dark font-semibold text-xs flex items-center gap-1"
                          >
                            <Edit2 size={12} /> Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Side: Activities Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
            <div className={`p-5 rounded-xl border ${
              isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {loading ? (
                <div className="h-40 flex items-center justify-center">
                  <span className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-brand-purple animate-spin" />
                </div>
              ) : stats.recentActivity.length === 0 ? (
                <p className={`text-xs text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>No events logged yet.</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentActivity.map(act => (
                    <div key={act.id} className="flex gap-3 text-xs text-left items-start">
                      <div className="p-1.5 rounded-lg mt-0.5 bg-brand-warning/10 text-brand-warning">
                        <Download size={14} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          Resume Downloaded
                        </p>
                        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          Via {act.source} • {new Date(act.time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Promo banner */}
            {user?.subscriptionTier === 'free' && (
              <div className="p-5 rounded-xl border border-brand-purple bg-gradient-to-tr from-brand-purple/10 to-brand-cyan/5 flex flex-col gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-purple/20 text-brand-purple flex items-center justify-center">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Unlock Pro Features</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Upgrade to generate unlimited resumes, access premium portfolio themes, and analyze traffic logs daily.</p>
                </div>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-2 rounded-lg bg-brand-purple hover:bg-brand-purple-dark text-white font-bold text-xs"
                >
                  Upgrade for $12/mo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* UPGRADE PRO SIMULATOR MODAL */}
      {/* ============================================================== */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border text-left relative ${
            isDark ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'
          }`}>
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-350"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4 text-brand-purple-light">
              <Sparkles size={20} className="animate-bounce" />
              <h3 className="font-extrabold text-lg">Upgrade to CareerCraft Pro</h3>
            </div>

            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              You have hit the limits of the Free Plan. Pro tier includes everything you need for job applications:
            </p>

            <ul className="space-y-2.5 text-xs mb-6 font-semibold">
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={14} className="text-brand-cyan" /> Unlimited resumes creation
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={14} className="text-brand-cyan" /> Access to premium design templates
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={14} className="text-brand-cyan" /> Full access to AI ATS score check audits
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={14} className="text-brand-cyan" /> Google OAuth integration options
              </li>
            </ul>

            {upgradeError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1.5 rounded-lg text-xs mb-4">
                {upgradeError}
              </div>
            )}

            <button 
              onClick={simulateUpgrade}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-brand-purple-dark hover:to-brand-cyan-dark text-white font-bold text-sm shadow-lg shadow-brand-purple/20"
            >
              Unlock Now ($12/mo)
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
