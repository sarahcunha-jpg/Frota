# Guia de Implementação - Design System 🎨

Este documento descreve as mudanças implementadas no repositório Frota para modernizar a interface de usuário.

## ✨ O que foi criado

### 1. **Sistema de Tokens** (`src/styles/tokens.ts`)
- Paleta de cores centralizada (primária, sucesso, alerta, perigo)
- Espaçamentos padronizados
- Tipografia (H1, H2, body, captions)
- Sombras consistentes
- Animações e transições

### 2. **Componentes Base** (`src/components/ui/`)
- **Button.tsx** - Botões com variantes (primary, success, danger, secondary, ghost)
- **Card.tsx** - Cards com header, footer e efeitos hover
- **Input.tsx** - Inputs com label, error e ícones
- **Select.tsx** - Selects customizados
- **Badge.tsx** - Badges para status e informações
- **StatusBadge.tsx** - Badges específicas para status de viaturas
- **Modal.tsx** - Modal reutilizável com confirmação

### 3. **Layout** (`src/components/layout/`)
- **Sidebar.tsx** - Menu lateral fixo com logo e navegação
- **TopBar.tsx** - Barra superior com busca, notificações e perfil
- **PageHeader.tsx** - Cabeçalho de página padronizado

### 4. **Dashboard** (`src/components/dashboard/`)
- **KPICard.tsx** - Cards para indicadores principais (com ícone, valor e trend)
- **StatCard.tsx** - Cards para estatísticas

### 5. **Viaturas** (`src/components/vehicles/`)
- **VehicleCardModern.tsx** - Card modernizado com placa, modelo, status, manutenções e ações
- **VehicleFilters.tsx** - Filtros (busca, status, limpar)

### 6. **Manutenções** (`src/components/maintenance/`)
- **MaintenanceCard.tsx** - Card com informações de manutenção (tipo, responsável, status, custo)

### 7. **Estilos Globais** (`src/styles/globals.css`)
- Fontes importadas do Google Fonts
- Reset de estilos
- Scrollbar customizada
- Seleção e focus-visible

## 🎯 Como usar

### 1. Importar Componentes

```tsx
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import StatusBadge from '@/components/ui/StatusBadge';
import VehicleCardModern from '@/components/vehicles/VehicleCardModern';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import KPICard from '@/components/dashboard/KPICard';
```

### 2. Exemplo: Dashboard com Layout

```tsx
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import PageHeader from '@/components/layout/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import Button from '@/components/ui/Button';

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', onClick: () => setActiveNav('dashboard') },
    { id: 'vehicles', label: 'Viaturas', icon: '🚓', onClick: () => setActiveNav('vehicles') },
    { id: 'maintenance', label: 'Manutenções', icon: '🔧', onClick: () => setActiveNav('maintenance') },
    { id: 'tracking', label: 'Rastreamento', icon: '📍', onClick: () => setActiveNav('tracking') },
    { id: 'reports', label: 'Relatórios', icon: '📈', onClick: () => setActiveNav('reports') },
    { id: 'users', label: 'Usuários', icon: '👤', onClick: () => setActiveNav('users') },
    { id: 'settings', label: 'Configurações', icon: '⚙️', onClick: () => setActiveNav('settings') },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={navItems} activeItem={activeNav} />
      
      <div style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
        <TopBar
          title="Dashboard"
          user={{ name: 'João Silva' }}
          notifications={notifications}
        />
        
        <main style={{ padding: '24px' }}>
          <PageHeader
            title="Gestão de Frotas"
            description="Acompanhe o desempenho da sua frota em tempo real"
            action={<Button>+ Adicionar Viatura</Button>}
          />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}>
            <KPICard icon="🚓" label="Viaturas Disponíveis" value={28} trend={{ direction: 'up', percentage: 5 }} />
            <KPICard icon="🔧" label="Em Manutenção" value={16} />
            <KPICard icon="💰" label="Custos do Mês" value="R$ 7.280" />
            <KPICard icon="📍" label="Rastreadas" value={42} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 3. Exemplo: Lista de Viaturas

```tsx
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import PageHeader from '@/components/layout/PageHeader';
import VehicleCardModern from '@/components/vehicles/VehicleCardModern';
import VehicleFilters from '@/components/vehicles/VehicleFilters';
import Button from '@/components/ui/Button';

const Vehicles = () => {
  const [activeNav, setActiveNav] = useState('vehicles');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', onClick: () => setActiveNav('dashboard') },
    { id: 'vehicles', label: 'Viaturas', icon: '🚓', onClick: () => setActiveNav('vehicles') },
    // ... outros itens
  ];

  const vehicles = [
    {
      id: '1',
      plate: 'KM-3456',
      model: 'Toyota Hilux 2020',
      status: 'available',
      lastMaintenance: '05/07/2026',
      nextMaintenance: '20/08/2026',
      mileage: 125400,
    },
    // ... mais viaturas
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={navItems} activeItem={activeNav} />
      
      <div style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
        <TopBar
          title="Gestão de Viaturas"
          user={{ name: 'João Silva' }}
        />
        
        <main style={{ padding: '24px' }}>
          <PageHeader
            title="Gestão de Viaturas"
            description="Cadastre e gerencie todas as viaturas da frota"
            action={<Button variant="primary">+ Nova Viatura</Button>}
          />
          
          <VehicleFilters
            onSearch={setSearch}
            onStatusFilter={setStatusFilter}
            onReset={() => {
              setSearch('');
              setStatusFilter('');
            }}
          />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {vehicles.map((vehicle) => (
              <VehicleCardModern
                key={vehicle.id}
                {...vehicle}
                onEdit={() => console.log('Editar', vehicle.id)}
                onDelete={() => console.log('Deletar', vehicle.id)}
                onView={() => console.log('Visualizar', vehicle.id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Vehicles;
```

## 📋 Próximos Passos

1. **Integrar componentes na App.tsx**
   - Substituir o layout atual pelo novo Sidebar + TopBar
   - Aplicar novos componentes nas páginas existentes

2. **Responsividade**
   - Adaptar Sidebar para mobile (hamburger menu)
   - Ajustar grids para telas menores
   - Testar em tablet e mobile

3. **Animações**
   - Adicionar transições ao trocar de página
   - Efeitos ao abrir modais
   - Animações de carregamento

4. **Temas**
   - Implementar modo escuro (opcional)
   - Toggle de temas

5. **Testes**
   - Testes de acessibilidade (WCAG)
   - Testes em múltiplos navegadores
   - Performance (Lighthouse)

## 🎨 Paleta de Cores

- **Primária**: #1E3A5F (Azul Institucional)
- **Sucesso**: #27AE60 (Verde)
- **Alerta**: #F39C12 (Amarelo)
- **Perigo**: #E74C3C (Vermelho)
- **Info**: #3498DB (Azul Claro)
- **Neutras**: Escala de cinzas (50-900)

## 📐 Espaçamentos

- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

## 🔤 Tipografia

- **Fonte**: Inter, Roboto, Poppins
- **H1**: 32px, 700 weight
- **H2**: 24px, 600 weight
- **Body**: 14px, 400 weight
- **Caption**: 12px, 400 weight

---

**Status**: ✅ Pronto para integração
**Última atualização**: 09/07/2026
