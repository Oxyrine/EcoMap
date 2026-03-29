import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createIcon(color, ring) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 0 0 2px ${ring},0 2px 8px rgba(0,0,0,0.2);"></div>`,
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

function FitBounds({ reports }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [reports, map]);
  return null;
}

export default function MapView({ reports, height = '500px', onMarkerClick, fitBounds = true }) {
  const center = reports.length > 0
    ? [reports[0].latitude, reports[0].longitude]
    : [28.6139, 77.2090];

  return (
    <div style={{ height }} className="rounded-3xl overflow-hidden shadow-lg shadow-black/5 border border-surface-200">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fitBounds && <FitBounds reports={reports} />}
        {reports.map(report => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={statusIcons[report.status] || statusIcons.reported}
            eventHandlers={onMarkerClick ? { click: () => onMarkerClick(report) } : {}}
          >
            <Popup>
              <div className="min-w-[220px]">
                {report.image && (
                  <img src={report.image} alt="Waste" className="w-full h-32 object-cover rounded-xl mb-3" />
                )}
                <p className="font-semibold text-gray-900 capitalize text-sm">{report.wasteType} waste</p>
                <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{report.description}</p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                  <StatusBadge status={report.status} />
                  <span className="mono-label text-gray-400">{report.reporterName}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export { statusIcons };
