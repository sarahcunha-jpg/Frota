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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ fontFamily: "Inter, sans-serif", background: "radial-gradient(ellipse 80% 80% at 50% -10%, rgba(37,117,245,0.12) 0%, transparent 60%), #080f1e" }}>
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-5 animate-frota-slide-up">
        <div className="rounded-2xl p-8 lg:p-10 shadow-2xl shadow-black/40" style={{ background: "rgba(15,26,46,0.85)", border: "1px solid rgba(148,163,184,0.11)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-4 mb-7">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2575f5 0%, #4f8dff 100%)", boxShadow: "0 8px 24px rgba(37,117,245,0.5)" }}>
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>GestãoFrota PMSC</h1>
              <p className="text-sm text-muted-foreground mt-0.5">MVP funcional da gestão da frota do 10º BPM de Blumenau</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-7">
            {[
              "Dashboard com indicadores operacionais",
              "Cadastro de viaturas com CRUD e visualização",
              "Plano preventivo com alertas por cor",
              "Ordens de serviço, histórico e relatórios",
            ].map((item, index) => (
              <div key={item}
                className="rounded-xl p-4 text-sm text-foreground animate-frota-slide-up"
                style={{ background: "rgba(37,117,245,0.06)", border: "1px solid rgba(37,117,245,0.14)", animationDelay: `${index * 0.07}s` }}>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 text-sm text-amber-200" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)" }}>
            Ambiente demonstrativo: selecione um perfil e entre usando a matrícula já exibida no cadastro do usuário.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 lg:p-10 space-y-5 shadow-2xl shadow-black/40" style={{ background: "rgba(15,26,46,0.85)", border: "1px solid rgba(148,163,184,0.11)", backdropFilter: "blur(12px)" }}>
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
              className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-200"
              style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(37,117,245,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,117,245,0.12)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)"; e.currentTarget.style.boxShadow = ""; }}
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
              className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-200"
              style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)", fontFamily: "DM Mono, monospace" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(37,117,245,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,117,245,0.12)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)"; e.currentTarget.style.boxShadow = ""; }}
            />
          </div>

          {selected && (
            <div className="rounded-xl p-4 transition-all duration-300 animate-frota-scale-in" style={{ background: "rgba(37,117,245,0.08)", border: "1px solid rgba(37,117,245,0.22)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(37,117,245,0.3), rgba(37,117,245,0.15))", border: "1px solid rgba(37,117,245,0.35)" }}>
                  <UserRound size={17} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{selected.nome}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_LABELS[selected.role]} · {selected.unidade}</p>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />{error}</p>}

          <button type="submit" className="w-full rounded-xl py-3 text-sm font-semibold text-white active:scale-[0.99] transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #2575f5 0%, #4f8dff 100%)", boxShadow: "0 4px 16px rgba(37,117,245,0.4)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(37,117,245,0.55)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(37,117,245,0.4)"; }}
          >
            Acessar sistema
          </button>
        </form>
      </div>
    </div>
  );
}
