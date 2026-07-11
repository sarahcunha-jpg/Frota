import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}

const sizeClasses = {
  small: 'max-w-sm',
  medium: 'max-w-md',
  large: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  actions,
  size = 'medium',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-lg shadow-lg
          ${sizeClasses[size]}
          w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto
          animate-slideInUp
        `}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-neutral-300 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="p-4 lg:p-6 border-t border-neutral-300 flex items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;