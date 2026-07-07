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
        <div className="fixed inset-0 bg-black/65 backdrop-blur-[3px] z-30 lg:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 shadow-2xl shadow-black/50 border-r border-sidebar-border ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg, #060c18 0%, #080f1c 60%, #050b16 100%)" }}>

        {/* Subtle top glow accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 animate-frota-glow-pulse"
              style={{ background: "linear-gradient(135deg, #2979ff 0%, #1a56cc 100%)", boxShadow: "0 0 14px rgba(41,121,255,0.45)" }}>
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm leading-tight" style={{ fontFamily: "Roboto Slab, serif" }}>GestãoFrota</p>
              <p className="text-xs leading-tight" style={{ color: "rgba(148,163,184,0.65)" }}>10º BPM · Blumenau</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-sidebar-accent">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {sections.map((section) => (
            <div key={section ?? "root"} className="mb-5">
              {section && (
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.14em] px-2 mb-2 font-semibold">{section}</p>
              )}
              {allowedItems.filter((item) => item.section === section).map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id as AppTabId); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all duration-200 group relative overflow-hidden ${
                      active
                        ? "text-primary shadow-md shadow-primary/15"
                        : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:translate-x-0.5"
                    }`}
                    style={active ? { background: "linear-gradient(90deg, rgba(41,121,255,0.18) 0%, rgba(41,121,255,0.06) 100%)" } : undefined}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(23,32,56,0.9)"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = ""; }}
                  >
                    {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" style={{ boxShadow: "0 0 8px rgba(41,121,255,0.7)" }} />}
                    <item.icon size={15} className={`transition-all duration-200 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {active && <ChevronRight size={12} className="text-primary opacity-70" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-sidebar-border flex-shrink-0 space-y-2.5">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-all duration-200 cursor-default group">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-primary/30 group-hover:ring-primary/50 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, rgba(41,121,255,0.25) 0%, rgba(41,121,255,0.10) 100%)", boxShadow: "0 0 6px rgba(41,121,255,0.15)" }}>
              <Shield size={12} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{currentUser.nome}</p>
              <p className="text-[10px] text-muted-foreground/70 truncate">{ROLE_LABELS[currentUser.role]}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/25 hover:bg-sidebar-accent transition-all duration-200 active:scale-[0.98] group">
            <LogOut size={13} className="group-hover:text-primary transition-colors duration-200" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-5 gap-4 flex-shrink-0 relative"
          style={{ background: "linear-gradient(90deg, rgba(15,24,48,0.97) 0%, rgba(8,14,29,0.97) 100%)", backdropFilter: "blur(12px)" }}>
          {/* Subtle bottom gradient accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/20">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>10º BPM Blumenau</span>
            <ChevronRight size={12} className="opacity-40" />
            <span className="text-foreground font-medium">{NAV_ITEMS.find((item) => item.id === tab)?.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/25 transition-all duration-200 hover:border-emerald-500/40"
              style={{ background: "rgba(16,185,129,0.08)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Ativo
            </div>
            <span className="text-muted-foreground/70 text-xs mono hidden sm:block" style={{ fontFamily: "DM Mono, monospace" }}>
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
