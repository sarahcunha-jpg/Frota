import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { spacing, typography, colors } from '../../styles/tokens';

type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'waiting_parts' | 'out_of_service';

interface VehicleCardModernProps {
  id: string;
  plate: string;
  model: string;
  status: VehicleStatus;
  lastMaintenance?: string;
  nextMaintenance?: string;
  mileage: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const VehicleCardModern: React.FC<VehicleCardModernProps> = ({
  id,
  plate,
  model,
  status,
  lastMaintenance,
  nextMaintenance,
  mileage,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card hoverable>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: spacing.3,
        }}
      >
        <div>
          <p style={{ ...typography.h4, color: colors.gray900, marginBottom: spacing.1 }}>
            🚓 {plate}
          </p>
          <p style={{ ...typography.bodySm, color: colors.gray500 }}>
            {model}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div
        style={{
          backgroundColor: colors.gray50,
          padding: spacing.3,
          borderRadius: '6px',
          marginBottom: spacing.3,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.3 }}>
          {lastMaintenance && (
            <div>
              <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
                Última Manutenção
              </p>
              <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
                {lastMaintenance}
              </p>
            </div>
          )}
          {nextMaintenance && (
            <div>
              <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
                Próxima Revisão
              </p>
              <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
                {nextMaintenance}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: spacing.4 }}>
        <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
          Quilometragem
        </p>
        <p style={{ ...typography.h4, color: colors.gray900 }}>
          {mileage.toLocaleString('pt-BR')} km
        </p>
      </div>
      
      <div
        style={{
          display: 'flex',
          gap: spacing.2,
          paddingTop: spacing.3,
          borderTop: `1px solid #E5E7EB`,
        }}
      >
        <Button size="sm" variant="ghost" onClick={onView}>
          👁️ Visualizar
        </Button>
        <Button size="sm" variant="secondary" onClick={onEdit}>
          ✏️ Editar
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          🗑️ Excluir
        </Button>
      </div>
    </Card>
  );
};

export default VehicleCardModern;
