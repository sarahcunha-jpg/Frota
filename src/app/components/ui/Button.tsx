import React from 'react';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#1E3A5F] hover:bg-[#2c4f7c] text-white',
  success: 'bg-[#27AE60] hover:bg-[#52be7f] text-white',
  danger: 'bg-[#E74C3C] hover:bg-[#ec7063] text-white',
  warning: 'bg-[#F39C12] hover:bg-[#f5b041] text-white',
  secondary: 'bg-[#95A5A6] hover:bg-[#34495E] text-white',
  outline: 'bg-transparent border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  loading = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
