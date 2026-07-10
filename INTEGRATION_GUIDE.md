# Guia de Integração Rápida

## 🚀 Como Integrar o Design System + Rastreamento

### Opção 1: Usar o Exemplo Completo

Veja o arquivo `src/app/components/ExampleIntegration.tsx` para um exemplo funcional de integração.

```bash
cd seu-projeto
git pull origin main
```

### Opção 2: Integração Gradual na App.tsx Existente

#### Passo 1: Importar Sidebar e TopBar

```tsx
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { spacing } from '@/styles/tokens';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', onClick: () => setCurrentPage('dashboard') },
    { id: 'viaturas', label: 'Viaturas', icon: '🚓', onClick: () => setCurrentPage('viaturas') },
    { id: 'rastreamento', label: 'Rastreamento', icon: '📍', onClick: () => setCurrentPage('rastreamento') },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={navItems} activeItem={currentPage} />
      <div style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
        <TopBar title={navItems.find(i => i.id === currentPage)?.label} user={{ name: 'João Silva' }} />
        <main style={{ padding: spacing.6 }}>
          {/* Seu conteúdo aqui */}
        </main>
      </div>
    </div>
  );
};
```

#### Passo 2: Substituir Componentes Antigos

**Botões:**
```tsx
// Antes
<button className="bg-blue-500 text-white...">Salvar</button>

// Depois
import Button from '@/components/ui/Button';
<Button variant="primary">Salvar</Button>
```

**Cards:**
```tsx
// Antes
<div className="shadow-md rounded-lg...">Conteúdo</div>

// Depois
import Card from '@/components/ui/Card';
<Card>Conteúdo</Card>
```

**Inputs:**
```tsx
// Antes
<input type="text" className="border.." />

// Depois
import Input from '@/components/ui/Input';
<Input label="Nome" placeholder="Digite aqui" />
```

#### Passo 3: Adicionar Rastreamento

```tsx
import TrackingPanel from '@/components/tracking/TrackingPanel';

const vehicles = [
  {
    id: '1',
    plate: 'KM-3456',
    model: 'Toyota Hilux',
    status: 'available',
    speed: 45,
    lat: -26.924,
    lng: -49.066,
    bearing: 90,
    mileage: 125400,
  },
  // ... mais viaturas
];

// Em seu componente de rastreamento
<TrackingPanel vehicles={vehicles} />
```

---

## 📦 Componentes Disponíveis

### UI Base
- `Button` — Botão com 5 variantes
- `Card` — Card reutilizável
- `Input` — Input com validação
- `Select` — Select customizado
- `Badge` — Badge para status
- `Modal` — Modal reutilizável
- `StatusBadge` — Status colorido de viaturas

### Layout
- `Sidebar` — Menu lateral
- `TopBar` — Barra superior
- `PageHeader` — Cabeçalho de página

### Dashboard
- `KPICard` — Card de KPI com trending
- `StatCard` — Card de estatística

### Viaturas
- `VehicleCardModern` — Card moderno de viatura
- `VehicleFilters` — Filtros de viaturas

### Manutenção
- `MaintenanceCard` — Card de manutenção

### Rastreamento
- `TrackingPanel` — Painel completo de rastreamento
- `TrackingMap` — Mapa Leaflet
- `VehicleList` — Lista de viaturas
- `TrackingStats` — Estatísticas

---

## 🎨 Tokens de Design

```tsx
import { colors, spacing, typography, shadows, borderRadius, transitions } from '@/styles/tokens';

// Cores
colors.primary          // '#1E3A5F'
colors.success          // '#27AE60'
colors.warning          // '#F39C12'
colors.danger           // '#E74C3C'

// Espaçamentos
spacing.1  // 4px
spacing.2  // 8px
spacing.4  // 16px
spacing.6  // 24px

// Tipografia
typography.h1   // { fontSize: '32px', fontWeight: 700 }
typography.body // { fontSize: '14px', fontWeight: 400 }
```

---

## ✅ Checklist de Integração

- [ ] Importar e usar `Sidebar` + `TopBar`
- [ ] Substituir botões pelos novos `Button`
- [ ] Substituir cards pelos novos `Card`
- [ ] Substituir inputs pelos novos `Input`
- [ ] Testar `TrackingPanel` de rastreamento
- [ ] Aplicar tokens de cores e espaçamentos
- [ ] Testar responsividade
- [ ] Testar em diferentes navegadores

---

## 🐛 Troubleshooting

### Erro: "Module not found: @/components/..."
**Solução:** Verifique o alias `@` em `vite.config.ts` ou `tsconfig.json`

### Mapa não aparece
**Solução:** Certifique-se que Leaflet está importado em `src/main.tsx`:
```tsx
import 'leaflet/dist/leaflet.css';
```

### Estilos não aplicam
**Solução:** Verifique se `src/styles/globals.css` está importado em `src/main.tsx`

---

## 📚 Documentação Completa

- `IMPLEMENTATION_GUIDE.md` — Design System
- `TRACKING_IMPLEMENTATION.md` — Rastreamento
- `src/app/components/ExampleIntegration.tsx` — Exemplo prático

---

**Dúvidas?** Consulte os comentários nos arquivos de componentes!
