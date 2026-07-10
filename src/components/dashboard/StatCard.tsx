import React from 'react';
import { spacing, typography, colors } from '../../styles/tokens';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        padding: spacing.4,
        borderRadius: '8px',
        border: `1px solid #E5E7EB`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <p style={{ ...typography.bodySm, color: colors.gray500, marginBottom: spacing.1 }}>
        {title}
      </p>
      <p style={{ ...typography.h3, color: colors.gray900, marginBottom: subtitle ? spacing.1 : 0 }}>
        {value}
      </p>
      {subtitle && <p style={{ ...typography.caption, color: colors.gray400 }}>{subtitle}</p>}
    </div>
  );
};

export default StatCard;
