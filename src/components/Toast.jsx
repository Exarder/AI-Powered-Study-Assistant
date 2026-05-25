import { useEffect } from 'react';

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">
          ✓
        </span>
        <span className="text-sm font-medium text-slate-900">{message}</span>
      </div>
    </div>
  );
}
