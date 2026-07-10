import React from 'react';
import Card from '../ui/Card';
import { colors, spacing, typography } from '../../styles/tokens';

interface TrackingStatsProps {
  speed: number;
  direction: number;
  mileage: number;
  status: string;
}

const TrackingStats: React.FC<TrackingStatsProps> = ({ speed, direction, mileage, status }) => {
  const getCompassDirection = (bearing: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(bearing / 22.5) % 16];
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: spacing.4,
      }}
    >
      <Card>
        <div>
          <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.2 }}>
            ⚡ Velocidade Atual
          </p>
          <p style={{ ...typography.h2, color: colors.gray900 }}>
            {speed} <span style={{ ...typography.bodySm, color: colors.gray500 }}>km/h</span>
          </p>
        </div>
      </Card>

      <Card>
        <div>
          <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.2 }}>
            🧭 Direção
          </p>
          <p style={{ ...typography.h2, color: colors.gray900 }}>
            {getCompassDirection(direction)} <span style={{ ...typography.bodySm, color: colors.gray500 }}>{direction}°</span>
          </p>
        </div>
      </Card>

      <Card>
        <div>
          <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.2 }}>
            🛣️ Quilometragem
          </p>
          <p style={{ ...typography.h2, color: colors.gray900 }}>
            {mileage.toLocaleString('pt-BR')} <span style={{ ...typography.bodySm, color: colors.gray500 }}>km</span>
          </p>
        </div>
      </Card>

      <Card>
        <div>
          <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.2 }}>
            📊 Status
          </p>
          <p style={{ ...typography.h4, color: colors.primary }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TrackingStats;
