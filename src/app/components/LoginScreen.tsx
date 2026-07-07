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
    <div className="min-h-screen bg-background flex items-center justify-center p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 animate-frota-fade-in">
        <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 shadow-xl shadow-black/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 transition-transform duration-300 hover:scale-105">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>GestãoFrota PMSC</h1>
              <p className="text-sm text-muted-foreground">MVP funcional da gestão da frota do 10º BPM de Blumenau</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              "Dashboard com indicadores operacionais",
              "Cadastro de viaturas com CRUD e visualização",
              "Plano preventivo com alertas por cor",
              "Ordens de serviço, histórico e relatórios",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground hover:border-primary/20 hover:bg-muted/35 hover:translate-y-[-2px] transition-all duration-200 cursor-default">{item}</div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200">
            Ambiente demonstrativo: selecione um perfil e entre usando a matrícula já exibida no cadastro do usuário.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 lg:p-10 space-y-5 shadow-xl shadow-black/20">
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
              className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.12)] transition-all duration-200"
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
              className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.12)] transition-all duration-200"
            />
          </div>

          {selected && (
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-sm shadow-primary/20">
                  <UserRound size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{selected.nome}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_LABELS[selected.role]} · {selected.unidade}</p>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] transition-all duration-200">
            Acessar sistema
          </button>
        </form>
      </div>
    </div>
  );
}
