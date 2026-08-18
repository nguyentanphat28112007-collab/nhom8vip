import React from 'react';
import { useApp, ToastMessage } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border backdrop-blur-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-3 ${
            t.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
              : t.type === 'error'
              ? 'bg-slate-900/95 border-rose-500/50 text-rose-300 shadow-rose-950/40'
              : t.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/50 text-amber-300 shadow-amber-950/40'
              : 'bg-slate-900/95 border-indigo-500/50 text-indigo-300 shadow-indigo-950/40'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white leading-tight">{t.title}</h4>
            {t.message && <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{t.message}</p>}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
