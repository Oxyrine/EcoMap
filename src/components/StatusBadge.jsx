import React from 'react';

const config = {
  reported: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', label: 'Unresolved' },
  'in-progress': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500', label: 'In Progress' },
  cleaned: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', label: 'Cleaned' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const c = config[status] || config.reported;
  const px = size === 'lg' ? 'px-3.5 py-1.5 text-[13px]' : 'px-2.5 py-1 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
      {c.label}
    </span>
  );
}
