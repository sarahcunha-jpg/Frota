import React, { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const typeClasses: Record<ToastType, string> = {
  success: 'bg-green-100 border-green-300 text-green-900',
  error: 'bg-red-100 border-red-300 text-red-900',
  warning: 'bg-amber-100 border-amber-300 text-amber-900',
  info: 'bg-blue-100 border-blue-300 text-blue-900',
};

const typeIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠️',
  info: 'ℹ️',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideInUp">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg border
          ${typeClasses[type]}
          shadow-lg
        `}
      >
        <span className="text-lg">{typeIcons[type]}</span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-current hover:opacity-70 transition-opacity"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;