import React, { useState, useEffect } from 'react';
import TrackingMap from './TrackingMap';
import VehicleList from './VehicleList';
import TrackingStats from './TrackingStats';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PageHeader from '../layout/PageHeader';
import { spacing, colors } from '../../styles/tokens';

type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'waiting_parts' | 'out_of_service';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: VehicleStatus;
  speed: number;
  lat: number;
  lng: number;
  bearing: number;
  mileage: number;
}

interface TrackingPanelProps {
  vehicles: Vehicle[];
}

const TrackingPanel: React.FC<TrackingPanelProps> = ({ vehicles: initialVehicles }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simular atualização em tempo real
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => ({
          ...vehicle,
          // Simular movimento
          lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.max(0, Math.min(120, vehicle.speed + (Math.random() - 0.5) * 10)),
          bearing: (vehicle.bearing + Math.random() * 5) % 360,
          mileage: vehicle.mileage + Math.random() * 0.1,
        }))
      );
    }, 3000); // Atualizar a cada 3 segundos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedId) || vehicles[0];

  const mapMarkers = vehicles.map((v) => ({
    id: v.id,
    label: v.plate,
    lat: v.lat,
    lng: v.lng,
    status: v.status,
    speed: v.speed,
    bearing: v.bearing,
  }));

  return (
    <div style={{ padding: spacing.6 }}>
      <PageHeader
        title="🗺️ Rastreamento em Tempo Real"
        description="Monitore a localização e movimento de todas as viaturas da frota"
        action={
          <Button
            variant={autoRefresh ? 'primary' : 'secondary'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '⏱️ Atualizando' : '⏸️ Pausado'}
          </Button>
        }
      />

      {/* Mapa Principal */}
      <div style={{ marginBottom: spacing.8 }}>
        <TrackingMap
          markers={mapMarkers}
          selectedMarker={selectedId}
          onMarkerClick={setSelectedId}
          height="500px"
          zoom={14}
        />
      </div>

      {/* Informações Detalhadas da Viatura Selecionada */}
      {selectedVehicle && (
        <div style={{ marginBottom: spacing.8 }}>
          <h2 style={{ marginBottom: spacing.4, color: colors.gray900, fontSize: '20px', fontWeight: 600 }}>
            Detalhes: {selectedVehicle.plate}
          </h2>
          <TrackingStats
            speed={Math.round(selectedVehicle.speed)}
            direction={Math.round(selectedVehicle.bearing)}
            mileage={Math.round(selectedVehicle.mileage)}
            status={selectedVehicle.status}
          />
        </div>
      )}

      {/* Layout em Grid: Lista de Viaturas + Informações Adicionais */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.6,
          '@media (max-width: 1024px)': {
            gridTemplateColumns: '1fr',
          },
        }}
      >
        {/* Lista de Viaturas */}
        <VehicleList vehicles={vehicles} selectedId={selectedId} onSelectVehicle={setSelectedId} />

        {/* Painel Adicional */}
        <Card>
          <div>
            <h3 style={{ marginBottom: spacing.4, color: colors.gray900, fontSize: '16px', fontWeight: 600 }}>
              📊 Resumo da Frota
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.3 }}>
              <div>
                <p style={{ color: colors.gray500, fontSize: '12px', marginBottom: spacing.1 }}>Total de Viaturas</p>
                <p style={{ color: colors.gray900, fontSize: '24px', fontWeight: 700 }}>{vehicles.length}</p>
              </div>
              <div>
                <p style={{ color: colors.gray500, fontSize: '12px', marginBottom: spacing.1 }}>Disponíveis</p>
                <p style={{ color: colors.success, fontSize: '24px', fontWeight: 700 }}>
                  {vehicles.filter((v) => v.status === 'available').length}
                </p>
              </div>
              <div>
                <p style={{ color: colors.gray500, fontSize: '12px', marginBottom: spacing.1 }}>Em Uso</p>
                <p style={{ color: colors.info, fontSize: '24px', fontWeight: 700 }}>
                  {vehicles.filter((v) => v.status === 'in_use').length}
                </p>
              </div>
              <div>
                <p style={{ color: colors.gray500, fontSize: '12px', marginBottom: spacing.1 }}>Velocidade Média</p>
                <p style={{ color: colors.primary, fontSize: '24px', fontWeight: 700 }}>
                  {Math.round(vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicles.length)} km/h
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPanel;
