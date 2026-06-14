import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Landmark, FileText, Globe, Check, Trash2, ArrowUpRight, Loader } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';

export default function Admin() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [stats, setStats] = useState({
    totalUsers: 0,
    proUsersCount: 0,
    freeUsersCount: 0,
    totalResumes: 0,
    totalPortfolios: 0,
    totalDownloads: 0,
    monthlyRevenue: 0
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const handleToggleTier = async (userId, currentTier) => {
    setActionUserId(userId);
    const nextTier = currentTier === 'pro' ? 'free' : 'pro';
    try {
      await api.put('/admin/users/tier', { userId, subscriptionTier: nextTier });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to update user plan:', err);
    } finally {
      setActionUserId(null);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    setActionUserId(userId);
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put('/admin/users/tier', { userId, role: nextRole });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to update user role:', err);
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user?._id) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user? All their resumes and logs will be permanently deleted.")) {
      setActionUserId(userId);
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete user:', err);
      } finally {
        setActionUserId(null);
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-brand-deepblue-dark text-white text-center">
        <div className="max-w-md p-6 border rounded-xl bg-slate-900 border-red-500/20 text-red-500">
          <ShieldAlert size={36} className="mx-auto mb-3" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-xs text-slate-400 mt-2">Only administrators are allowed to view this interface.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Panel</h1>
          <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Monitor system operations, track subscription metrics, and moderate users.</p>
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-5 rounded-xl border relative ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Monthly Simulated Income</span>
            <div className="flex justify-between items-end mt-2">
              <span className="text-2xl font-black">${stats.monthlyRevenue}</span>
              <span className="text-brand-success text-xs font-bold flex items-center gap-0.5">
                <Landmark size={14} /> Live
              </span>
            </div>
          </div>
          <div className={`p-5 rounded-xl border relative ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Registered Users</span>
            <div className="flex justify-between items-end mt-2">
              <span className="text-2xl font-black">{stats.totalUsers}</span>
              <span className="text-slate-400 text-xs">Pro: {stats.proUsersCount}</span>
            </div>
          </div>
          <div className={`p-5 rounded-xl border relative ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Active Resumes</span>
            <div className="flex justify-between items-end mt-2">
              <span className="text-2xl font-black">{stats.totalResumes}</span>
              <span className="text-brand-purple-light text-xs font-semibold flex items-center gap-0.5">
                <FileText size={14} /> Docs
              </span>
            </div>
          </div>
          <div className={`p-5 rounded-xl border relative ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Total Downloads</span>
            <div className="flex justify-between items-end mt-2">
              <span className="text-2xl font-black">{stats.totalDownloads}</span>
              <span className="text-brand-cyan-light text-xs font-semibold flex items-center gap-0.5">
                <Download size={14} /> PDFs
              </span>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className={`border rounded-xl overflow-hidden ${
          isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-5 border-b border-slate-850 flex items-center gap-2">
            <Users size={18} className="text-brand-purple" />
            <h3 className="font-bold text-base">Registered System Users</h3>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-purple animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className={`uppercase font-bold tracking-wider ${
                  isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-50 text-slate-600'
                }`}>
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Subscription Plan</th>
                    <th className="px-6 py-4">System Role</th>
                    <th className="px-6 py-4">Signup Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-850' : 'divide-slate-200'}`}>
                  {users.map(u => (
                    <tr key={u._id} className={isDark ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50'}>
                      <td className="px-6 py-4 font-bold text-slate-250 dark:text-slate-100">{u.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-450 dark:text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <button
                          disabled={actionUserId !== null}
                          onClick={() => handleToggleTier(u._id, u.subscriptionTier)}
                          className={`px-3 py-1 rounded-full font-bold uppercase text-[9px] hover:brightness-110 active:scale-95 transition-all ${
                            u.subscriptionTier === 'pro' 
                              ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30' 
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {actionUserId === u._id ? '...' : u.subscriptionTier}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          disabled={actionUserId !== null}
                          onClick={() => handleToggleRole(u._id, u.role)}
                          className={`px-3 py-1 rounded-full font-bold uppercase text-[9px] hover:brightness-110 active:scale-95 transition-all ${
                            u.role === 'admin' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25'
                          }`}
                        >
                          {actionUserId === u._id ? '...' : u.role}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-450 dark:text-slate-450">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          disabled={actionUserId !== null || u._id === user?._id}
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-red-500/15"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
