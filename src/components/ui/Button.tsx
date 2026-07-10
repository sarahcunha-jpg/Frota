import React from 'react';
import { colors, spacing, typography, borderRadius, transitions } from '../../styles/tokens';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const getVariantStyles = (variant: ButtonVariant): string => {
  const baseClasses = 'font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-md';
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} bg-[${colors.primary}] text-white hover:bg-[${colors.primaryLight}] active:bg-[${colors.primaryDark}] disabled:opacity-50 disabled:cursor-not-allowed`;
    case 'success':
      return `${baseClasses} bg-[${colors.success}] text-white hover:bg-[${colors.successLight}] disabled:opacity-50 disabled:cursor-not-allowed`;
    case 'danger':
      return `${baseClasses} bg-[${colors.danger}] text-white hover:bg-[${colors.dangerLight}] disabled:opacity-50 disabled:cursor-not-allowed`;
    case 'secondary':
      return `${baseClasses} bg-[${colors.gray200}] text-[${colors.gray800}] hover:bg-[${colors.gray300}] disabled:opacity-50 disabled:cursor-not-allowed`;
    case 'ghost':
      return `${baseClasses} bg-transparent text-[${colors.primary}] hover:bg-[${colors.gray100}] disabled:opacity-50 disabled:cursor-not-allowed`;
    default:
      return baseClasses;
  }
};

const getSizeStyles = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'px-3 py-2 text-xs';
    case 'lg':
      return 'px-6 py-3 text-base';
    case 'md':
    default:
      return 'px-4 py-2 text-sm';
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, isLoading, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${getVariantStyles(variant)} ${getSizeStyles(size)} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            {children}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
