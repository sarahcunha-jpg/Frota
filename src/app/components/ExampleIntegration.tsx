// Exemplo de Integração do Design System + Rastreamento
// Este arquivo mostra como usar os novos componentes na sua aplicação

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import KPICard from '@/components/dashboard/KPICard';
import VehicleCardModern from '@/components/vehicles/VehicleCardModern';
import VehicleFilters from '@/components/vehicles/VehicleFilters';
import TrackingPanel from '@/components/tracking/TrackingPanel';
import Modal from '@/components/ui/Modal';
import { spacing } from '@/styles/tokens';

// Dados de exemplo (conecte com seu contexto/API)
const EXAMPLE_VEHICLES = [
  {
    id: '1',
    plate: 'KM-3456',
    model: 'Toyota Hilux 2020',
    status: 'available' as const,
    lastMaintenance: '05/07/2026',
    nextMaintenance: '20/08/2026',
    mileage: 125400,
    // Para rastreamento
    speed: 45,
    lat: -26.924,
    lng: -49.066,
    bearing: 90,
  },
  {
    id: '2',
    plate: 'GRA-6R34',
    model: 'Chevrolet S10 2019',
    status: 'in_use' as const,
    lastMaintenance: '01/07/2026',
    nextMaintenance: '15/08/2026',
    mileage: 145200,
    speed: 60,
    lat: -26.920,
    lng: -49.065,
    bearing: 180,
  },
  {
    id: '3',
    plate: 'BNU-8H01',
    model: 'Ford Ranger 2021',
    status: 'maintenance' as const,
    lastMaintenance: '30/06/2026',
    nextMaintenance: '25/08/2026',
    mileage: 98500,
    speed: 0,
    lat: -26.925,
    lng: -49.064,
    bearing: 0,
  },
];

type NavigationId = 'dashboard' | 'vehicles' | 'maintenance' | 'tracking' | 'reports';

const ExampleApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationId>('dashboard');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Menu lateral
  const navItems = [
    { id: 'dashboard' as NavigationId, label: 'Dashboard', icon: '🏠', onClick: () => setCurrentPage('dashboard') },
    { id: 'vehicles' as NavigationId, label: 'Viaturas', icon: '🚓', onClick: () => setCurrentPage('vehicles') },
    { id: 'maintenance' as NavigationId, label: 'Manutenções', icon: '🔧', onClick: () => setCurrentPage('maintenance') },
    { id: 'tracking' as NavigationId, label: 'Rastreamento', icon: '📍', onClick: () => setCurrentPage('tracking') },
    { id: 'reports' as NavigationId, label: 'Relatórios', icon: '📈', onClick: () => setCurrentPage('reports') },
  ];

  // Renderizar página baseado em currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'vehicles':
        return <VehiclesPage vehicles={EXAMPLE_VEHICLES} onSelectVehicle={setSelectedVehicle} searchTerm={searchTerm} statusFilter={statusFilter} />;
      case 'tracking':
        return <TrackingPage vehicles={EXAMPLE_VEHICLES} />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Sidebar */}
      <Sidebar
        items={navItems.map(item => ({ ...item, id: item.id }))}
        activeItem={currentPage}
      />

      {/* Conteúdo Principal */}
      <div style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
        {/* TopBar */}
        <TopBar
          title={navItems.find(item => item.id === currentPage)?.label}
          user={{ name: 'João Silva' }}
          notifications={3}
        />

        {/* Página */}
        <main style={{ padding: spacing.6 }}>
          {renderPage()}
        </main>
      </div>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir Viatura"
        isDangerous
        onConfirm={() => {
          console.log('Viatura deletada:', selectedVehicle);
          setShowDeleteModal(false);
        }}
        confirmText="Excluir"
      >
        Tem certeza de que deseja excluir esta viatura? Essa ação não poderá ser desfeita.
      </Modal>
    </div>
  );
};

// ============== PÁGINAS ==============

const DashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Acompanhe o desempenho da sua frota em tempo real"
        action={<Button variant="primary">+ Adicionar Viatura</Button>}
      />

      {/* KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.6,
          marginBottom: spacing.8,
        }}
      >
        <KPICard icon="🚓" label="Viaturas Disponíveis" value={28} trend={{ direction: 'up', percentage: 5 }} />
        <KPICard icon="🔧" label="Em Manutenção" value={16} />
        <KPICard icon="💰" label="Custos do Mês" value="R$ 7.280" />
        <KPICard icon="📍" label="Rastreadas" value={42} />
      </div>

      {/* Gráficos (placeholder) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.6,
        }}
      >
        <Card header={<h3 style={{ margin: 0 }}>Manutenções por Tipo</h3>}>
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Gráfico de Pizza
          </div>
        </Card>
        <Card header={<h3 style={{ margin: 0 }}>Custos por Veículo</h3>}>
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Gráfico de Barras
          </div>
        </Card>
      </div>
    </div>
  );
};

const VehiclesPage: React.FC<{
  vehicles: typeof EXAMPLE_VEHICLES;
  onSelectVehicle: (id: string) => void;
  searchTerm: string;
  statusFilter: string;
}> = ({ vehicles, onSelectVehicle, searchTerm, statusFilter }) => {
  return (
    <div>
      <PageHeader
        title="Gestão de Viaturas"
        description="Cadastre e gerencie todas as viaturas da frota"
        action={<Button variant="primary">+ Nova Viatura</Button>}
      />

      {/* Filtros */}
      <VehicleFilters
        onSearch={(value) => console.log('Buscar:', value)}
        onStatusFilter={(value) => console.log('Filtrar por status:', value)}
        onReset={() => console.log('Resetar filtros')}
      />

      {/* Grid de Viaturas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: spacing.6,
        }}
      >
        {vehicles.map((vehicle) => (
          <VehicleCardModern
            key={vehicle.id}
            {...vehicle}
            onEdit={() => console.log('Editar:', vehicle.id)}
            onDelete={() => console.log('Deletar:', vehicle.id)}
            onView={() => {
              console.log('Visualizar:', vehicle.id);
              onSelectVehicle(vehicle.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const TrackingPage: React.FC<{ vehicles: typeof EXAMPLE_VEHICLES }> = ({ vehicles }) => {
  return <TrackingPanel vehicles={vehicles} />;
};

const MaintenancePage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Gestão de Manutenções"
        description="Acompanhe todas as manutenções preventivas e corretivas da frota"
        action={<Button variant="primary">+ Nova Manutenção</Button>}
      />
      <Card>
        <div style={{ textAlign: 'center', padding: spacing.8, color: '#999' }}>
          Página de Manutenções (em desenvolvimento)
        </div>
      </Card>
    </div>
  );
};

const ReportsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Gere e exporte relatórios de desempenho da frota"
        action={<Button variant="primary">📥 Exportar</Button>}
      />
      <Card>
        <div style={{ textAlign: 'center', padding: spacing.8, color: '#999' }}>
          Página de Relatórios (em desenvolvimento)
        </div>
      </Card>
    </div>
  );
};

export default ExampleApp;
