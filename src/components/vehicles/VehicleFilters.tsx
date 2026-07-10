import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { spacing } from '../../styles/tokens';

interface VehicleFiltersProps {
  onSearch?: (value: string) => void;
  onStatusFilter?: (status: string) => void;
  onReset?: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({ onSearch, onStatusFilter, onReset }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing.4,
        marginBottom: spacing.6,
        alignItems: 'flex-end',
      }}
    >
      <Input
        placeholder="Buscar por placa, modelo..."
        icon="🔍"
        onChange={(e) => onSearch?.(e.target.value)}
      />
      
      <Select
        label="Status"
        options={[
          { value: '', label: 'Todos' },
          { value: 'available', label: 'Disponível' },
          { value: 'in_use', label: 'Em Uso' },
          { value: 'maintenance', label: 'Em Manutenção' },
          { value: 'out_of_service', label: 'Fora de Serviço' },
        ]}
        onChange={(e) => onStatusFilter?.(e.target.value)}
      />
      
      <Button variant="secondary" onClick={onReset}>
        ↻ Limpar Filtros
      </Button>
    </div>
  );
};

export default VehicleFilters;
