import React from 'react';
import { Link } from 'react-router-dom';

/**
 * GlassyButton — frosted glass button with shine sweep on hover.
 *
 * Variants:
 *   light  — white glass on dark backgrounds
 *   dark   — dark glass on light backgrounds
 *   accent — green-tinted glass
 */

const variants = {
  light: {
    base: 'bg-white/12 border-white/30 text-white hover:bg-white/20 hover:border-white/50',
    shadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
    hoverShadow: '0 12px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
    shine: 'rgba(255,255,255,0.35)',
  },
  dark: {
    base: 'bg-surface-900/8 border-surface-900/15 text-surface-900 hover:bg-surface-900/14 hover:border-surface-900/25',
    shadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
    hoverShadow: '0 12px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
    shine: 'rgba(255,255,255,0.5)',
  },
  accent: {
    base: 'bg-accent-500/12 border-accent-400/30 text-accent-700 hover:bg-accent-500/20 hover:border-accent-400/50',
    shadow: '0 8px 32px rgba(38,167,111,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
    hoverShadow: '0 12px 40px rgba(38,167,111,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
    shine: 'rgba(255,255,255,0.4)',
  },
};

export default function GlassyButton({
  children,
  to,
  href,
  onClick,
  variant = 'light',
  size = 'md',
  className = '',
  icon,
  disabled = false,
  type = 'button',
}) {
  const v = variants[variant] || variants.light;

  const sizes = {
    sm: 'px-4 py-2 text-[13px] rounded-xl gap-2',
    md: 'px-6 py-3 text-[14px] rounded-2xl gap-2.5',
    lg: 'px-8 py-4 text-[15px] rounded-2xl gap-3',
  };

  const cls = [
    'group relative inline-flex items-center justify-center font-semibold',
    'border backdrop-blur-md overflow-hidden',
    'transition-all duration-300 ease-out',
    'focus-ring',
    sizes[size] || sizes.md,
    v.base,
    disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    className,
  ].join(' ');

  const style = {
    boxShadow: v.shadow,
  };

  const inner = (
    <>
      {/* Shine sweep */}
      <span
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      >
        <span
          className="absolute top-0 -left-[75%] w-[60%] h-full group-hover:left-[150%] transition-all duration-500 ease-out"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${v.shine} 50%, transparent 60%)`,
            transform: 'skewX(-20deg)',
          }}
        />
      </span>
      {/* Top edge highlight */}
      <span
        className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-40 pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)' }}
        aria-hidden="true"
      />
      {/* Content */}
      {icon && <span className="relative z-10 w-5 h-5 flex-shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </>
  );

  const hoverStyle = {
    '--hover-shadow': v.hoverShadow,
  };

  const combinedStyle = { ...style, ...hoverStyle };

  if (to) {
    return (
      <Link to={to} className={cls} style={combinedStyle}
        onMouseEnter={e => e.currentTarget.style.boxShadow = v.hoverShadow}
        onMouseLeave={e => e.currentTarget.style.boxShadow = v.shadow}
      >
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} style={combinedStyle} target="_blank" rel="noopener noreferrer"
        onMouseEnter={e => e.currentTarget.style.boxShadow = v.hoverShadow}
        onMouseLeave={e => e.currentTarget.style.boxShadow = v.shadow}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={combinedStyle}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.boxShadow = v.hoverShadow; }}
      onMouseLeave={e => e.currentTarget.style.boxShadow = v.shadow}
    >
      {inner}
    </button>
  );
}
