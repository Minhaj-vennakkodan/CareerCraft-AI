import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, Sparkles, Loader } from 'lucide-react';
import api from '../utils/api';
import PortfolioThemes from '../themes/PortfolioThemes';

export default function PortfolioView() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      setLoading(true);
      setError('');
      try {
        // Appending ref parameters if present in search parameters
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref') || 'direct';
        
        const res = await api.get(`/portfolios/slug/${slug}?ref=${ref}`);
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
        setError(err.response?.data?.message || 'Portfolio website not found.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPublicPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader size={36} className="animate-spin text-brand-purple-light" />
        <p className="text-sm font-semibold text-slate-500 font-mono">Connecting port host services...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center font-mono">
        <div className="max-w-md p-8 border rounded-xl bg-slate-900 border-red-500/25 text-red-400">
          <ShieldAlert size={40} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold">404 - Portfolio Not Found</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The url slug path careercraft.ai/portfolio/<strong>{slug}</strong> is not registered or may have been deleted.
          </p>
          <Link 
            to="/" 
            className="inline-block mt-6 px-5 py-2.5 rounded bg-brand-purple text-white text-xs font-bold hover:brightness-110"
          >
            Create Your Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PortfolioThemes 
      themeName={data.portfolio.themeName} 
      resume={data.resume} 
      portfolio={data.portfolio} 
    />
  );
}
