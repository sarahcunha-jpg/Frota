// Hook para simular atualizações em tempo real de GPS
import { useEffect, useState } from 'react';

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

interface UseRealTimeTrackingProps {
  vehicles: Vehicle[];
  updateInterval?: number; // em ms (padrão: 5000)
}

export const useRealTimeTracking = ({
  vehicles,
  updateInterval = 5000,
}: UseRealTimeTrackingProps): Vehicle[] => {
  const [updatedVehicles, setUpdatedVehicles] = useState<Vehicle[]>(vehicles);

  useEffect(() => {
    setUpdatedVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedVehicles((prev) =>
        prev.map((vehicle) => {
          if (vehicle.status !== 'operação') return vehicle;

          // Simular movimento
          const variacao = 0.01;
          const novaLatitude = vehicle.y + (Math.random() - 0.5) * variacao;
          const novaLongitude = vehicle.x + (Math.random() - 0.5) * variacao;

          // Simular mudança de velocidade
          const novaVelocidade = Math.max(
            0,
            Math.min(
              120,
              vehicle.velocidade + (Math.random() - 0.5) * 20
            )
          );

          // Simular mudança de direção
          const novaDirecao = (vehicle.direcao + (Math.random() - 0.5) * 30) % 360;

          // Incrementar quilometragem
          const kmIncrement = (novaVelocidade / 3600) * (updateInterval / 1000);

          return {
            ...vehicle,
            x: novaLongitude,
            y: novaLatitude,
            velocidade: Math.round(novaVelocidade),
            direcao: Math.round(novaDirecao < 0 ? novaDirecao + 360 : novaDirecao),
            km: vehicle.km + kmIncrement,
          };
        })
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return updatedVehicles;
};
