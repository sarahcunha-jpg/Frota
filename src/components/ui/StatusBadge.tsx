import React from 'react';
import Badge from './Badge';

type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'waiting_parts' | 'out_of_service';

interface StatusBadgeProps {
  status: VehicleStatus;
}

const statusConfig: Record<VehicleStatus, { label: string; icon: string; variant: any }> = {
  available: {
    label: 'Disponível',
    icon: '🟢',
    variant: 'success',
  },
  in_use: {
    label: 'Em Uso',
    icon: '🔵',
    variant: 'info',
  },
  maintenance: {
    label: 'Em Manutenção',
    icon: '🟠',
    variant: 'warning',
  },
  waiting_parts: {
    label: 'Aguardando Peça',
    icon: '🟡',
    variant: 'warning',
  },
  out_of_service: {
    label: 'Fora de Serviço',
    icon: '🔴',
    variant: 'danger',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      <span style={{ marginRight: '4px' }}>{config.icon}</span>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
