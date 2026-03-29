import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlassyButton from './GlassyButton';

const links = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report' },
  { to: '/map', label: 'Map' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-sm' : isHome ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isHome && !scrolled ? 'bg-white/10' : 'bg-accent-100'
            }`}>
              <svg className={`w-5 h-5 transition-colors ${isHome && !scrolled ? 'text-white' : 'text-accent-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={`font-serif text-xl tracking-tight transition-colors ${
              isHome && !scrolled ? 'text-white' : 'text-surface-900'
            }`}>
              EcoMap
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 focus-ring ${
                    active
                      ? isHome && !scrolled
                        ? 'bg-white/15 text-white'
                        : 'bg-accent-50 text-accent-700'
                      : isHome && !scrolled
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-surface-100'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <GlassyButton
              to="/report"
              variant={isHome && !scrolled ? 'light' : 'dark'}
              size="sm"
              className="ml-3"
            >
              Report Waste
            </GlassyButton>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-surface-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-surface-200/50 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'bg-accent-50 text-accent-700'
                    : 'text-gray-600 hover:bg-surface-100'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
