import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';
import MapView from '../components/MapView';
import CardStack from '../components/CardStack';
import StatusBadge from '../components/StatusBadge';
import Typewriter from '../components/Typewriter';
import GlassyButton from '../components/GlassyButton';

const steps = [
  {
    num: '01',
    title: 'Spot waste',
    desc: 'Found illegal dumping or overflowing bins? Open the app and pin the exact location on the map.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />,
    icon2: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />,
  },
  {
    num: '02',
    title: 'Report it',
    desc: 'Add a photo, select the waste type, and submit your report. It takes less than 30 seconds.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />,
    icon2: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />,
  },
  {
    num: '03',
    title: 'Track cleanup',
    desc: 'Watch real-time status updates as volunteers and authorities respond and clean up the area.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
];

export default function Home() {
  const { reports, stats, loading } = useApp();

  return (
    <div className="-mt-16">
      {/* === HERO === */}
      <section className="mesh-gradient noise relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
          <div className="max-w-3xl">
            <div className="mono-label text-accent-400 mb-6 animate-fade-up">
              Crowd-sourced waste tracking
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] text-white leading-[1.05] animate-fade-up delay-100">
              Cleaner cities,{' '}
              <span className="italic text-accent-300">mapped</span>{' '}
              by the people.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-white/60 leading-relaxed max-w-xl animate-fade-up delay-200">
              <Typewriter
                words={[
                  'Report waste locations on a live map.',
                  'Track cleanup progress in real time.',
                  'Visualize problem areas instantly.',
                  'Make your city cleaner, together.',
                ]}
                typingSpeed={45}
                deletingSpeed={30}
                pauseDuration={2000}
                cursorColor="rgba(125,218,175,0.7)"
                cursorWidth={2}
              />
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up delay-300">
              <GlassyButton
                to="/report"
                variant="light"
                size="lg"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                }
              >
                Report Waste
              </GlassyButton>
              <GlassyButton
                to="/map"
                variant="light"
                size="lg"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                }
              >
                Explore Map
              </GlassyButton>
            </div>
          </div>

          {/* Floating stat pills */}
          <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 animate-fade-up delay-400">
            {[
              { label: 'Reports', value: stats.total, color: 'text-white' },
              { label: 'Cleaned', value: stats.cleaned, color: 'text-accent-400' },
              { label: 'Active', value: stats.inProgress, color: 'text-amber-400' },
            ].map((s, i) => (
              <div key={s.label} className={`glass-dark rounded-2xl px-6 py-4 text-center min-w-[130px] ${i === 1 ? 'animate-float' : ''}`}>
                <p className={`text-3xl font-bold ${s.color} font-mono`}>{loading ? '—' : s.value}</p>
                <p className="mono-label text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface-50 to-transparent z-10"></div>
      </section>

      {/* === STATS (Mobile) === */}
      <section className="lg:hidden max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-3 stagger">
          {[
            { label: 'Reports', value: stats.total },
            { label: 'Cleaned', value: stats.cleaned },
            { label: 'Active', value: stats.inProgress },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-md shadow-black/5 p-4 text-center animate-fade-up">
              <p className="text-2xl font-bold text-surface-900 font-mono">{loading ? '—' : s.value}</p>
              <p className="mono-label text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="mono-label text-accent-600">How it works</span>
          <h2 className="font-serif text-3xl md:text-4xl text-surface-900 mt-3">
            Three steps to{' '}
            <Typewriter
              words={['a cleaner city', 'a greener future', 'healthier communities', 'zero waste zones']}
              typingSpeed={70}
              deletingSpeed={40}
              pauseDuration={1800}
              cursorColor="#26a76f"
              className="text-accent-600"
            />
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 stagger">
          {steps.map(step => (
            <div
              key={step.num}
              className="animate-fade-up group relative bg-white rounded-3xl p-8 border border-surface-200 hover:border-accent-200 hover:shadow-lg hover:shadow-accent-500/5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-sm text-surface-300 font-medium">{step.num}</span>
                <div className="w-10 h-10 rounded-2xl bg-accent-50 flex items-center justify-center text-accent-600 group-hover:bg-accent-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {step.icon}
                    {step.icon2}
                  </svg>
                </div>
              </div>
              <h3 className="font-serif text-xl text-surface-900 mb-2">{step.title}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === RECENT REPORTS CARD STACK === */}
      {!loading && reports.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="animate-fade-up">
              <span className="mono-label text-accent-600">Recent activity</span>
              <h2 className="font-serif text-3xl md:text-4xl text-surface-900 mt-3">
                Latest reports from the community
              </h2>
              <p className="text-gray-500 mt-4 leading-relaxed">
                Drag the top card to reveal more reports. Every submission brings us
                one step closer to a cleaner city.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center gap-2 bg-surface-100 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-sm text-gray-600 font-medium">{stats.reported} unresolved</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-100 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm text-gray-600 font-medium">{stats.cleaned} cleaned</span>
                </div>
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5m4.5 4.5V6" />
                </svg>
                Drag card up or down to cycle
              </p>
            </div>

            {/* Right: card stack */}
            <div className="animate-fade-up delay-200 flex justify-center">
              <CardStack
                items={reports.slice(0, 5)}
                className="w-[340px] h-[380px]"
                renderCard={(report, i, isFront) => (
                  <div className={`w-full h-full bg-white rounded-3xl border overflow-hidden shadow-xl shadow-black/8 ${
                    isFront ? 'border-surface-200' : 'border-surface-100'
                  }`}>
                    {/* Card image area */}
                    <div className="h-[180px] bg-gradient-to-br from-accent-50 to-surface-100 relative overflow-hidden">
                      {report.image ? (
                        <img src={report.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-5xl opacity-30">
                            {report.wasteType === 'plastic' ? '🥤' :
                             report.wasteType === 'organic' ? '🍌' :
                             report.wasteType === 'e-waste' ? '💻' :
                             report.wasteType === 'construction' ? '🧱' :
                             report.wasteType === 'hazardous' ? '☣️' :
                             report.wasteType === 'mixed' ? '🗑️' : '📦'}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={report.status} />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                    {/* Card body */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-surface-900 font-semibold capitalize text-[15px]">
                          {report.wasteType} waste
                        </span>
                        <span className="mono-label text-gray-400">#{report.id}</span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {report.description || 'No description provided.'}
                      </p>
                      <div className="divider my-4"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 text-xs font-bold">
                            {(report.reporterName || 'A').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-600">{report.reporterName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </section>
      )}

      {/* === IMPACT STATS === */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="bg-surface-900 rounded-[2rem] p-10 md:p-14 relative overflow-hidden noise">
          <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: stats.total, label: 'Total Reports', sub: 'submitted by citizens' },
              { value: stats.reported, label: 'Unresolved', sub: 'awaiting action' },
              { value: stats.inProgress, label: 'In Progress', sub: 'being cleaned up' },
              { value: stats.cleaned, label: 'Cleaned', sub: 'areas restored' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-bold text-white font-mono">{loading ? '—' : s.value}</p>
                <p className="text-white/80 font-medium mt-2">{s.label}</p>
                <p className="text-white/30 text-sm mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-700/10 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* === LIVE MAP === */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="mono-label text-accent-600">Live data</span>
            <h2 className="font-serif text-3xl md:text-4xl text-surface-900 mt-2">Waste map</h2>
          </div>
          <GlassyButton
            to="/map"
            variant="dark"
            size="sm"
            className="hidden md:inline-flex"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            }
          >
            Open full map
          </GlassyButton>
        </div>
        {!loading && <MapView reports={reports} height="480px" />}
        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 justify-center">
          {[
            { color: 'bg-red-500', label: 'Unresolved' },
            { color: 'bg-amber-500', label: 'In Progress' },
            { color: 'bg-emerald-500', label: 'Cleaned' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-2 text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`}></span>
              {l.label}
            </span>
          ))}
        </div>
      </section>

      {/* === CTA === */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="bg-accent-50 border border-accent-100 rounded-[2rem] p-10 md:p-14 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-surface-900">
            Ready to make a difference?
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Every report helps build a cleaner, healthier environment.
            Be the change your city needs.
          </p>
          <div className="mt-8">
            <GlassyButton
              to="/report"
              variant="accent"
              size="lg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              }
            >
              Submit a Report
            </GlassyButton>
          </div>
        </div>
      </section>
    </div>
  );
}
