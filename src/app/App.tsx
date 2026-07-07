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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[3px] z-30 lg:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 shadow-2xl shadow-black/50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg, #06101f 0%, #060d1a 100%)", borderRight: "1px solid rgba(148,163,184,0.07)" }}>
        <div className="flex items-center justify-between h-16 px-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(148,163,184,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 animate-frota-pulse-ring"
              style={{ background: "linear-gradient(135deg, #2575f5 0%, #4f8dff 100%)", boxShadow: "0 4px 14px rgba(37,117,245,0.45)" }}>
              <Shield size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm leading-tight" style={{ fontFamily: "Roboto Slab, serif" }}>GestãoFrota</p>
              <p className="text-xs text-muted-foreground leading-tight">10º BPM · Blumenau</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {sections.map((section) => (
            <div key={section ?? "root"} className="mb-5">
              {section && (
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.12em] px-2.5 mb-2 font-semibold">{section}</p>
              )}
              {allowedItems.filter((item) => item.section === section).map((item) => {
                const active = tab === item.id;
                return (
                  <button key={item.id} onClick={() => { setTab(item.id as AppTabId); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all duration-200 group relative ${
                      active
                        ? "text-white shadow-md"
                        : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                    }`}
                    style={active ? { background: "linear-gradient(135deg, rgba(37,117,245,0.25) 0%, rgba(37,117,245,0.12) 100%)", border: "1px solid rgba(37,117,245,0.3)", boxShadow: "0 2px 12px rgba(37,117,245,0.15)" } : { border: "1px solid transparent" }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: "linear-gradient(180deg, #2575f5, #4f8dff)", boxShadow: "0 0 8px rgba(37,117,245,0.8)" }} />}
                    <item.icon size={15} className={`flex-shrink-0 transition-all duration-200 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span className={`flex-1 text-left font-medium ${active ? "text-white" : ""}`}>{item.label}</span>
                    {active && <ChevronRight size={11} className="text-primary/70" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 flex-shrink-0 space-y-3" style={{ borderTop: "1px solid rgba(148,163,184,0.07)" }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-colors duration-200 hover:bg-sidebar-accent cursor-default"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(148,163,184,0.08)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(37,117,245,0.3), rgba(37,117,245,0.15))", border: "1px solid rgba(37,117,245,0.3)" }}>
              <Shield size={13} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{currentUser.nome}</p>
              <p className="text-[10px] text-muted-foreground truncate">{ROLE_LABELS[currentUser.role]}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-[0.98]"
            style={{ border: "1px solid rgba(148,163,184,0.1)", background: "rgba(255,255,255,0.02)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.25)"; (e.currentTarget as HTMLElement).style.color = "#fca5a5"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.1)"; (e.currentTarget as HTMLElement).style.color = ""; }}
          >
            <LogOut size={13} /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center px-5 gap-4 flex-shrink-0"
          style={{ background: "rgba(9,16,31,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(148,163,184,0.09)", boxShadow: "0 1px 16px rgba(0,0,0,0.3)" }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/30">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">10º BPM Blumenau</span>
            <ChevronRight size={11} className="opacity-40 hidden sm:inline-block" />
            <span className="text-foreground font-semibold">{NAV_ITEMS.find((item) => item.id === tab)?.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Sistema Ativo</span>
            </div>
            <span className="text-muted-foreground text-xs hidden md:block" style={{ fontFamily: "DM Mono, monospace" }}>
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
