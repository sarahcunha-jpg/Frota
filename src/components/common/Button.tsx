import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-900 hover:bg-primary-700 text-white',
  secondary: 'bg-primary-500 hover:bg-primary-700 text-white',
  success: 'bg-success hover:bg-green-700 text-white',
  danger: 'bg-danger hover:bg-red-700 text-white',
  warning: 'bg-warning hover:bg-amber-600 text-white',
  neutral: 'bg-neutral-300 hover:bg-neutral-400 text-neutral-900',
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-3 py-2 text-xs font-semibold',
  medium: 'px-4 py-2 text-sm font-semibold',
  large: 'px-6 py-3 text-base font-semibold',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        icon && <span className="flex items-center">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;