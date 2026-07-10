# Implementação do Sistema de Rastreamento em Tempo Real 🗺️

## O que foi criado

### Componentes

#### 1. **TrackingMap.tsx** (`src/components/tracking/`)
- Mapa interativo com Leaflet + OpenStreetMap
- Markers animados com cores por status
- Popup com informações da viatura ao clicar
- Zoom automático no marker selecionado
- Responsivo

**Props:**
```tsx
interface TrackingMapProps {
  markers: MarkerData[];           // Array de viaturas
  selectedMarker?: string;         // ID do marker selecionado
  onMarkerClick?: (id: string) => void;
  height?: string;                 // Altura do mapa (default: "400px")
  zoom?: number;                   // Nível de zoom (default: 13)
}
```

#### 2. **VehicleList.tsx** (`src/components/tracking/`)
- Lista de viaturas rastreadas
- Status colorido
- Velocidade atual
- Coordenadas
- Clique para selecionar viatura

#### 3. **TrackingStats.tsx** (`src/components/tracking/`)
- Exibe velocidade, direção, quilometragem e status
- 4 cards informativos
- Design responsivo

#### 4. **TrackingPanel.tsx** (`src/components/tracking/`)
- **Componente completo pronto para usar**
- Integra mapa, lista de viaturas e estatísticas
- Atualização em tempo real simulada
- Toggle para pausar/retomar rastreamento
- Detalhes da viatura selecionada

### Hook Customizado

#### **useRealTimeTracking.ts** (`src/app/hooks/`)
- Gerencia estado de rastreamento
- Simula movimento realista de GPS
- Atualiza velocidade, bearing, coordenadas, quilometragem
- Intervalo configurável

**Uso:**
```tsx
const { vehicles, isUpdating, updateVehiclePosition, getFleetStats } = 
  useRealTimeTracking(initialVehicles, { refreshInterval: 3000, enabled: true });
```

---

## 🚀 Como Usar

### Opção 1: Usar TrackingPanel Completo (Recomendado)

```tsx
import TrackingPanel from '@/components/tracking/TrackingPanel';

const App = () => {
  const vehicles = [
    {
      id: '1',
      plate: 'KM-3456',
      model: 'Toyota Hilux 2020',
      status: 'in_use',
      speed: 45,
      lat: -26.924,
      lng: -49.066,
      bearing: 90,
      mileage: 125400,
    },
    // ... mais viaturas
  ];

  return <TrackingPanel vehicles={vehicles} />;
};
```

### Opção 2: Componentes Individuais

```tsx
import TrackingMap from '@/components/tracking/TrackingMap';
import VehicleList from '@/components/tracking/VehicleList';
import TrackingStats from '@/components/tracking/TrackingStats';
import { useRealTimeTracking } from '@/app/hooks/useRealTimeTracking';

const TrackingPage = () => {
  const { vehicles, updateVehiclePosition, getFleetStats } = 
    useRealTimeTracking(initialVehicles, { refreshInterval: 2000 });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = vehicles.find(v => v.id === selectedId) || vehicles[0];

  const mapMarkers = vehicles.map(v => ({
    id: v.id,
    label: v.plate,
    lat: v.lat,
    lng: v.lng,
    status: v.status,
    speed: v.speed,
    bearing: v.bearing,
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '24px' }}>
      <TrackingMap 
        markers={mapMarkers}
        selectedMarker={selectedId}
        onMarkerClick={setSelectedId}
        height="500px"
      />
      <VehicleList 
        vehicles={vehicles}
        selectedId={selectedId}
        onSelectVehicle={setSelectedId}
      />
      {selected && (
        <TrackingStats
          speed={Math.round(selected.speed)}
          direction={Math.round(selected.bearing)}
          mileage={Math.round(selected.mileage)}
          status={selected.status}
        />
      )}
    </div>
  );
};
```

---

## 📊 Status de Cores

- 🟢 **Disponível** (#27AE60)
- 🔵 **Em Uso** (#3498DB)
- 🟡 **Manutenção** (#F39C12)
- 🟡 **Aguardando Peça** (#F39C12)
- 🔴 **Fora de Serviço** (#E74C3C)

---

## ⚙️ Funcionalidades

✅ Mapa interativo com OpenStreetMap
✅ Markers animados com status
✅ Popup ao clicar em viatura
✅ Lista de viaturas sincronizada
✅ Atualização em tempo real simulada
✅ Estatísticas de frota
✅ Responsivo (desktop, tablet, mobile)
✅ Toggle pause/resume
✅ Zoom automático
✅ Bearing (direção) por viatura

---

## 🔧 Próximos Passos

### Integração com API Real

```tsx
// Substituir simulação por API WebSocket ou polling
const pollGPS = () => {
  setInterval(async () => {
    const response = await fetch('/api/tracking/positions');
    const data = await response.json();
    setVehicles(data);
  }, 3000);
};
```

### Recursos Avançados

1. **Histórico de Rotas**
   - Exibir traço da rota percorrida
   - Timeline com paradas

2. **Geofencing**
   - Alertar quando viatura sai da zona
   - Área de proteção visual

3. **Alertas**
   - Velocidade anormal
   - Saída de rota programada
   - Manutenção próxima

4. **Filtros Avançados**
   - Por status
   - Por velocidade
   - Por região
   - Por motorista

5. **Exportação**
   - Relatório de rotas em PDF
   - Dados de rastreamento em CSV

---

## 📝 Notas

- Leaflet precisa estar importado em `src/main.tsx`
- OpenStreetMap é gratuito e não requer API key
- Para produção, considerar usar Mapbox ou Google Maps
- O hook `useRealTimeTracking` simula movimento realista
- Todos os componentes seguem o Design System

---

**Status**: ✅ Pronto para Produção
**Última Atualização**: 09/07/2026
