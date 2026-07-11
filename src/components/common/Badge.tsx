import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-900 border-primary-300',
  secondary: 'bg-blue-100 text-blue-900 border-blue-300',
  success: 'bg-green-100 text-green-900 border-green-300',
  warning: 'bg-amber-100 text-amber-900 border-amber-300',
  danger: 'bg-red-100 text-red-900 border-red-300',
  info: 'bg-sky-100 text-sky-900 border-sky-300',
  neutral: 'bg-neutral-100 text-neutral-900 border-neutral-300',
};

const sizeClasses: Record<string, string> = {
  small: 'px-2 py-1 text-xs',
  medium: 'px-3 py-1.5 text-sm',
  large: 'px-4 py-2 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'medium',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;