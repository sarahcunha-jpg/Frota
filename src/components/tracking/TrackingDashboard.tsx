import React, { useState } from 'react';
import { spacing } from '../../styles/tokens';
import PageHeader from '../layout/PageHeader';
import TrackingMap from './TrackingMap';
import VehicleTrackingPanel from './VehicleTrackingPanel';
import { useRealTimeTracking } from './RealTimeUpdater';

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

interface TrackingDashboardProps {
  vehicles: Vehicle[];
}

const TrackingDashboard: React.FC<TrackingDashboardProps> = ({ vehicles: initialVehicles }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  // Usar real-time updater para simular GPS
  const vehicles = useRealTimeTracking({
    vehicles: initialVehicles,
    updateInterval: 5000,
  });

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.6 }}>
      <PageHeader
        title="🗺️ Rastreamento em Tempo Real"
        description="Monitore a localização de todas as viaturas da frota em tempo real com atualizações automáticas a cada 5 segundos"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: spacing.6,
          alignItems: 'start',
        }}
      >
        {/* Mapa */}
        <div>
          <TrackingMap
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={setSelectedVehicleId}
            height="600px"
          />
        </div>

        {/* Painel Lateral */}
        <VehicleTrackingPanel
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={setSelectedVehicleId}
        />
      </div>
    </div>
  );
};

export default TrackingDashboard;
