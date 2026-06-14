import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, LayoutDashboard, FileText, Globe, BarChart3, Settings, ShieldAlert, 
  LogOut, Sun, Moon, Menu, X, ArrowLeftRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldAlert });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-brand-deepblue-dark text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Mobile Header Banner */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-16 z-30 flex items-center justify-between px-6 border-b backdrop-blur-md ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white">
            <Sparkles size={16} />
          </span>
          <span className="font-extrabold text-sm uppercase">CareerCraft</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={isDark ? 'text-slate-200' : 'text-slate-800'}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ============================================================== */}
      {/* SIDEBAR NAVIGATION */}
      {/* ============================================================== */}
      <aside className={`fixed md:sticky top-0 left-0 h-full w-64 z-40 border-r flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        isDark ? 'bg-slate-950/90 border-slate-850' : 'bg-white border-slate-200'
      }`}>
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-850">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white shadow-lg">
              <Sparkles size={16} />
            </span>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent dark:text-transparent text-slate-900">
              CareerCraft<span className="text-brand-cyan">.AI</span>
            </span>
          </div>

          {/* User Brief profile */}
          <div className="p-4 border-b border-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white shadow">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm truncate">{user?.name || 'User Profile'}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.2 rounded-[4px] text-[9px] font-extrabold uppercase ${
                    user?.subscriptionTier === 'pro' 
                      ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {user?.subscriptionTier || 'FREE'}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="px-2 py-0.2 rounded-[4px] text-[9px] font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation items list */}
          <nav className="p-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple/25 to-brand-cyan/15 text-white border border-brand-purple/20'
                      : isDark
                        ? 'text-slate-450 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-brand-cyan' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer options */}
        <div className="p-4 space-y-2 border-t border-slate-850">
          {/* Dark / Light Toggle */}
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
              isDark 
                ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 text-slate-300' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-505">Switch</span>
          </button>

          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN CONTENT BODY */}
      {/* ============================================================== */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Overlay backdrop for mobile sidebars */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}
    </div>
  );
}
