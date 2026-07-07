import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Car, CalendarClock, ClipboardList,
  History, MapPin, TrendingUp, FileBarChart, Users, Shield, Menu, X, ChevronRight, LogOut
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

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-30 lg:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 shadow-xl shadow-black/30 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/40 transition-transform duration-200 hover:scale-105">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm leading-tight" style={{ fontFamily: "Roboto Slab, serif" }}>GestãoFrota</p>
              <p className="text-xs text-muted-foreground leading-tight">10º BPM · Blumenau</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {sections.map((section) => (
            <div key={section ?? "root"} className="mb-4">
              {section && (
                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest px-2 mb-1.5 font-semibold">{section}</p>
              )}
              {allowedItems.filter((item) => item.section === section).map((item) => {
                const active = tab === item.id;
                return (
                  <button key={item.id} onClick={() => { setTab(item.id as AppTabId); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 transition-all duration-200 group relative ${active ? "bg-primary/15 text-primary shadow-sm shadow-primary/10" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5"}`}>
                    {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-primary rounded-full shadow-sm shadow-primary/60" />}
                    <item.icon size={15} className={`transition-transform duration-200 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {active && <ChevronRight size={12} className="text-primary opacity-60" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-sidebar-border flex-shrink-0 space-y-3">
          <div className="flex items-center gap-2.5 px-1 py-1 rounded-lg hover:bg-sidebar-accent transition-colors duration-200">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
              <Shield size={12} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{currentUser.nome}</p>
              <p className="text-xs text-muted-foreground truncate">{ROLE_LABELS[currentUser.role]}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 border border-border rounded-md py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-sidebar-accent transition-all duration-200 active:scale-[0.98]">
            <LogOut size={13} /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-5 gap-4 flex-shrink-0 shadow-sm shadow-black/10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>10º BPM Blumenau</span>
            <ChevronRight size={12} className="opacity-40" />
            <span className="text-foreground font-medium">{NAV_ITEMS.find((item) => item.id === tab)?.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Ativo
            </div>
            <span className="text-muted-foreground text-xs mono" style={{ fontFamily: "DM Mono, monospace" }}>
              {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-6 animate-frota-fade-in">
          {renderTab(tab)}
        </main>
      </div>
    </div>
  );
}
