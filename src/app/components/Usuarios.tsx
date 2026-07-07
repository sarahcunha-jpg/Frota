import { useMemo, useState } from "react";
import { Plus, X, Shield, Wrench, User, Star } from "lucide-react";
import { UserRole } from "../data/mockData";
import { useFleet } from "../context/FleetContext";

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; icon: typeof Shield }> = {
  administrador: { label: "Administrador", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", icon: Star },
  gestor: { label: "Gestor", color: "text-primary", bg: "bg-primary/10 border-primary/20", icon: Shield },
  mecanico: { label: "Mecânico", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Wrench },
  policial: { label: "Policial", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: User },
};

const UNIDADES = ["Comando 10º BPM", "10º BPM – Centro", "1ª CIPM – Garcia", "2ª CIPM – Velha", "3ª CIPM – Itoupava", "4ª CIPM – Ponta Aguda", "5ª CIPM – Fortaleza", "Comando BPTUR", "Oficina Central"];

export default function Usuarios() {
  const { usuarios, addUser, toggleUser } = useFleet();
  const [filterRole, setFilterRole] = useState<UserRole | "todos">("todos");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: "", matricula: "", email: "", role: "policial" as UserRole, unidade: UNIDADES[0] });

  const filtered = useMemo(() => filterRole === "todos" ? usuarios : usuarios.filter((user) => user.role === filterRole), [filterRole, usuarios]);
  const counts = Object.fromEntries((Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => [role, usuarios.filter((user) => user.role === role).length]));

  function handleAdd() {
    if (!form.nome || !form.matricula || !form.email) return;
    addUser(form);
    setModal(false);
    setForm({ nome: "", matricula: "", email: "", role: "policial", unidade: UNIDADES[0] });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Controle de Acesso</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{usuarios.length} usuários cadastrados · {usuarios.filter((user) => user.ativo).length} ativos</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium active:scale-[0.98] transition-all"
          style={{ background: "linear-gradient(135deg,#2575f5,#4f8dff)", boxShadow: "0 4px 14px rgba(37,117,245,0.4)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(37,117,245,0.55)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(37,117,245,0.4)"; }}
        ><Plus size={15} /> Novo usuário</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
          const config = ROLE_CONFIG[role];
          return (
            <button key={role} onClick={() => setFilterRole((current) => current === role ? "todos" : role)}
              className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
              style={filterRole === role
                ? { background: "rgba(37,117,245,0.12)", border: "1px solid rgba(37,117,245,0.35)", boxShadow: "0 4px 14px rgba(37,117,245,0.15)" }
                : { background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }
              }
            >
              <config.icon size={14} className={config.color} />
              <div>
                <p className="text-muted-foreground text-xs">{config.label}</p>
                <p className="font-bold text-xl" style={{ fontFamily: "DM Mono, monospace", color: filterRole === role ? "#60a5fa" : "#e2e8f0" }}>{counts[role]}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map((user) => {
          const config = ROLE_CONFIG[user.role];
          return (
            <div key={user.id} className={`rounded-xl p-4 flex items-center gap-4 transition-all duration-200 ${!user.ativo ? "opacity-50" : ""}`}
              style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.22)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.11)"; }}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} border`}><config.icon size={15} className={config.color} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-foreground text-sm truncate">{user.nome}</span><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs border ${config.bg} ${config.color} flex-shrink-0`}>{config.label}</span>{!user.ativo && <span className="text-xs text-red-400 flex-shrink-0">Inativo</span>}</div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap"><span className="text-xs text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{user.matricula}</span><span className="text-xs text-muted-foreground truncate">{user.email}</span><span className="text-xs text-muted-foreground">{user.unidade}</span></div>
              </div>
              <button onClick={() => toggleUser(user.id)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all flex-shrink-0 ${user.ativo ? "text-red-400" : "text-emerald-400"}`}
                style={user.ativo ? { border: "1px solid rgba(239,68,68,0.3)" } : { border: "1px solid rgba(16,185,129,0.3)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = user.ativo ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
              >{user.ativo ? "Desativar" : "Ativar"}</button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-5" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}>
        <h3 className="font-semibold text-foreground text-sm mb-4" style={{ fontFamily: "Roboto Slab, serif" }}>Permissões por Perfil</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(148,163,184,0.09)" }}>
                {["Funcionalidade", "Administrador", "Gestor", "Mecânico", "Policial"].map((header) => (
                  <th key={header} className="text-left text-muted-foreground px-3 py-2 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Cadastro de Viaturas", true, false, false, false],
                ["Aprovação e relatórios", true, true, false, false],
                ["Ordens de Serviço", true, true, true, true],
                ["Finalizar OS", true, true, true, false],
                ["Visualizar Rastreamento", true, true, false, false],
                ["Consultar Histórico", true, true, true, true],
                ["Gestão de Usuários", true, false, false, false],
              ].map(([label, ...perms]) => (
                <tr key={label as string} className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(148,163,184,0.06)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                >
                  <td className="px-3 py-2.5 text-foreground">{label as string}</td>
                  {perms.map((perm, index) => (
                    <td key={index} className="px-3 py-2.5 text-center">
                      {perm ? <span className="text-emerald-400 font-semibold">✓</span> : <span className="text-muted-foreground/40">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md shadow-2xl animate-frota-scale-in" style={{ background: "#0f1a2e", border: "1px solid rgba(148,163,184,0.14)", borderRadius: "1rem" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
              <h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Novo Usuário</h2>
              <button onClick={() => setModal(false)} className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-white/5 transition-all"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[ ["nome completo", "nome", "text"], ["matrícula", "matricula", "text"], ["e-mail", "email", "email"] ].map(([label, key, type]) => (
                <div key={String(key)}>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">{label}</label>
                  <input type={type as string} value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                    style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }} />
                </div>
              ))}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">perfil de acesso</label>
                <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserRole }))}
                  className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                  style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }}>
                  {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => <option key={role} value={role}>{ROLE_CONFIG[role].label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">unidade</label>
                <select value={form.unidade} onChange={(event) => setForm((current) => ({ ...current, unidade: event.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                  style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }}>
                  {UNIDADES.map((unidade) => <option key={unidade} value={unidade}>{unidade}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(148,163,184,0.1)" }}>
              <button onClick={() => setModal(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-all"
                style={{ border: "1px solid rgba(148,163,184,0.15)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
              >Cancelar</button>
              <button onClick={handleAdd} className="px-4 py-2 rounded-lg text-sm text-white font-semibold transition-all"
                style={{ background: "linear-gradient(135deg,#2575f5,#4f8dff)", boxShadow: "0 4px 14px rgba(37,117,245,0.35)" }}>Cadastrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
