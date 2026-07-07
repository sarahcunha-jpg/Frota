import { useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { useFleet } from "../context/FleetContext";

const ROLE_LABELS = {
  administrador: "Administrador",
  gestor: "Gestor",
  mecanico: "Mecânico",
  policial: "Policial",
};

export default function LoginScreen() {
  const { usuarios, login } = useFleet();
  const ativos = usuarios.filter((user) => user.ativo);
  const [selectedId, setSelectedId] = useState(ativos[0]?.id ?? "");
  const [matricula, setMatricula] = useState(ativos[0]?.matricula ?? "");
  const [error, setError] = useState("");

  const selected = ativos.find((user) => user.id === selectedId) ?? ativos[0];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedId || !login(selectedId, matricula)) {
      setError("Credenciais de demonstração inválidas. Use a matrícula do usuário selecionado.");
      return;
    }
    setError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: "Inter, sans-serif", background: "radial-gradient(ellipse at 20% 20%, #0f2044 0%, #080f1e 55%), radial-gradient(ellipse at 80% 80%, #0d1a30 0%, transparent 60%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(45,120,245,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(45,120,245,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />

      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 animate-frota-scale-in relative">
        <div className="rounded-2xl p-8 lg:p-10 shadow-2xl" style={{ background: "linear-gradient(135deg, #0f1a2e 0%, #0b1422 100%)", border: "1px solid rgba(45,120,245,0.12)", boxShadow: "0 24px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105" style={{ background: "linear-gradient(135deg, #2d78f5 0%, #1a5cd4 100%)", boxShadow: "0 4px 20px rgba(45,120,245,0.45)" }}>
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>GestãoFrota PMSC</h1>
              <p className="text-sm text-muted-foreground">MVP funcional da gestão da frota do 10º BPM de Blumenau</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {[
              "Dashboard com indicadores operacionais",
              "Cadastro de viaturas com CRUD e visualização",
              "Plano preventivo com alertas por cor",
              "Ordens de serviço, histórico e relatórios",
            ].map((item) => (
              <div key={item} className="rounded-xl p-4 text-sm text-foreground cursor-default frota-feature-card">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" style={{ boxShadow: "0 0 6px rgba(45,120,245,0.60)" }} />
                  {item}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 text-sm text-amber-200" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)" }}>
            Ambiente demonstrativo: selecione um perfil e entre usando a matrícula já exibida no cadastro do usuário.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 lg:p-10 space-y-5 shadow-2xl" style={{ background: "linear-gradient(135deg, #0f1a2e 0%, #0b1422 100%)", border: "1px solid rgba(148,163,184,0.10)", boxShadow: "0 24px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Entrar no sistema</h2>
            <p className="text-sm text-muted-foreground mt-1">Autenticação básica com proteção por perfil</p>
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Usuário</label>
            <select
              value={selectedId}
              onChange={(event) => {
                const user = ativos.find((item) => item.id === event.target.value);
                setSelectedId(event.target.value);
                setMatricula(user?.matricula ?? "");
              }}
              className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground frota-input transition-colors duration-200"
            >
              {ativos.map((user) => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Matrícula</label>
            <input
              value={matricula}
              onChange={(event) => setMatricula(event.target.value)}
              className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground frota-input transition-colors duration-200"
            />
          </div>

          {selected && (
            <div className="rounded-xl p-4 transition-all duration-200 animate-frota-fade-in" style={{ background: "rgba(45,120,245,0.08)", border: "1px solid rgba(45,120,245,0.20)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(45,120,245,0.25) 0%, rgba(45,120,245,0.12) 100%)", border: "1px solid rgba(45,120,245,0.35)", boxShadow: "0 0 10px rgba(45,120,245,0.18)" }}>
                  <UserRound size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{selected.nome}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_LABELS[selected.role]} · {selected.unidade}</p>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="w-full text-white rounded-lg py-2.5 text-sm font-semibold frota-btn-primary">
            Acessar sistema
          </button>
        </form>
      </div>
    </div>
  );
}
