import { useState, useEffect } from 'react';

export interface TrackedVehicle {
  id: string;
  plate: string;
  model: string;
  status: 'available' | 'in_use' | 'maintenance' | 'waiting_parts' | 'out_of_service';
  speed: number;
  lat: number;
  lng: number;
  bearing: number;
  mileage: number;
  lastUpdate: Date;
}

interface UseRealTimeTrackingOptions {
  refreshInterval?: number; // em ms
  enabled?: boolean;
}

/**
 * Hook customizado para rastreamento em tempo real de viaturas
 * Simula atualizações de GPS e posição
 */
export const useRealTimeTracking = (
  initialVehicles: TrackedVehicle[],
  options: UseRealTimeTrackingOptions = {}
) => {
  const { refreshInterval = 3000, enabled = true } = options;
  const [vehicles, setVehicles] = useState<TrackedVehicle[]>(initialVehicles);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setIsUpdating(true);
      setVehicles((prev) =>
        prev.map((vehicle) => {
          // Simular variações realistas
          const speedChange = (Math.random() - 0.5) * 15; // -7.5 a +7.5 km/h
          const bearingChange = (Math.random() - 0.5) * 10; // -5 a +5 graus
          const latChange = (Math.random() - 0.5) * 0.001; // ~0.1 km
          const lngChange = (Math.random() - 0.5) * 0.001;
          const mileageIncrease = Math.random() * 0.2; // ~0.2 km por atualização

          return {
            ...vehicle,
            speed: Math.max(0, Math.min(120, vehicle.speed + speedChange)),
            bearing: (vehicle.bearing + bearingChange) % 360,
            lat: vehicle.lat + latChange,
            lng: vehicle.lng + lngChange,
            mileage: vehicle.mileage + mileageIncrease,
            lastUpdate: new Date(),
          };
        })
      );
      setIsUpdating(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, refreshInterval]);

  const updateVehiclePosition = (id: string, data: Partial<TrackedVehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...data, lastUpdate: new Date() } : v))
    );
  };

  const getVehicleById = (id: string) => vehicles.find((v) => v.id === id);

  const getFleetStats = () => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === 'available').length,
      inUse: vehicles.filter((v) => v.status === 'in_use').length,
      inMaintenance: vehicles.filter((v) => v.status === 'maintenance').length,
      averageSpeed: vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicles.length,
      totalMileage: vehicles.reduce((acc, v) => acc + v.mileage, 0),
    };
  };

  return {
    vehicles,
    isUpdating,
    updateVehiclePosition,
    getVehicleById,
    getFleetStats,
  };
};
