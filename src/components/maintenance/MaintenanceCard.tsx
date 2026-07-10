import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { spacing, typography, colors } from '../../styles/tokens';

type MaintenanceType = 'preventive' | 'corrective';
type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface MaintenanceCardProps {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  type: MaintenanceType;
  service: string;
  responsible: string;
  date: string;
  status: MaintenanceStatus;
  cost?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const getMaintenanceStatusBadge = (status: MaintenanceStatus) => {
  const config: Record<MaintenanceStatus, { label: string; variant: any }> = {
    pending: { label: 'Pendente', variant: 'warning' },
    in_progress: { label: 'Em Andamento', variant: 'info' },
    completed: { label: 'Concluída', variant: 'success' },
    cancelled: { label: 'Cancelada', variant: 'default' },
  };
  return config[status];
};

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  id,
  vehiclePlate,
  vehicleModel,
  type,
  service,
  responsible,
  date,
  status,
  cost,
  onEdit,
  onDelete,
  onView,
}) => {
  const statusConfig = getMaintenanceStatusBadge(status);

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
            🚓 {vehiclePlate} - {vehicleModel}
          </p>
          <p style={{ ...typography.bodySm, color: colors.gray500 }}>
            {service}
          </p>
        </div>
        <Badge variant={statusConfig.variant}>
          {statusConfig.label}
        </Badge>
      </div>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.3,
          marginBottom: spacing.4,
          backgroundColor: colors.gray50,
          padding: spacing.3,
          borderRadius: '6px',
        }}
      >
        <div>
          <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
            Tipo
          </p>
          <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
            {type === 'preventive' ? 'Preventiva' : 'Corretiva'}
          </p>
        </div>
        <div>
          <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
            Responsável
          </p>
          <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
            {responsible}
          </p>
        </div>
        <div>
          <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
            Data
          </p>
          <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
            {date}
          </p>
        </div>
        {cost && (
          <div>
            <p style={{ ...typography.caption, color: colors.gray500, marginBottom: spacing.1 }}>
              Custo
            </p>
            <p style={{ ...typography.bodySm, color: colors.gray900, fontWeight: 500 }}>
              R$ {cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
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

export default MaintenanceCard;
