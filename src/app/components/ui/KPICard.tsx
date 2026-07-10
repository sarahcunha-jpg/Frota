import React from 'react';
import { cn } from './utils';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'blue' | 'green' | 'orange' | 'red';
  onClick?: () => void;
}

const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    icon: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-900',
    icon: 'text-green-600',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    icon: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-900',
    icon: 'text-red-600',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  color = 'blue',
  onClick,
}) => {
  const colors = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-neutral-200 rounded-lg p-4 shadow-sm transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md'
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-semibold text-neutral-600">{title}</h3>
        {icon && (
          <div className={cn('text-2xl p-2 rounded-lg', colors.bg, colors.icon)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        {unit && (
          <span className="text-sm text-neutral-600">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <span
            className={cn(
              trend.direction === 'up' ? 'text-success' : 'text-danger'
            )}
          >
            {trend.direction === 'up' ? '↑' : '↓'}
          </span>
          <span
            className={cn(
              'font-semibold',
              trend.direction === 'up' ? 'text-success' : 'text-danger'
            )}
          >
            {trend.value}%
          </span>
          <span className="text-neutral-600">vs mês anterior</span>
        </div>
      )}
    </div>
  );
};