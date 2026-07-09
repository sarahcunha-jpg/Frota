import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Car, CalendarClock, ClipboardList,
  History, MapPin, TrendingUp, FileBarChart, Users, Shield, Menu, X, LogOut, Bell, Search, Settings
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
import { Button, Input } from "./components/ui";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: null },
  { id: "viaturas", label: "Viaturas", icon: Car, section: "Operações" },
  { id: "preventiva", label: "Manutenção Preventiva", icon: CalendarClock, section: "Operações" },
  { id: "os", label: "Ordens de Serviço", icon: ClipboardList, section: "Operações" },
  { id: "historico", label: "Histórico", icon: History, section: "Operações" },
  { id: "rastreamento", label: "Rastreamento", icon: MapPin, section: "Monitoramento" },
  { id: "kpis", label: "Indicadores (KPIs)", icon: TrendingUp, section: "Monitoramento" },
  { id: "relatorios", label: "Relatórios", icon: FileBarChart, section: "Análise" },
  { id: "usuarios", label: "Controle de Acesso", icon: Users, section: "Análise" },
] as const;

const ROLE_LABELS = {
  administrador: "Administrador",
  gestor: "Gestor",
  mecanico: "Mecânico",
  policial: "Policial",
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  const sections = Array.from(new Set(allowedItems.map((item) => item.section)));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ borderRight: "1px solid #e5e7eb" }}
      >
        {/* Brand */}
        <div
          className="flex items-center justify-between h-16 px-5 flex-shrink-0"
          style={{ borderBottom: "1px solid #e5e7eb" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2c4f7c 100%)" }}
            >
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">FrotaPM</p>
              <p className="text-[11px] text-gray-500 leading-tight">v1.0</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {sections.map((section) => (
            <div key={section ?? "root"} className="mb-4">
              {section && (
                <p className="text-[10px] text-gray-400 uppercase tracking-widest px-3 mb-2 font-semibold">{section}</p>
              )}
              {allowedItems.filter((item) => item.section === section).map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTab(item.id as AppTabId);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      active
                        ? "bg-[#1E3A5F] text-white font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                    }`}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 bg-white flex items-center px-5 gap-4 flex-shrink-0 shadow-sm"
          style={{ borderBottom: "1px solid #e5e7eb" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar viaturas, manutenções..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 transition-colors"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">3</span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <span className="text-sm text-gray-700 font-medium hidden sm:block">{currentUser.nome}</span>
              <button
                onClick={() => setTab("configuracoes" as any)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {tab === "configuracoes" ? <Configuracoes /> : renderTab(tab)}
        </main>
      </div>
    </div>
  );
}
