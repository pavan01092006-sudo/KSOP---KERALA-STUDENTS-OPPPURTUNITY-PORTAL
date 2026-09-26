import React, { useEffect } from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-[#0d7c70]/20 bg-slate-900/95 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
