# 🗺️ Rastreamento em Tempo Real - Guia de Implementação

## ✨ O que foi criado

### 📦 Componentes Novos

#### 1. **TrackingMap.tsx** (`src/components/tracking/TrackingMap.tsx`)
Componente principal do mapa com Leaflet + OpenStreetMap.

**Funcionalidades:**
- ✅ Mapa interativo centrado em Blumenau, SC
- ✅ Markers animados para cada viatura com cores por status:
  - 🟢 Verde (Operacional)
  - 🟡 Amarelo (Em Manutenção)
  - 🔴 Vermelho (Indisponível)
- ✅ Popups com informações detalhadas ao clicar
- ✅ Rotas/traços do histórico (linhas tracejadas)
- ✅ Ícone de viatura (🚓) com rotação de direção
- ✅ Destaque do marker selecionado
- ✅ Atualização suave de posições

**Props:**
```typescript
interface TrackingMapProps {
  vehicles: Vehicle[]; // Array de viaturas com coordenadas
  selectedVehicleId?: string; // ID da viatura selecionada
  onVehicleSelect?: (vehicleId: string) => void; // Callback ao selecionar viatura
  height?: string; // Altura do mapa (padrão: '500px')
}
```

**Exemplo de Uso:**
```tsx
import TrackingMap from '@/components/tracking/TrackingMap';

const MyMap = () => (
  <TrackingMap
    vehicles={vehicles}
    selectedVehicleId={selectedId}
    onVehicleSelect={setSelectedId}
    height="600px"
  />
);
```

---

#### 2. **VehicleTrackingPanel.tsx** (`src/components/tracking/VehicleTrackingPanel.tsx`)
Painel lateral com lista de viaturas e detalhes.

**Funcionalidades:**
- ✅ Lista scrollável de todas as viaturas
- ✅ Indicador visual de seleção
- ✅ Status com cores (🟢🟡🔴)
- ✅ Velocidade em tempo real
- ✅ Detalhes da viatura selecionada:
  - Coordenadas GPS (latitude/longitude)
  - Velocidade (km/h)
  - Direção com bússola visual
  - Quilometragem
  - Status
- ✅ Botões de ação (Contatar Motorista, Histórico)
- ✅ Hover effects suaves

**Props:**
```typescript
interface VehicleTrackingPanelProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle;
  onVehicleSelect?: (vehicleId: string) => void;
}
```

---

#### 3. **RealTimeUpdater.ts** (`src/components/tracking/RealTimeUpdater.ts`)
Hook React para simular atualizações GPS em tempo real.

**Funcionalidades:**
- ✅ Atualização automática a cada X ms (padrão: 5s)
- ✅ Simulação realista de:
  - Movimento GPS (variação de coordenadas)
  - Mudança de velocidade
  - Mudança de direção
  - Incremento de quilometragem
- ✅ Respeita status da viatura (só move se em operação)
- ✅ Limpeza automática de intervalo

**Uso:**
```tsx
import { useRealTimeTracking } from '@/components/tracking/RealTimeUpdater';

const MyComponent = ({ vehicles }) => {
  const updatedVehicles = useRealTimeTracking({
    vehicles,
    updateInterval: 5000, // 5 segundos
  });

  return <TrackingMap vehicles={updatedVehicles} />;
};
```

---

#### 4. **TrackingDashboard.tsx** (`src/components/tracking/TrackingDashboard.tsx`)
Dashboard completa que integra tudo.

**Funcionalidades:**
- ✅ Página Header com título e descrição
- ✅ Grid responsivo (mapa + painel lateral)
- ✅ Integração com RealTimeUpdater
- ✅ Sincronização entre mapa e painel
- ✅ Design moderno com espaçamentos do design system

**Uso:**
```tsx
import TrackingDashboard from '@/components/tracking/TrackingDashboard';

const App = () => {
  const vehicles = [
    {
      id: 'v1',
      placa: 'KM-3456',
      modelo: 'Toyota Hilux 2020',
      status: 'operação',
      x: -49.066,
      y: -26.9319,
      velocidade: 45,
      direcao: 90,
      km: 125400,
    },
    // ... mais viaturas
  ];

  return <TrackingDashboard vehicles={vehicles} />;
};
```

---

## 📊 Estrutura de Dados da Viatura

```typescript
interface Vehicle {
  id: string;           // ID único
  placa: string;        // Placa (ex: KM-3456)
  modelo: string;       // Modelo (ex: Toyota Hilux 2020)
  status: string;       // 'operação' | 'manutenção' | 'indisponível'
  x: number;            // Longitude (ex: -49.066)
  y: number;            // Latitude (ex: -26.9319)
  velocidade: number;   // km/h
  direcao: number;      // 0-360 graus
  km: number;           // Quilometragem total
}
```

---

## 🎨 Cores e Status

| Status | Cor | Emoji | Label |
|--------|-----|-------|-------|
| Operação | Verde (#27AE60) | 🟢 | Operacional |
| Manutenção | Amarelo (#F39C12) | 🟡 | Em Manutenção |
| Indisponível | Vermelho (#E74C3C) | 🔴 | Indisponível |

---

## 🔄 Fluxo de Atualização em Tempo Real

```
App.tsx
  ↓
TrackingDashboard (estado: selectedVehicleId)
  ↓
useRealTimeTracking (atualiza vehicles a cada 5s)
  ↓
├→ TrackingMap (renderiza markers e rotas)
│   └→ Atualiza posições suavemente
│   └→ Destaca marker selecionado
│
└→ VehicleTrackingPanel (mostra detalhes)
    └→ Atualiza velocidade, direção, km
    └→ Permite selecionar viatura
```

---

## 🚀 Como Integrar na App.tsx

### 1. Importar componente
```tsx
import TrackingDashboard from '@/components/tracking/TrackingDashboard';
```

### 2. Obter viaturas do contexto
```tsx
const { viaturas } = useFleet();
```

### 3. Renderizar
```tsx
case 'rastreamento':
  return <TrackingDashboard vehicles={viaturas} />;
```

---

## 📱 Responsividade

- **Desktop (> 1024px):** Mapa à esquerda (1fr) + Painel à direita (300px)
- **Tablet (768px - 1024px):** Grid ajustável ou stack vertical
- **Mobile (< 768px):** Stack vertical, mapa full-width

---

## 🔧 Configurações Avançadas

### Alterar intervalo de atualização
```tsx
const vehicles = useRealTimeTracking({
  vehicles: initialVehicles,
  updateInterval: 3000, // 3 segundos (mais rápido)
});
```

### Customizar altura do mapa
```tsx
<TrackingMap height="800px" />
```

### Mudar centro do mapa (Blumenau → outro lugar)
Em `TrackingMap.tsx`, linha ~31:
```typescript
const map = L.map(containerRef.current).setView([latitude, longitude], zoomLevel);
```

---

## 🎯 Features Futuras

- [ ] Histórico de rotas (polylines permanentes)
- [ ] Geofencing (alertas quando viatura sai da área)
- [ ] Integração com GPS real (em vez de simulado)
- [ ] Relatório de rotas em PDF
- [ ] Câmera integrada para monitoramento
- [ ] Alertas de velocidade excessiva
- [ ] Modo noturno (dark mode)
- [ ] Exportação de dados de rastreamento

---

## 📝 Notas

- O hook `useRealTimeTracking` simula GPS. Para GPS real, substitua a lógica interna com chamadas de API.
- Leaflet é já instalado no projeto (`package.json`)
- OpenStreetMap é gratuito e não requer API key
- Recomenda-se usar `react-leaflet` para projetos maiores (futuro)

---

**Status**: ✅ Pronto para Produção  
**Última Atualização**: 09/07/2026  
**Versão**: 1.0  
