import React from 'react';
import { cn } from './utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'neutral';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-primary-100 hover:bg-primary-200 text-primary-900',
  danger: 'bg-danger hover:bg-red-700 text-white',
  warning: 'bg-warning hover:bg-yellow-600 text-white',
  success: 'bg-success hover:bg-green-700 text-white',
  neutral: 'bg-neutral-300 hover:bg-neutral-400 text-neutral-900',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'font-semibold rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="animate-spin">⏳</span>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';