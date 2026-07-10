import React from 'react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { colors, spacing, typography } from '../../styles/tokens';

type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'waiting_parts' | 'out_of_service';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: VehicleStatus;
  speed: number;
  lat: number;
  lng: number;
}

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedId?: string;
  onSelectVehicle?: (id: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, selectedId, onSelectVehicle }) => {
  return (
    <Card
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: spacing.4 }}>
        <h3 style={{ ...typography.h4, color: colors.gray900 }}>Viaturas Rastreadas</h3>
        <p style={{ ...typography.caption, color: colors.gray500, marginTop: spacing.1 }}>
          {vehicles.length} viatura(s) monitorada(s)
        </p>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.2,
        }}
      >
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            onClick={() => onSelectVehicle?.(vehicle.id)}
            style={{
              padding: spacing.3,
              border: `2px solid ${selectedId === vehicle.id ? colors.primary : '#E5E7EB'}`,
              borderRadius: '6px',
              backgroundColor: selectedId === vehicle.id ? `${colors.primary}10` : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (selectedId !== vehicle.id) {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedId !== vehicle.id) {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: spacing.2 }}>
              <div>
                <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 600 }}>
                  🚗 {vehicle.plate}
                </p>
                <p style={{ ...typography.caption, color: colors.gray500, marginTop: spacing.1 }}>
                  {vehicle.model}
                </p>
              </div>
              <StatusBadge status={vehicle.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: colors.gray500 }}>⚡ {vehicle.speed} km/h</span>
              <span style={{ color: colors.gray500 }}>
                📍 {vehicle.lat.toFixed(3)}, {vehicle.lng.toFixed(3)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div style={{ textAlign: 'center', padding: spacing.6, color: colors.gray500 }}>
          <p style={{ ...typography.bodySm }}>Nenhuma viatura encontrada</p>
        </div>
      )}
    </Card>
  );
};

export default VehicleList;
