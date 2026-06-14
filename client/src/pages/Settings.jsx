import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, UserPlus, Sparkles, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = { name };
      if (password) payload.password = password;

      const res = await updateProfile(payload);
      if (res.success) {
        setSuccess('Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateSubscriptionToggle = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const nextTier = user?.subscriptionTier === 'pro' ? 'free' : 'pro';
      const res = await updateProfile({ subscriptionTier: nextTier });
      if (res.success) {
        setSuccess(`Subscription tier updated to ${nextTier.toUpperCase()}!`);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Toggle subscription error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl text-left space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manage your personal information, security details, and plan.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Profile Details Form */}
        <div className={`p-6 rounded-xl border ${
          isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <UserPlus size={18} className="text-brand-purple" /> Personal Profile
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address (Read-only)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-550">
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border cursor-not-allowed ${
                    isDark ? 'bg-slate-950/50 border-slate-850 text-slate-500' : 'bg-slate-50 border-slate-250 text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => { setName(e.target.value); setError(''); }}
                required
                className={`w-full px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-white focus:border-brand-purple' 
                    : 'bg-white border-slate-200 text-slate-900 focus:border-brand-purple'
                }`}
              />
            </div>

            <hr className={`my-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

            <h4 className="font-bold text-sm text-slate-350 mb-1">Update Security Credentials</h4>
            <p className="text-[10px] text-slate-505 mb-3">Leave fields blank if you do not wish to modify the password.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-550">
                    <Lock size={16} />
                  </span>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                      isDark 
                        ? 'bg-slate-900/50 border-slate-700 text-white focus:border-brand-purple' 
                        : 'bg-white border-slate-200 text-slate-900 focus:border-brand-purple'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-550">
                    <Lock size={16} />
                  </span>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                      isDark 
                        ? 'bg-slate-900/50 border-slate-700 text-white focus:border-brand-purple' 
                        : 'bg-white border-slate-200 text-slate-900 focus:border-brand-purple'
                    }`}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-4 py-2.5 rounded-lg bg-brand-purple hover:bg-brand-purple-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : 'Save Modifications'}
            </button>
          </form>
        </div>

        {/* Subscription Tier Form */}
        <div className={`p-6 rounded-xl border ${
          isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                <Sparkles size={18} className="text-brand-cyan" /> Subscription Plan
              </h3>
              <p className="text-xs text-slate-450">Change, renew or simulate upgrades to billing plans.</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
              user?.subscriptionTier === 'pro' 
                ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {user?.subscriptionTier || 'FREE'}
            </span>
          </div>

          <hr className={`my-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold block text-slate-200">
                {user?.subscriptionTier === 'pro' ? 'Pro Plan - Premium Access Active' : 'Free Plan - Basic Features'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {user?.subscriptionTier === 'pro' ? 'Billed monthly at $12. Next payment simulated.' : 'Create up to 1 resume and portfolio slug.'}
              </span>
            </div>
            <button 
              onClick={simulateSubscriptionToggle}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg font-bold text-xs shadow ${
                user?.subscriptionTier === 'pro'
                  ? 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all'
                  : 'bg-brand-cyan hover:bg-brand-cyan-dark text-slate-950 transition-all'
              }`}
            >
              {user?.subscriptionTier === 'pro' ? 'Downgrade to Free' : 'Simulate Pro Upgrade'}
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
