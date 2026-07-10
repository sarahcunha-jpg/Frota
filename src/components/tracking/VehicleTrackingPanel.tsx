import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { colors, spacing, typography } from '../../styles/tokens';

interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  status: string;
  x: number;
  y: number;
  velocidade: number;
  direcao: number;
  km: number;
}

interface VehicleTrackingPanelProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle;
  onVehicleSelect?: (vehicleId: string) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'operação':
      return {
        badge: 'success',
        icon: '🟢',
        label: 'Operacional',
        bgColor: '#F0FDF4',
        borderColor: '#DCFCE7',
      };
    case 'manutenção':
      return {
        badge: 'warning',
        icon: '🟡',
        label: 'Em Manutenção',
        bgColor: '#FFFBEB',
        borderColor: '#FEF3C7',
      };
    case 'indisponível':
      return {
        badge: 'danger',
        icon: '🔴',
        label: 'Indisponível',
        bgColor: '#FEF2F2',
        borderColor: '#FECACA',
      };
    default:
      return {
        badge: 'default',
        icon: '⚪',
        label: 'Desconhecido',
        bgColor: '#F3F4F6',
        borderColor: '#E5E7EB',
      };
  }
};

const getDirectionLabel = (degrees: number): string => {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
};

const VehicleTrackingPanel: React.FC<VehicleTrackingPanelProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.4, height: '100%' }}>
      {/* Lista de Viaturas */}
      <Card
        header={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ ...typography.h4, margin: 0, color: colors.gray900 }}>
              🚓 Viaturas ({vehicles.length})
            </h3>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.2,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {vehicles.map((vehicle) => {
            const statusConfig = getStatusConfig(vehicle.status);
            const isSelected = selectedVehicle?.id === vehicle.id;

            return (
              <button
                key={vehicle.id}
                onClick={() => onVehicleSelect?.(vehicle.id)}
                style={{
                  padding: spacing.3,
                  borderRadius: '6px',
                  border: `2px solid ${isSelected ? colors.primary : '#E5E7EB'}`,
                  backgroundColor: isSelected ? '#F0F9FF' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p
                      style={{
                        margin: '0 0 4px 0',
                        fontWeight: 600,
                        color: colors.gray900,
                        fontSize: '14px',
                      }}
                    >
                      {vehicle.placa}
                    </p>
                    <p
                      style={{
                        margin: '0 0 6px 0',
                        color: colors.gray500,
                        fontSize: '12px',
                      }}
                    >
                      {vehicle.modelo}
                    </p>
                    <Badge variant={statusConfig.badge as any}>
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: colors.primary,
                        fontSize: '18px',
                      }}
                    >
                      {vehicle.velocidade}
                      <span style={{ fontSize: '12px', fontWeight: 500, color: colors.gray500 }}>
                        {' km/h'}
                      </span>
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Detalhes da Viatura Selecionada */}
      {selectedVehicle && (
        <Card
          header={
            <h3 style={{ ...typography.h4, margin: 0, color: colors.gray900 }}>
              📍 Detalhes da Viatura
            </h3>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.3 }}>
            {/* Localização */}
            <div>
              <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
                LOCALIZAÇÃO
              </p>
              <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
                Latitude: {selectedVehicle.y.toFixed(4)}
              </p>
              <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
                Longitude: {selectedVehicle.x.toFixed(4)}
              </p>
            </div>

            {/* Velocidade */}
            <div>
              <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
                VELOCIDADE
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: spacing.2,
                }}
              >
                <p style={{ ...typography.h3, color: colors.success, margin: 0 }}>
                  {selectedVehicle.velocidade}
                </p>
                <p style={{ ...typography.bodySm, color: colors.gray500 }}>km/h</p>
              </div>
            </div>

            {/* Direção */}
            <div>
              <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
                DIREÇÃO
              </p>
              <div style={{ display: 'flex', gap: spacing.2, alignItems: 'center' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: colors.gray100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${selectedVehicle.direcao}deg)`,
                    fontSize: '24px',
                  }}
                >
                  ↑
                </div>
                <div>
                  <p style={{ ...typography.h4, margin: 0, color: colors.gray900 }}>
                    {selectedVehicle.direcao}°
                  </p>
                  <p style={{ ...typography.caption, color: colors.gray500, margin: '4px 0 0 0' }}>
                    {getDirectionLabel(selectedVehicle.direcao)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quilometragem */}
            <div>
              <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
                QUILOMETRAGEM
              </p>
              <p style={{ ...typography.h4, color: colors.gray900, margin: 0 }}>
                {selectedVehicle.km.toLocaleString('pt-BR')} km
              </p>
            </div>

            {/* Status */}
            <div>
              <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
                STATUS
              </p>
              <Badge variant={getStatusConfig(selectedVehicle.status).badge as any}>
                {getStatusConfig(selectedVehicle.status).icon}{' '}
                {getStatusConfig(selectedVehicle.status).label}
              </Badge>
            </div>

            {/* Botões de Ação */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.2,
                paddingTop: spacing.3,
                borderTop: `1px solid #E5E7EB`,
              }}
            >
              <Button size="sm" variant="secondary">
                📞 Contatar Motorista
              </Button>
              <Button size="sm" variant="ghost">
                📋 Histórico
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VehicleTrackingPanel;
