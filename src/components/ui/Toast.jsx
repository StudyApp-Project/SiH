import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const TOAST_CONFIG = {
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  error:   { icon: AlertCircle, color: 'text-red-500',   bg: 'bg-red-500/10' },
  info:    { icon: Info,        color: 'text-blue-500',  bg: 'bg-blue-500/10' },
};

export function Toast({ type = 'info', message, onClose }) {
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  return createPortal(
    <div className={`fixed bottom-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border border-(--border-default) shadow-(--shadow-lg) backdrop-blur-xl animate-[slideUp_0.3s_ease] ${config.bg}`}
      style={{ background: 'var(--bg-elevated)' }}>
      <Icon size={18} className={config.color} />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="p-1 rounded-md hover:bg-(--bg-glass) transition-colors">
        <X size={14} />
      </button>
    </div>,
    document.body
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = 'info') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  return { toasts, showToast, removeToast };
}
