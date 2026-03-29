import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import ReportWaste from './pages/ReportWaste';
import MapDashboard from './pages/MapDashboard';
import AdminPanel from './pages/AdminPanel';

export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, reported: 0, inProgress: 0, cleaned: 0, byType: [] });
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      addToast('Failed to load reports', 'error');
    }
  }, [addToast]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Stats fetch failed:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchReports(), fetchStats()]);
    setLoading(false);
  }, [fetchReports, fetchStats]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AppContext.Provider value={{ reports, stats, loading, refresh, addToast }}>
      <div className="min-h-screen flex flex-col bg-surface-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportWaste />} />
            <Route path="/map" element={<MapDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <footer className="bg-surface-900 text-white/40 text-center py-6 text-sm">
          <p className="font-mono text-xs tracking-wider">EcoMap &copy; 2026 — Making cities cleaner, one report at a time.</p>
        </footer>
        <Toast toasts={toasts} />
      </div>
    </AppContext.Provider>
  );
}
