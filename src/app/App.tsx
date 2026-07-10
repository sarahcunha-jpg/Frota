import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Car, CalendarClock, ClipboardList,
  History, MapPin, TrendingUp, FileBarChart, Users, LogOut
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import Viaturas from "./components/Viaturas";
import ManutencaoPreventiva from "./components/ManutencaoPreventiva";
import OrdemServico from "./components/OrdemServico";
import Historico from "./components/Historico";
import Rastreamento from "./components/Rastreamento";
import KPIs from "./components/KPIs";
import Relatorios from "./components/Relatorios";
import Usuarios from "./components/Usuarios";
import Configuracoes from "./components/Configuracoes";
import LoginScreen from "./components/LoginScreen";
import { useFleet } from "./context/FleetContext";
import { AppTabId, canAccessTab } from "./lib/permissions";
import { Layout, Button } from "./components/ui";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", section: null },
  { id: "viaturas", label: "Viaturas", icon: "🚓", section: "Operações" },
  { id: "preventiva", label: "Manutenção Preventiva", icon: "🔧", section: "Operações" },
  { id: "os", label: "Ordens de Serviço", icon: "📋", section: "Operações" },
  { id: "historico", label: "Histórico", icon: "📜", section: "Operações" },
  { id: "rastreamento", label: "Rastreamento", icon: "📍", section: "Monitoramento" },
  { id: "kpis", label: "Indicadores (KPIs)", icon: "📊", section: "Monitoramento" },
  { id: "relatorios", label: "Relatórios", icon: "📈", section: "Análise" },
  { id: "usuarios", label: "Controle de Acesso", icon: "👥", section: "Análise" },
] as const;

function renderTab(tab: AppTabId) {
  switch (tab) {
    case "dashboard": return <Dashboard />;
    case "viaturas": return <Viaturas />;
    case "preventiva": return <ManutencaoPreventiva />;
    case "os": return <OrdemServico />;
    case "historico": return <Historico />;
    case "rastreamento": return <Rastreamento />;
    case "kpis": return <KPIs />;
    case "relatorios": return <Relatorios />;
    case "usuarios": return <Usuarios />;
    default: return <Dashboard />;
  }
}

export default function App() {
  const { currentUser, logout } = useFleet();
  const [tab, setTab] = useState<AppTabId>("dashboard");

  const allowedItems = useMemo(() => {
    if (!currentUser) return [];
    return NAV_ITEMS.filter((item) => canAccessTab(currentUser.role, item.id as AppTabId));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (!canAccessTab(currentUser.role, tab)) {
      setTab((allowedItems[0]?.id as AppTabId | undefined) ?? "dashboard");
    }
  }, [allowedItems, currentUser, tab]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const menuItems = allowedItems.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    onClick: () => setTab(item.id as AppTabId),
    active: tab === item.id,
  }));

  const getPageTitle = () => {
    const item = NAV_ITEMS.find(i => i.id === tab);
    return item?.label || "Dashboard";
  };

  return (
    <Layout
      menuItems={menuItems}
      headerTitle={getPageTitle()}
      headerSubtitle="Gestão de Frotas da Polícia Militar de Blumenau"
      headerActions={
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-600">{currentUser.nome}</span>
          <Button
            variant="neutral"
            size="sm"
            onClick={logout}
            icon={<LogOut size={16} />}
          >
            Sair
          </Button>
        </div>
      }
      onLogout={logout}
    >
      {tab === "configuracoes" ? <Configuracoes /> : renderTab(tab)}
    </Layout>
  );
}
