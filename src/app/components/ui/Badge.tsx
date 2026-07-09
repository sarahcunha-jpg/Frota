import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'primary' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  primary: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-700',
};

export function Badge({ variant = 'gray', children, icon }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
