import React from 'react';
import { Card } from './Card';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconBg?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export function KPICard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'linear-gradient(135deg, #1E3A5F 0%, #2c4f7c 100%)',
  trend,
}: KPICardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <span className={`text-sm font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon size={24} className="text-white" />
        </div>
      )}
    </Card>
  );
}
