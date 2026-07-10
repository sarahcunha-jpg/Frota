import React from 'react';
import { colors, borderRadius, spacing } from '../../styles/tokens';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const getBadgeStyles = (variant: BadgeVariant) => {
  const baseClasses = `
    inline-flex items-center justify-center
    px-2.5 py-0.5
    text-xs font-semibold
    rounded-full
    whitespace-nowrap
  `;

  switch (variant) {
    case 'success':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'warning':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'danger':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'info':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'default':
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '', ...props }) => {
  return (
    <span
      className={`${getBadgeStyles(variant)} ${className}`}
      style={{
        borderRadius: borderRadius.full,
        padding: `${spacing.1} ${spacing.2}`,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
