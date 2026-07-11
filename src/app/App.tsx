import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import Viaturas from './components/Viaturas';
import ManutencaoPreventiva from './components/ManutencaoPreventiva';
import OrdemServico from './components/OrdemServico';
import Historico from './components/Historico';
import Rastreamento from './components/Rastreamento';
import KPIs from './components/KPIs';
import Relatorios from './components/Relatorios';
import Usuarios from './components/Usuarios';
import Configuracoes from './components/Configuracoes';
import LoginScreen from './components/LoginScreen';
import { useFleet } from './context/FleetContext';
import { AppTabId, canAccessTab } from './lib/permissions';
import { Layout } from '../components/layout';
import { Button } from '../components/common';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', section: null },
  { id: 'viaturas', label: 'Viaturas', icon: '🚓', section: 'Operações' },
  { id: 'preventiva', label: 'Manutenção Preventiva', icon: '🔧', section: 'Operações' },
  { id: 'os', label: 'Ordens de Serviço', icon: '📋', section: 'Operações' },
  { id: 'historico', label: 'Histórico', icon: '📜', section: 'Operações' },
  { id: 'rastreamento', label: 'Rastreamento', icon: '📍', section: 'Monitoramento' },
  { id: 'kpis', label: 'Indicadores (KPIs)', icon: '📊', section: 'Monitoramento' },
  { id: 'relatorios', label: 'Relatórios', icon: '📈', section: 'Análise' },
  { id: 'usuarios', label: 'Controle de Acesso', icon: '👥', section: 'Análise' },
] as const;

function renderTab(tab: AppTabId) {
  switch (tab) {
    case 'dashboard':
      return <Dashboard />;
    case 'viaturas':
      return <Viaturas />;
    case 'preventiva':
      return <ManutencaoPreventiva />;
    case 'os':
      return <OrdemServico />;
    case 'historico':
      return <Historico />;
    case 'rastreamento':
      return <Rastreamento />;
    case 'kpis':
      return <KPIs />;
    case 'relatorios':
      return <Relatorios />;
    case 'usuarios':
      return <Usuarios />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  const { currentUser, logout } = useFleet();
  const [tab, setTab] = useState<AppTabId>('dashboard');

  const allowedItems = useMemo(() => {
    if (!currentUser) return [];
    return NAV_ITEMS.filter((item) => canAccessTab(currentUser.role, item.id as AppTabId));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (!canAccessTab(currentUser.role, tab)) {
      setTab((allowedItems[0]?.id as AppTabId | undefined) ?? 'dashboard');
    }
  }, [allowedItems, currentUser, tab]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const menuItems = allowedItems.map((item) => ({
    icon: item.icon,
    label: item.label,
    path: `/${item.id}`,
    badge: undefined,
  }));

  const getPageTitle = () => {
    const item = NAV_ITEMS.find((i) => i.id === tab);
    return item?.label || 'Dashboard';
  };

  const getPageDescription = () => {
    switch (tab) {
      case 'dashboard':
        return 'Visão geral da frota e indicadores de desempenho';
      case 'viaturas':
        return 'Gerencie todos os veículos da frota';
      case 'preventiva':
        return 'Planeie e acompanhe manutenções preventivas';
      case 'os':
        return 'Controle ordens de serviço';
      case 'historico':
        return 'Consulte histórico de manutenções';
      case 'rastreamento':
        return 'Acompanhe viaturas em tempo real';
      case 'kpis':
        return 'Acompanhe indicadores de desempenho';
      case 'relatorios':
        return 'Gere relatórios e análises';
      case 'usuarios':
        return 'Gerencie usuários e permissões';
      default:
        return '';
    }
  };

  return (
    <Layout
      title={getPageTitle()}
      description={getPageDescription()}
      menuItems={menuItems}
      activePath={`/${tab}`}
      onNavigate={(path) => {
        const tabId = path.slice(1) as AppTabId;
        if (canAccessTab(currentUser.role, tabId)) {
          setTab(tabId);
        }
      }}
      notifications={0}
      userInfo={{
        name: currentUser.nome,
        avatar: '👤',
      }}
      actions={
        <Button variant="danger" size="small" onClick={logout}>
          🚪 Sair
        </Button>
      }
    >
      {renderTab(tab)}
    </Layout>
  );
}
