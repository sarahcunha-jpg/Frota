import React from 'react';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-neutral-600',
};

const trendIcons = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  label,
  value,
  unit,
  trend = 'neutral',
  trendValue,
  backgroundColor = 'bg-neutral-50',
  onClick,
}) => {
  return (
    <div
      className={`
        ${backgroundColor} border border-neutral-300 rounded-lg p-4 lg:p-6
        hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl lg:text-4xl">{icon}</span>
        {trend && trendValue && (
          <span className={`text-sm font-semibold flex items-center gap-1 ${trendColors[trend]}`}>
            <span>{trendIcons[trend]}</span>
            <span>{trendValue}</span>
          </span>
        )}
      </div>

      <div>
        <p className="text-neutral-600 text-sm lg:text-base font-medium mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-neutral-900">{value}</span>
          {unit && <span className="text-sm text-neutral-600 font-medium">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default KPICard;