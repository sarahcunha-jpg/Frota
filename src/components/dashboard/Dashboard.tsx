import React, { useState } from 'react';
import { H1 } from '../typography/Typography';
import { Card, Button } from '../common';
import { KPICard } from './KPICard';
import { LineChartComponent, BarChartComponent, PieChartComponent } from './Charts';
import { AlertsSection } from './AlertsSection';

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

// Mock data
const mockKPIs = [
  {
    icon: '🚗',
    label: 'Viaturas Disponíveis',
    value: 28,
    trend: 'up' as const,
    trendValue: '+2',
    backgroundColor: 'bg-green-50',
  },
  {
    icon: '🔧',
    label: 'Em Manutenção',
    value: 16,
    trend: 'down' as const,
    trendValue: '-1',
    backgroundColor: 'bg-amber-50',
  },
  {
    icon: '⏱️',
    label: 'MTTR (horas)',
    value: 4.2,
    unit: 'h',
    trend: 'down' as const,
    trendValue: '-0.5',
    backgroundColor: 'bg-blue-50',
  },
  {
    icon: '💰',
    label: 'Custos do Mês',
    value: '7.280',
    unit: 'R$',
    trend: 'neutral' as const,
    backgroundColor: 'bg-purple-50',
  },
];

const mockLineChartData = [
  { name: 'Jan', MTTR: 5.2, MTBF: 380 },
  { name: 'Fev', MTTR: 4.8, MTBF: 400 },
  { name: 'Mar', MTTR: 4.5, MTBF: 420 },
  { name: 'Abr', MTTR: 4.2, MTBF: 450 },
  { name: 'Mai', MTTR: 4.1, MTBF: 480 },
  { name: 'Jun', MTTR: 4.2, MTBF: 500 },
];

const mockBarChartData = [
  { name: 'Preventiva', custo: 2400, qtd: 8 },
  { name: 'Corretiva', custo: 3200, qtd: 12 },
  { name: 'Revisão', custo: 1600, qtd: 5 },
  { name: 'Inspeção', custo: 800, qtd: 10 },
];

const mockPieChartData = [
  { name: 'Preventiva', value: 35 },
  { name: 'Corretiva', value: 45 },
  { name: 'Revisão', value: 15 },
  { name: 'Inspeção', value: 5 },
];

const mockAlerts = [
  {
    id: '1',
    title: 'Viatura GRA6R34 com manutenção vencida',
    description: 'Toyota Hilux necessita revisão urgente',
    severity: 'danger' as const,
    timestamp: 'há 2 horas',
    icon: '🚨',
  },
  {
    id: '2',
    title: 'Próxima manutenção em 500 km',
    description: 'Viatura PM001 - Iveco',
    severity: 'warning' as const,
    timestamp: 'há 4 horas',
    icon: '⚠️',
  },
  {
    id: '3',
    title: 'Custo de combustível acima da média',
    description: 'Frota com +12% de consumo este mês',
    severity: 'warning' as const,
    timestamp: 'há 6 horas',
    icon: '⚡',
  },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div>
        <H1>Dashboard</H1>
        <p className="text-neutral-600 mt-2">Visão geral da frota e indicadores de desempenho</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {mockKPIs.map((kpi, index) => (
          <KPICard
            key={index}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
            backgroundColor={kpi.backgroundColor}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <LineChartComponent
          title="MTTR / MTBF - Últimos 6 meses"
          type="line"
          data={mockLineChartData}
        />
        <BarChartComponent
          title="Manutenções por Tipo"
          type="bar"
          data={mockBarChartData}
        />
      </div>

      {/* Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1">
          <PieChartComponent
            title="Distribuição de Manutenções"
            type="pie"
            data={mockPieChartData}
          />
        </div>

        {/* Alerts */}
        <div className="lg:col-span-2">
          <AlertsSection
            alerts={mockAlerts}
            onAlertClick={(id) => setSelectedAlert(id)}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Ações Rápidas" icon="⚡">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onNavigate?.('/viaturas')}
          >
            🚗 Novas Viaturas
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onNavigate?.('/manutencoes')}
          >
            🔧 Agendar Manutenção
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onNavigate?.('/rastreamento')}
          >
            📍 Rastreamento
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onNavigate?.('/relatorios')}
          >
            📊 Relatórios
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;