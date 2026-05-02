import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';





const Toast = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: { icon: CheckCircle, color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)' },
    error: { icon: AlertTriangle, color: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)' },
    info: { icon: Info, color: 'var(--brand)', bg: 'var(--brand-subtle)', border: 'var(--brand-border)' },
  };

  const { icon: Icon, color, bg, border } = config[type];

  return (
    <div 
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-modal border animate-in slide-in-from-bottom-4 fade-in duration-300"
      style={{ backgroundColor: bg, borderColor: border, color }}
    >
      <Icon size={20} strokeWidth={2.5} />
      <span className="text-sm font-bold font-body whitespace-nowrap">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
