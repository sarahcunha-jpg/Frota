import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { colors, spacing } from '../../styles/tokens';

interface MarkerData {
  id: string;
  label: string;
  lat: number;
  lng: number;
  status: 'available' | 'in_use' | 'maintenance' | 'waiting_parts' | 'out_of_service';
  speed: number;
  bearing: number;
}

interface TrackingMapProps {
  markers: MarkerData[];
  selectedMarker?: string;
  onMarkerClick?: (markerId: string) => void;
  height?: string;
  zoom?: number;
}

const getMarkerIcon = (status: MarkerData['status'], isSelected: boolean) => {
  const statusColors: Record<MarkerData['status'], string> = {
    available: '#27AE60',
    in_use: '#3498DB',
    maintenance: '#F39C12',
    waiting_parts: '#F39C12',
    out_of_service: '#E74C3C',
  };

  const color = statusColors[status];
  const borderColor = isSelected ? '#000' : '#fff';
  const borderWidth = isSelected ? 3 : 2;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${borderColor}" stroke-width="${borderWidth}">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: isSelected ? [40, 40] : [32, 32],
    iconAnchor: isSelected ? [20, 20] : [16, 16],
    popupAnchor: [0, -16],
  });
};

const TrackingMap: React.FC<TrackingMapProps> = ({
  markers,
  selectedMarker,
  onMarkerClick,
  height = '400px',
  zoom = 13,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Criar mapa centrado em Blumenau, SC
    map.current = L.map(mapContainer.current).setView([-26.924, -49.066], zoom);

    // Adicionar camada OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    setMapLoaded(true);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Atualizar markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Limpar markers antigos
    Object.values(markerRefs.current).forEach((marker) => marker.remove());
    markerRefs.current = {};

    // Adicionar novos markers
    markers.forEach((markerData) => {
      const isSelected = markerData.id === selectedMarker;
      const icon = getMarkerIcon(markerData.status, isSelected);

      const marker = L.marker([markerData.lat, markerData.lng], { icon })
        .bindPopup(
          `<div style="text-align: center;">
            <strong>${markerData.label}</strong><br/>
            Velocidade: ${markerData.speed} km/h<br/>
            Status: ${markerData.status}
          </div>`
        )
        .addTo(map.current!);

      marker.on('click', () => onMarkerClick?.(markerData.id));

      markerRefs.current[markerData.id] = marker;
    });

    // Focar no marker selecionado
    if (selectedMarker && markerRefs.current[selectedMarker]) {
      const marker = markerRefs.current[selectedMarker];
      map.current.setView(marker.getLatLng(), zoom);
      marker.openPopup();
    }
  }, [markers, selectedMarker, mapLoaded, zoom]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    />
  );
};

export default TrackingMap;
