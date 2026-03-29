import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../App';
import StatusBadge from '../components/StatusBadge';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createIcon(color, ring) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 0 0 2px ${ring},0 2px 8px rgba(0,0,0,0.2)"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

const statusIcons = {
  reported: createIcon('#ef4444', 'rgba(239,68,68,0.3)'),
  'in-progress': createIcon('#eab308', 'rgba(234,179,8,0.3)'),
  cleaned: createIcon('#22c55e', 'rgba(34,197,94,0.3)'),
};

const filters = [
  { value: 'all', label: 'All', count: s => s.total },
  { value: 'reported', label: 'Unresolved', count: s => s.reported, color: 'bg-red-500' },
  { value: 'in-progress', label: 'In Progress', count: s => s.inProgress, color: 'bg-amber-500' },
  { value: 'cleaned', label: 'Cleaned', count: s => s.cleaned, color: 'bg-emerald-500' },
];

function FitBounds({ reports }) {
  const map = useMap();
  React.useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [reports, map]);
  return null;
}

export default function MapDashboard() {
  const { reports, stats, loading } = useApp();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return reports;
    return reports.filter(r => r.status === filter);
  }, [reports, filter]);

  const center = filtered.length > 0
    ? [filtered[0].latitude, filtered[0].longitude]
    : [28.6139, 77.2090];

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px - 56px)' }}>
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-surface-200/60 px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setSelected(null); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                filter === f.value
                  ? 'bg-surface-900 text-white shadow-sm'
                  : 'bg-surface-100 text-gray-500 hover:bg-surface-200'
              }`}
            >
              {f.color && <span className={`w-2 h-2 rounded-full ${f.color}`}></span>}
              {f.label}
              <span className={`font-mono text-[11px] ${filter === f.value ? 'text-white/60' : 'text-gray-400'}`}>
                {f.count(stats)}
              </span>
            </button>
          ))}
        </div>
        <div className="mono-label text-gray-400">
          {filtered.length} report{filtered.length !== 1 ? 's' : ''} shown
        </div>
      </div>

      {/* Map + sidebar */}
      <div className="flex-1 flex relative">
        <div className="flex-1">
          {!loading && (
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds reports={filtered} />
              {filtered.map(report => (
                <Marker
                  key={report.id}
                  position={[report.latitude, report.longitude]}
                  icon={statusIcons[report.status] || statusIcons.reported}
                  eventHandlers={{ click: () => setSelected(report) }}
                >
                  <Popup>
                    <div className="min-w-[220px]">
                      {report.image && (
                        <img src={report.image} alt="Waste" className="w-full h-36 object-cover rounded-xl mb-3" />
                      )}
                      <p className="font-semibold text-gray-900 capitalize text-[13px]">{report.wasteType} waste</p>
                      <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                        <StatusBadge status={report.status} />
                        <span className="mono-label text-gray-400">{report.reporterName}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Detail sidebar */}
        {selected && (
          <div className="w-[340px] bg-white border-l border-surface-200 overflow-y-auto hidden md:block animate-slide-in">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <span className="mono-label text-gray-400">Report #{selected.id}</span>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-surface-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-5">
              {selected.image && (
                <img src={selected.image} alt="Waste" className="w-full h-48 object-cover rounded-2xl" />
              )}
              {[
                { label: 'Waste Type', value: <span className="capitalize font-medium text-surface-900">{selected.wasteType}</span> },
                { label: 'Status', value: <StatusBadge status={selected.status} size="lg" /> },
                { label: 'Description', value: <span className="text-gray-600">{selected.description || 'No description'}</span> },
                { label: 'Reporter', value: <span className="text-gray-600">{selected.reporterName}</span> },
                { label: 'Location', value: <span className="font-mono text-gray-500 text-xs">{selected.latitude.toFixed(6)}, {selected.longitude.toFixed(6)}</span> },
                { label: 'Date', value: <span className="text-gray-600">{new Date(selected.createdAt).toLocaleString()}</span> },
              ].map(item => (
                <div key={item.label}>
                  <p className="mono-label text-gray-400 mb-1.5">{item.label}</p>
                  <div className="text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
