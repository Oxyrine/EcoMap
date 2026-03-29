import React from 'react';

const styles = {
  success: { bg: 'bg-accent-50 border-accent-200', icon: 'text-accent-600', text: 'text-accent-800' },
  error: { bg: 'bg-red-50 border-red-200', icon: 'text-red-500', text: 'text-red-800' },
  info: { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-500', text: 'text-blue-800' },
};

const icons = {
  success: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
  error: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  info: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

export default function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(t => {
        const s = styles[t.type] || styles.info;
        return (
          <div key={t.id} className={`animate-slide-in pointer-events-auto flex items-center gap-3 ${s.bg} border rounded-2xl px-5 py-3.5 shadow-lg shadow-black/5 min-w-[300px]`}>
            <svg className={`w-5 h-5 flex-shrink-0 ${s.icon}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {icons[t.type] || icons.info}
            </svg>
            <span className={`text-sm font-medium ${s.text}`}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
