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
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"><Plus size={15} /> Novo usuário</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
          const config = ROLE_CONFIG[role];
          return (
            <button key={role} onClick={() => setFilterRole((current) => current === role ? "todos" : role)} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${filterRole === role ? `${config.bg} border-opacity-100` : "border-border bg-card hover:border-border/80"}`}>
              <config.icon size={14} className={config.color} />
              <div><p className="text-muted-foreground text-xs">{config.label}</p><p className="font-bold mono text-xl" style={{ fontFamily: "DM Mono, monospace", color: filterRole === role ? config.color.replace("text-", "") : "#e2e8f0" }}>{counts[role]}</p></div>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map((user) => {
          const config = ROLE_CONFIG[user.role];
          return (
            <div key={user.id} className={`bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-border/80 transition-colors ${!user.ativo ? "opacity-50" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} border`}><config.icon size={15} className={config.color} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><span className="font-medium text-foreground text-sm truncate">{user.nome}</span><span className={`inline-flex px-2 py-0.5 rounded text-xs border ${config.bg} ${config.color} flex-shrink-0`}>{config.label}</span>{!user.ativo && <span className="text-xs text-red-400 flex-shrink-0">Inativo</span>}</div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap"><span className="mono text-xs text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{user.matricula}</span><span className="text-xs text-muted-foreground truncate">{user.email}</span><span className="text-xs text-muted-foreground">{user.unidade}</span></div>
              </div>
              <button onClick={() => toggleUser(user.id)} className={`px-3 py-1 rounded-md text-xs border transition-colors flex-shrink-0 ${user.ativo ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"}`}>{user.ativo ? "Desativar" : "Ativar"}</button>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4" style={{ fontFamily: "Roboto Slab, serif" }}>Permissões por Perfil</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border">{["Funcionalidade", "Administrador", "Gestor", "Mecânico", "Policial"].map((header) => <th key={header} className="text-left text-muted-foreground px-3 py-2 font-medium">{header}</th>)}</tr></thead>
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
                <tr key={label as string} className="border-b border-border/40 hover:bg-muted/20"><td className="px-3 py-2.5 text-foreground">{label as string}</td>{perms.map((perm, index) => <td key={index} className="px-3 py-2.5 text-center">{perm ? <span className="text-emerald-400">✓</span> : <span className="text-muted-foreground/40">—</span>}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Novo Usuário</h2><button onClick={() => setModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button></div>
            <div className="p-6 space-y-4">
              {[ ["nome completo", "nome", "text"], ["matrícula", "matricula", "text"], ["e-mail", "email", "email"] ].map(([label, key, type]) => (
                <div key={String(key)}><label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label><input type={type as string} value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" /></div>
              ))}
              <div><label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">perfil de acesso</label><select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserRole }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50">{(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => <option key={role} value={role}>{ROLE_CONFIG[role].label}</option>)}</select></div>
              <div><label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">unidade</label><select value={form.unidade} onChange={(event) => setForm((current) => ({ ...current, unidade: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50">{UNIDADES.map((unidade) => <option key={unidade} value={unidade}>{unidade}</option>)}</select></div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border"><button onClick={() => setModal(false)} className="px-4 py-2 rounded-md text-sm text-muted-foreground border border-border hover:border-foreground/20 transition-colors">Cancelar</button><button onClick={handleAdd} className="px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">Cadastrar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
