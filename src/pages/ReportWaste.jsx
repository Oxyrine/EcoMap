import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../App';
import Typewriter from '../components/Typewriter';
import GlassyButton from '../components/GlassyButton';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const wasteTypes = [
  { value: 'plastic', label: 'Plastic', icon: '🥤' },
  { value: 'organic', label: 'Organic', icon: '🍌' },
  { value: 'e-waste', label: 'E-Waste', icon: '💻' },
  { value: 'construction', label: 'Construction', icon: '🧱' },
  { value: 'hazardous', label: 'Hazardous', icon: '☣️' },
  { value: 'mixed', label: 'Mixed', icon: '🗑️' },
  { value: 'other', label: 'Other', icon: '����' },
];

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  return position ? <Marker position={position} /> : null;
}

export default function ReportWaste() {
  const navigate = useNavigate();
  const { refresh, addToast } = useApp();
  const fileRef = useRef();

  const [position, setPosition] = useState(null);
  const [wasteType, setWasteType] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { addToast('Geolocation not supported', 'error'); return; }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setPosition([pos.coords.latitude, pos.coords.longitude]); setDetecting(false); addToast('Location detected', 'success'); },
      () => { setDetecting(false); addToast('Could not detect location — click on the map instead.', 'error'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [addToast]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { addToast('Image must be under 10MB', 'error'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) { addToast('Select a location on the map', 'error'); return; }
    if (!wasteType) { addToast('Select a waste type', 'error'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('latitude', position[0]);
      fd.append('longitude', position[1]);
      fd.append('wasteType', wasteType);
      fd.append('description', description);
      fd.append('reporterName', reporterName || 'Anonymous');
      if (image) fd.append('image', image);
      const res = await fetch('/api/reports', { method: 'POST', body: fd });
      if (!res.ok) throw new Error((await res.json()).error);
      addToast('Report submitted successfully!', 'success');
      await refresh();
      navigate('/map');
    } catch (err) {
      addToast(err.message || 'Failed to submit report', 'error');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <span className="mono-label text-accent-600">New report</span>
        <h1 className="font-serif text-3xl md:text-4xl text-surface-900 mt-2">Report waste location</h1>
        <p className="text-gray-500 mt-2 max-w-lg">
          <Typewriter
            words={[
              'Pin the location, add details, and help us keep the city clean.',
              'Spotted illegal dumping? Report it in under 30 seconds.',
              'Every report helps volunteers find and clean waste faster.',
            ]}
            typingSpeed={35}
            deletingSpeed={20}
            pauseDuration={3000}
            cursorColor="#26a76f"
          />
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        {/* Left: Map (3 cols) */}
        <div className="lg:col-span-3 animate-fade-up delay-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-surface-800">
              Pin location <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={detectLocation}
              disabled={detecting}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-600 hover:text-accent-700 transition-colors disabled:opacity-50"
            >
              <svg className={`w-3.5 h-3.5 ${detecting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {detecting ? 'Detecting...' : 'Auto-detect'}
            </button>
          </div>

          <div className="rounded-3xl overflow-hidden border border-surface-200 shadow-lg shadow-black/5" style={{ height: '460px' }}>
            <MapContainer center={position || [28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>

          {position && (
            <p className="font-mono text-xs text-gray-400 mt-2.5">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </p>
          )}
          {!position && <p className="text-xs text-gray-400 mt-2.5">Click on the map to drop a pin</p>}
        </div>

        {/* Right: Form Fields (2 cols) */}
        <div className="lg:col-span-2 space-y-6 animate-fade-up delay-200">
          {/* Waste Type */}
          <div>
            <label className="text-sm font-medium text-surface-800 block mb-3">
              Waste type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {wasteTypes.map(wt => (
                <button
                  key={wt.value}
                  type="button"
                  onClick={() => setWasteType(wt.value)}
                  className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border text-[13px] font-medium transition-all ${
                    wasteType === wt.value
                      ? 'border-accent-400 bg-accent-50 text-accent-700 shadow-sm shadow-accent-200/50'
                      : 'border-surface-200 bg-white text-gray-600 hover:border-surface-300 hover:bg-surface-50'
                  }`}
                >
                  <span className="text-base">{wt.icon}</span>
                  {wt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-surface-800 block mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the waste — size, nearby landmarks, urgency..."
              rows={4}
              className="w-full border border-surface-200 rounded-2xl px-4 py-3 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-accent-300/50 focus:border-accent-300 resize-none placeholder:text-gray-400 transition-all"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium text-surface-800 block mb-2">Photo</label>
            <div
              className={`upload-zone rounded-2xl p-5 text-center cursor-pointer transition-all ${preview ? 'border-accent-300 bg-accent-50/50' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
              onDragLeave={e => e.currentTarget.classList.remove('dragover')}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="relative inline-block">
                  <img src={preview} alt="Preview" className="max-h-40 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null); }}
                    className="absolute -top-2 -right-2 bg-surface-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    x
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <svg className="w-8 h-8 text-surface-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                  </svg>
                  <p className="text-sm text-gray-500">Click or drag to upload</p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG — Max 10MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          {/* Reporter Name */}
          <div>
            <label className="text-sm font-medium text-surface-800 block mb-2">Your name <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="text"
              value={reporterName}
              onChange={e => setReporterName(e.target.value)}
              placeholder="Anonymous"
              className="w-full border border-surface-200 rounded-2xl px-4 py-3 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-accent-300/50 focus:border-accent-300 placeholder:text-gray-400 transition-all"
            />
          </div>

          {/* Submit */}
          <GlassyButton
            type="submit"
            variant="accent"
            size="lg"
            className="w-full justify-center"
            disabled={submitting || !position || !wasteType}
            onClick={undefined}
            icon={
              submitting
                ? <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M4 12a8 8 0 018-8" strokeLinecap="round" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
            }
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </GlassyButton>
        </div>
      </form>
    </div>
  );
}
