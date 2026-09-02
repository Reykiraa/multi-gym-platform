// src/components/ui/ToastContainer.tsx
import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const iconMap = {
  success: <CheckCircle size={20} className="text-emerald-400" />,
  error: <AlertCircle size={20} className="text-rose-400" />,
  info: <Info size={20} className="text-sky-400" />,
};

/**
 * Dark-themed toast color system:
 *  - All toasts share `bg-zinc-900` base with `border-zinc-800` for consistency.
 *  - Accent color (left border strip) differentiates type visually.
 *  - Text always white for max contrast on dark background.
 */
const accentMap = {
  success: 'border-l-emerald-500',
  error: 'border-l-rose-500',
  info: 'border-l-sky-500',
};

/**
 * Global toast notification renderer.
 * Positioned fixed top-right with z-[100] to sit above modals and overlays.
 * Uses a left-accent-border design on dark zinc-900 cards.
 */
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-start gap-3 px-4 py-3
            bg-zinc-900 border border-zinc-800 border-l-4 ${accentMap[toast.type]}
            rounded-lg shadow-2xl shadow-black/40
            animate-slide-in-right
          `}
          role="alert"
        >
          <span className="mt-0.5 shrink-0">{iconMap[toast.type]}</span>
          <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-zinc-500 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
