import React from 'react';
import { cn } from './utils';

type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: BadgeStatus;
  label: string;
  icon?: React.ReactNode;
}

const statusColors: Record<BadgeStatus, { bg: string; text: string; dot: string }> = {
  success: {
    bg: 'bg-success_light',
    text: 'text-success',
    dot: 'bg-success',
  },
  warning: {
    bg: 'bg-warning_light',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  danger: {
    bg: 'bg-danger_light',
    text: 'text-danger',
    dot: 'bg-danger',
  },
  info: {
    bg: 'bg-info_light',
    text: 'text-info',
    dot: 'bg-info',
  },
  neutral: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-700',
    dot: 'bg-neutral-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  icon,
}) => {
  const colors = statusColors[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold',
        colors.bg,
        colors.text
      )}
    >
      <span className={cn('w-2 h-2 rounded-full', colors.dot)}></span>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
};