import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import StatusBadge from '../components/StatusBadge';
import Typewriter from '../components/Typewriter';

const typeIcons = {
  plastic: '🥤', organic: '🍌', 'e-waste': '💻', construction: '🧱',
  hazardous: '☣️', mixed: '🗑️', other: '📦',
};

export default function AdminPanel() {
  const { reports, stats, loading, refresh, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [updating, setUpdating] = useState(null);

  const filtered = useMemo(() => {
    return reports.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.wasteType.includes(q) || r.description.toLowerCase().includes(q) || r.reporterName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [reports, search, statusFilter]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      addToast(`Status updated to "${status}"`, 'success');
      await refresh();
    } catch (err) {
      addToast(err.message || 'Failed to update', 'error');
    } finally { setUpdating(null); }
  };

  const deleteReport = async (id) => {
    if (!confirm('Delete this report permanently?')) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      addToast('Report deleted', 'success');
      if (detail?.id === id) setDetail(null);
      await refresh();
    } catch (err) { addToast(err.message || 'Failed to delete', 'error'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <span className="mono-label text-accent-600">Administration</span>
        <h1 className="font-serif text-3xl md:text-4xl text-surface-900 mt-2">Manage Reports</h1>
        <p className="text-gray-500 mt-2">
          <Typewriter
            words={[
              'Review, update, and track cleanup progress.',
              'Manage reports and coordinate volunteers.',
              'Monitor waste hotspots across the city.',
            ]}
            typingSpeed={40}
            deletingSpeed={25}
            pauseDuration={2500}
            cursorColor="#26a76f"
          />
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger">
        {[
          { label: 'Total', value: stats.total, accent: 'border-surface-200', textColor: 'text-surface-900' },
          { label: 'Unresolved', value: stats.reported, accent: 'border-red-200', textColor: 'text-red-600' },
          { label: 'In Progress', value: stats.inProgress, accent: 'border-amber-200', textColor: 'text-amber-600' },
          { label: 'Cleaned', value: stats.cleaned, accent: 'border-emerald-200', textColor: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className={`animate-fade-up bg-white rounded-2xl border ${s.accent} p-5`}>
            <p className={`text-3xl font-bold font-mono ${s.textColor}`}>{loading ? '—' : s.value}</p>
            <p className="mono-label text-gray-400 mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Type breakdown */}
      {stats.byType.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-8 animate-fade-up delay-200">
          <span className="mono-label text-gray-400">Breakdown by type</span>
          <div className="flex flex-wrap gap-3 mt-3">
            {stats.byType.map(t => (
              <div key={t.wasteType} className="flex items-center gap-2 bg-surface-50 px-4 py-2.5 rounded-xl">
                <span>{typeIcons[t.wasteType] || '📦'}</span>
                <span className="text-sm font-medium text-surface-800 capitalize">{t.wasteType}</span>
                <span className="font-mono text-[11px] bg-surface-200 text-surface-800 px-2 py-0.5 rounded-full">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5 animate-fade-up delay-300">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-surface-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-300/50 focus:border-accent-300 placeholder:text-gray-400 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'reported', 'in-progress', 'cleaned'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                statusFilter === s
                  ? 'bg-surface-900 text-white'
                  : 'bg-surface-100 text-gray-500 hover:bg-surface-200'
              }`}
            >
              {s === 'all' ? 'All' : s === 'reported' ? 'Unresolved' : s === 'in-progress' ? 'In Progress' : 'Cleaned'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden animate-fade-up delay-400">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="text-left py-3.5 px-5 mono-label text-gray-400 font-medium">ID</th>
                <th className="text-left py-3.5 px-5 mono-label text-gray-400 font-medium">Type</th>
                <th className="text-left py-3.5 px-5 mono-label text-gray-400 font-medium hidden md:table-cell">Description</th>
                <th className="text-left py-3.5 px-5 mono-label text-gray-400 font-medium">Reporter</th>
                <th className="text-left py-3.5 px-5 mono-label text-gray-400 font-medium">Status</th>
                <th className="text-left py-3.5 px-5 mono-label text-gray-400 font-medium hidden sm:table-cell">Date</th>
                <th className="text-right py-3.5 px-5 mono-label text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 text-surface-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    {loading ? 'Loading...' : 'No reports found'}
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="border-b border-surface-50 hover:bg-surface-50/80 transition-colors group">
                  <td className="py-3.5 px-5 font-mono text-xs text-gray-400">#{r.id}</td>
                  <td className="py-3.5 px-5">
                    <span className="capitalize flex items-center gap-2">
                      <span className="text-base">{typeIcons[r.wasteType] || '📦'}</span>
                      <span className="text-surface-800 font-medium text-[13px]">{r.wasteType}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-gray-500 max-w-[220px] truncate hidden md:table-cell text-[13px]">{r.description || '—'}</td>
                  <td className="py-3.5 px-5 text-surface-800 text-[13px]">{r.reporterName}</td>
                  <td className="py-3.5 px-5">
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                      disabled={updating === r.id}
                      className={`text-[11px] font-medium rounded-full px-3 py-1.5 border-0 cursor-pointer focus:ring-2 focus:ring-accent-300/50 appearance-none ${
                        r.status === 'reported' ? 'bg-red-50 text-red-600' :
                        r.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <option value="reported">Unresolved</option>
                      <option value="in-progress">In Progress</option>
                      <option value="cleaned">Cleaned</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-gray-400 hidden sm:table-cell">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setDetail(r)}
                        className="p-2 rounded-xl text-gray-400 hover:text-accent-600 hover:bg-accent-50 transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteReport(r.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-surface-100 flex items-center justify-between">
              <span className="mono-label text-gray-400">Report #{detail.id}</span>
              <button onClick={() => setDetail(null)} className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-surface-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {detail.image && (
                <img src={detail.image} alt="Waste" className="w-full h-56 object-cover rounded-2xl" />
              )}
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Waste Type', value: <span className="capitalize font-medium text-surface-900 flex items-center gap-2"><span>{typeIcons[detail.wasteType]}</span>{detail.wasteType}</span> },
                  { label: 'Status', value: <StatusBadge status={detail.status} size="lg" /> },
                  { label: 'Reporter', value: detail.reporterName },
                  { label: 'Date', value: new Date(detail.createdAt).toLocaleString() },
                ].map(item => (
                  <div key={item.label}>
                    <p className="mono-label text-gray-400 mb-1">{item.label}</p>
                    <div className="text-sm text-gray-700">{item.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <p className="mono-label text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed">{detail.description || 'No description'}</p>
              </div>
              <div>
                <p className="mono-label text-gray-400 mb-1">Coordinates</p>
                <p className="font-mono text-sm text-gray-500">{detail.latitude.toFixed(6)}, {detail.longitude.toFixed(6)}</p>
              </div>
              <div className="flex gap-2 pt-3 border-t border-surface-100">
                {detail.status !== 'in-progress' && (
                  <button
                    onClick={() => { updateStatus(detail.id, 'in-progress'); setDetail({ ...detail, status: 'in-progress' }); }}
                    className="flex-1 bg-amber-50 text-amber-700 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
                  >
                    Mark In Progress
                  </button>
                )}
                {detail.status !== 'cleaned' && (
                  <button
                    onClick={() => { updateStatus(detail.id, 'cleaned'); setDetail({ ...detail, status: 'cleaned' }); }}
                    className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    Mark Cleaned
                  </button>
                )}
                <button
                  onClick={() => deleteReport(detail.id)}
                  className="bg-red-50 text-red-600 py-2.5 px-5 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
