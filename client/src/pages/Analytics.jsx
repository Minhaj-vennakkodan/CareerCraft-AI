import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Compass, Globe } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';

export default function Analytics() {
  const { isDark } = useTheme();
  const [data, setData] = useState({
    viewsOverTime: [],
    trafficSources: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/charts');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load chart metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f97316'];

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Visitor Analytics</h1>
          <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Check the popularity metrics and download frequencies of your resume templates.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-purple animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Timeseries Area Chart */}
            <div className={`lg:col-span-2 p-6 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-purple" /> Traffic Over Time (Last 7 Days)
                </h3>
              </div>
              
              <div className="h-[280px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.viewsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                    <Tooltip 
                      contentStyle={{ 
                        background: isDark ? '#0f172a' : '#ffffff', 
                        borderColor: isDark ? '#1e293b' : '#cbd5e1',
                        color: isDark ? '#f8fafc' : '#0f172a' 
                      }} 
                    />
                    <Area type="monotone" dataKey="views" name="Page Views" stroke="#7c3aed" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                    <Area type="monotone" dataKey="downloads" name="Downloads" stroke="#06b6d4" fillOpacity={1} fill="url(#colorDownloads)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic Sources Pie Chart */}
            <div className={`p-6 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Compass size={18} className="text-brand-cyan" /> Acquisition Channels
                </h3>
              </div>

              <div className="h-[200px] w-full text-xs flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.trafficSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: isDark ? '#0f172a' : '#ffffff', 
                        borderColor: isDark ? '#1e293b' : '#cbd5e1',
                        color: isDark ? '#f8fafc' : '#0f172a' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2.5 mt-4">
                {data.trafficSources.map((source, index) => (
                  <div key={source.name} className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {source.name}
                    </span>
                    <span className="text-slate-200 font-bold">{source.value} clicks</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
