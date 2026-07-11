import React from 'react';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const statusClasses: Record<StatusType, string> = {
  success: 'bg-green-100 text-green-800 border-green-300',
  warning: 'bg-amber-100 text-amber-800 border-amber-300',
  danger: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  neutral: 'bg-neutral-100 text-neutral-800 border-neutral-300',
};

const dotColors: Record<StatusType, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-neutral-500',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  icon,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold
        border
        ${statusClasses[status]}
        ${className}
      `}
    >
      <span className={`w-2 h-2 rounded-full ${dotColors[status]}`}></span>
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </span>
  );
};

export default StatusBadge;