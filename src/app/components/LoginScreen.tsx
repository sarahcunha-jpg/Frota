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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: "Inter, sans-serif", background: "#080e1d" }}>
      {/* Animated background mesh */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #2979ff 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-15%] right-[-8%] w-[40vw] h-[40vw] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(148,163,184,1) 0px, rgba(148,163,184,1) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(148,163,184,1) 0px, rgba(148,163,184,1) 1px, transparent 1px, transparent 60px)" }} />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 animate-frota-scale-in relative z-10">
        <div className="rounded-2xl p-8 lg:p-10 shadow-2xl shadow-black/40 border border-primary/10 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f1830 0%, #0a1222 100%)" }}>
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #2979ff 0%, #1a56cc 100%)", boxShadow: "0 0 24px rgba(41,121,255,0.4)" }}>
              <ShieldCheck size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>GestãoFrota PMSC</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(148,163,184,0.7)" }}>MVP funcional da gestão da frota do 10º BPM de Blumenau</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {[
              "Dashboard com indicadores operacionais",
              "Cadastro de viaturas com CRUD e visualização",
              "Plano preventivo com alertas por cor",
              "Ordens de serviço, histórico e relatórios",
            ].map((item) => (
              <div key={item}
                className="rounded-xl border p-4 text-sm text-foreground cursor-default group relative overflow-hidden transition-all duration-250 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
                style={{ borderColor: "rgba(41,121,255,0.12)", background: "rgba(41,121,255,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(41,121,255,0.28)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(41,121,255,0.09)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(41,121,255,0.12)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(41,121,255,0.04)"; }}
              >
                <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary" />
                {item}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-500/25 p-4 text-sm text-amber-200/90"
            style={{ background: "rgba(245,158,11,0.07)" }}>
            Ambiente demonstrativo: selecione um perfil e entre usando a matrícula já exibida no cadastro do usuário.
          </div>
        </div>

        <form onSubmit={handleSubmit}
          className="rounded-2xl p-8 lg:p-10 space-y-5 shadow-2xl shadow-black/40 border border-white/[0.06] relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f1830 0%, #0a1222 100%)" }}>
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Entrar no sistema</h2>
            <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.7)" }}>Autenticação básica com proteção por perfil</p>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground/80 uppercase tracking-[0.1em] mb-1.5 block">Usuário</label>
            <select
              value={selectedId}
              onChange={(event) => {
                const user = ativos.find((item) => item.id === event.target.value);
                setSelectedId(event.target.value);
                setMatricula(user?.matricula ?? "");
              }}
              className="frota-input-base w-full"
            >
              {ativos.map((user) => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground/80 uppercase tracking-[0.1em] mb-1.5 block">Matrícula</label>
            <input
              value={matricula}
              onChange={(event) => setMatricula(event.target.value)}
              className="frota-input-base w-full"
            />
          </div>

          {selected && (
            <div className="rounded-xl border p-4 transition-all duration-200 animate-frota-slide-up"
              style={{ borderColor: "rgba(41,121,255,0.25)", background: "rgba(41,121,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-primary/30"
                  style={{ background: "rgba(41,121,255,0.15)", boxShadow: "0 0 8px rgba(41,121,255,0.15)" }}>
                  <UserRound size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{selected.nome}</p>
                  <p className="text-xs text-muted-foreground/80">{ROLE_LABELS[selected.role]} · {selected.unidade}</p>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400 animate-frota-slide-up">{error}</p>}

          <button type="submit" className="frota-btn-primary w-full py-2.5 text-sm">
            Acessar sistema
          </button>
        </form>
      </div>
    </div>
  );
}
