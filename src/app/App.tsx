import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Car, CalendarClock, ClipboardList,
  History, MapPin, TrendingUp, FileBarChart, Users, Shield, Menu, X, LogOut, Bell
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
import LoginScreen from "./components/LoginScreen";
import { useFleet } from "./context/FleetContext";
import { AppTabId, canAccessTab } from "./lib/permissions";

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

  const THEME_CSS = `:root{
  --font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  --brand-500: #1f6fff;
  --brand-300: #74a8ff;
  --brand-700: #0b4ed6;
  --bg: #f5f7fb;
  --surface: #ffffff;
  --muted: #6b7280;
  --border: rgba(15,23,42,0.06);
  --radius: 12px;
  --shadow-sm: 0 1px 2px rgba(16,24,40,0.04);
}

.app-root{ font-family: var(--font-family); background: var(--bg); }

/* Sidebar */
.sidebar-surface{ background: var(--surface); color: #0f172a; border-right: 1px solid var(--border); }
.sidebar-surface .brand-row{ border-bottom: 1px solid var(--border); }
.sidebar-surface .nav-section-title{ color: #9aa4b2; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; padding-left:12px; }
.sidebar-item{ width:100%; display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:8px; font-size:14px; }
.sidebar-item:hover{ background: rgba(31,111,255,0.04); }
.sidebar-item-active{ background: linear-gradient(90deg, rgba(31,111,255,0.12), rgba(31,111,255,0.04)); color: var(--brand-700); font-weight:600; box-shadow: var(--shadow-sm); }

/* Brand */
.header-brand{ display:flex; align-items:center; gap:12px; }
.logo-box{ width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg,var(--brand-500),var(--brand-300)); color:white; }
.brand-text{ font-weight:700; font-size:14px; }
.brand-sub{ font-size:11px; color:#8b97a4; }

/* Topbar */
.topbar{ height:56px; background: var(--surface); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 20px; }
.topbar .user-name{ font-size:14px; color:#0f172a; }

/* Hero / Cards */
.hero-pattern{ background-image: url('/assets/hero-pattern.svg'); background-repeat:no-repeat; background-position:right center; background-color: linear-gradient(90deg, rgba(31,111,255,0.12), rgba(31,111,255,0.06)); border-radius:12px; padding:24px; }
.card{ background: var(--surface); border:1px solid var(--border); border-radius:12px; box-shadow: var(--shadow-sm); padding:16px; }
.badge{ display:inline-block; padding:6px 10px; border-radius:999px; font-size:13px; }
.badge-success{ background: rgba(24,178,107,0.12); color:#18b26b; }
.badge-danger{ background: rgba(255,77,79,0.08); color:#ff4d4f; }

`;

  return (
    <>
      <style>{THEME_CSS}</style>
      <div className="app-root flex h-screen overflow-hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col sidebar-surface transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

          {/* Brand */}
          <div className="flex items-center justify-between h-16 px-5 flex-shrink-0 brand-row">
            <div className="flex items-center gap-3 header-brand">
              <div className="logo-box">
                <Shield size={18} />
              </div>
              <div>
                <p className="brand-text">FrotaPM</p>
                <p className="brand-sub">Blumenau - SC</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md">
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {sections.map((section) => (
              <div key={section ?? "root"} className="mb-4">
                {section && (
                  <p className="nav-section-title">{section}</p>
                )}
                {allowedItems.filter((item) => item.section === section).map((item) => {
                  const active = tab === item.id;
                  return (
                    <button key={item.id} onClick={() => { setTab(item.id as AppTabId); setSidebarOpen(false); }}
                      className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}>
                      <item.icon size={16} className="flex-shrink-0" />
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
          <header className="topbar flex items-center gap-4 flex-shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-md hover:bg-gray-100">
              <Menu size={18} />
            </button>

            <div className="ml-auto flex items-center gap-4">
              <span className="user-name hidden sm:block">{currentUser.nome}</span>

              {/* Notification bell */}
              <button className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={18} />
                <span style={{ position: 'absolute', top: -2, right: -6, width: 18, height: 18, background: '#ff4d4f', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
              </button>

              {/* Logout */}
              <button onClick={logout} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sair">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-5 lg:p-6">
            {renderTab(tab)}
          </main>
        </div>
      </div>
    </>
  );
}
