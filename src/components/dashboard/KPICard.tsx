import React from 'react';
import Card from '../ui/Card';
import { colors, spacing, typography } from '../../styles/tokens';

interface KPICardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

const KPICard: React.FC<KPICardProps> = ({ icon, label, value, trend }) => {
  return (
    <Card
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '48px' }}>{icon}</div>
        {trend && (
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: trend.direction === 'up' ? colors.success : colors.danger,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
          </div>
        )}
      </div>
      
      <div style={{ marginTop: spacing.4 }}>
        <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
          {label}
        </p>
        <p style={{ ...typography.h2, color: colors.gray900 }}>
          {value}
        </p>
      </div>
    </Card>
  );
};

export default KPICard;
