import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { colors, spacing } from '../../styles/tokens';

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

interface TrackingMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleSelect?: (vehicleId: string) => void;
  height?: string;
}

interface MarkerWithPopup extends L.Marker {
  vehicleId?: string;
}

const TrackingMap: React.FC<TrackingMapProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  height = '500px',
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, MarkerWithPopup>>(new Map());
  const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Criar mapa centrado em Blumenau, SC
    const map = L.map(containerRef.current).setView([-26.9319, -49.066], 13);

    // Adicionar tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Atualizar markers
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    vehicles.forEach((vehicle) => {
      const map = mapRef.current!;
      const existingMarker = markersRef.current.get(vehicle.id);
      const latlng = L.latLng(vehicle.y, vehicle.x);

      // Cores por status
      const statusColor = {
        operação: '#27AE60',
        manutenção: '#F39C12',
        indisponível: '#E74C3C',
      }[vehicle.status] || '#95A5A6';

      const statusEmoji = {
        operação: '🟢',
        manutenção: '🟡',
        indisponível: '🔴',
      }[vehicle.status] || '⚪';

      // Se marker já existe, atualizar posição
      if (existingMarker) {
        existingMarker.setLatLng(latlng);
        existingMarker.setRotationAngle(vehicle.direcao);
      } else {
        // Criar novo marker com ícone customizado
        const html = `
          <div style="
            width: 40px;
            height: 40px;
            background: ${statusColor};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transform: rotate(${vehicle.direcao}deg);
            transition: all 200ms ease;
            cursor: pointer;
          ">
            🚓
          </div>
        `;

        const icon = L.divIcon({
          html,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });

        const marker = L.marker(latlng, { icon }) as MarkerWithPopup;
        marker.vehicleId = vehicle.id;

        // Popup com informações
        const popupContent = `
          <div style="min-width: 250px; font-family: Inter, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1F2937;">
              ${vehicle.placa}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280;">
              ${vehicle.modelo}
            </p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 8px 0;" />
            <div style="display: grid; gap: 6px; font-size: 13px;">
              <div style="display: grid; grid-template-columns: 80px 1fr;">
                <span style="color: #6B7280; font-weight: 500;">Velocidade:</span>
                <span style="color: #1F2937; font-weight: 600;">${vehicle.velocidade} km/h</span>
              </div>
              <div style="display: grid; grid-template-columns: 80px 1fr;">
                <span style="color: #6B7280; font-weight: 500;">Direção:</span>
                <span style="color: #1F2937; font-weight: 600;">${vehicle.direcao}°</span>
              </div>
              <div style="display: grid; grid-template-columns: 80px 1fr;">
                <span style="color: #6B7280; font-weight: 500;">Status:</span>
                <span style="color: #1F2937; font-weight: 600;">${statusEmoji} ${vehicle.status}</span>
              </div>
              <div style="display: grid; grid-template-columns: 80px 1fr;">
                <span style="color: #6B7280; font-weight: 500;">Km:</span>
                <span style="color: #1F2937; font-weight: 600;">${vehicle.km.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onVehicleSelect?.(vehicle.id);
          marker.openPopup();
        });

        marker.addTo(map);
        markersRef.current.set(vehicle.id, marker);
      }

      // Adicionar histórico de rota (se houver)
      if (!polylinesRef.current.has(vehicle.id)) {
        const routePoints = generateRoutePoints(vehicle);
        if (routePoints.length > 1) {
          const polyline = L.polyline(routePoints, {
            color: statusColor,
            weight: 2,
            opacity: 0.5,
            dashArray: '5, 5',
          }).addTo(map);
          polylinesRef.current.set(vehicle.id, polyline);
        }
      }
    });
  }, [vehicles, isMapReady, onVehicleSelect]);

  // Destacar marker selecionado
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    markersRef.current.forEach((marker, vehicleId) => {
      if (vehicleId === selectedVehicleId) {
        marker.setOpacity(1);
        marker.setZIndexOffset(1000);
      } else {
        marker.setOpacity(0.7);
        marker.setZIndexOffset(0);
      }
    });
  }, [selectedVehicleId, isMapReady]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#F0F9FF',
      }}
    />
  );
};

// Gerar pontos de rota simulados
function generateRoutePoints(vehicle: Vehicle): [number, number][] {
  const basePoints: [number, number][] = [
    [-26.9319, -49.066], // Centro
    [-26.927, -49.07],
    [-26.935, -49.065],
    [vehicle.y, vehicle.x],
  ];
  return basePoints;
}

export default TrackingMap;
