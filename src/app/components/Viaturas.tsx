import { useMemo, useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Eye } from "lucide-react";
import { Viatura, ViaturaStatus } from "../data/mockData";
import { useFleet } from "../context/FleetContext";
import { canManageViaturas } from "../lib/permissions";

const STATUS_COLORS: Record<ViaturaStatus, string> = {
  "operação": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "manutenção": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "indisponível": "bg-red-500/15 text-red-400 border-red-500/25",
};

const UNIDADES = ["10º BPM – Centro", "1ª CIPM – Garcia", "2ª CIPM – Velha", "3ª CIPM – Itoupava", "4ª CIPM – Ponta Aguda", "5ª CIPM – Fortaleza", "Comando BPTUR"];

interface FormData {
  numero: string;
  placa: string;
  modelo: string;
  ano: string;
  km: string;
  unidade: string;
  status: ViaturaStatus;
  ultimaRevisao: string;
  proximaRevisao: string;
}

const emptyForm: FormData = {
  numero: "",
  placa: "",
  modelo: "",
  ano: String(new Date().getFullYear()),
  km: "0",
  unidade: UNIDADES[0],
  status: "operação",
  ultimaRevisao: "",
  proximaRevisao: "",
};

export default function Viaturas() {
  const { viaturas, currentUser, addViatura, updateViatura, deleteViatura } = useFleet();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ViaturaStatus | "todos">("todos");
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<Viatura | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const canManage = currentUser ? canManageViaturas(currentUser.role) : false;

  const filtered = useMemo(() => viaturas.filter((viatura) => {
    const matchSearch = [viatura.numero, viatura.placa, viatura.modelo, viatura.unidade]
      .some((value) => value.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "todos" || viatura.status === filterStatus;
    return matchSearch && matchStatus;
  }), [filterStatus, search, viaturas]);

  function openAdd() {
    setForm(emptyForm);
    setSelected(null);
    setModal("add");
  }

  function openEdit(viatura: Viatura) {
    setForm({
      numero: viatura.numero,
      placa: viatura.placa,
      modelo: viatura.modelo,
      ano: String(viatura.ano),
      km: String(viatura.km),
      unidade: viatura.unidade,
      status: viatura.status,
      ultimaRevisao: viatura.ultimaRevisao,
      proximaRevisao: viatura.proximaRevisao,
    });
    setSelected(viatura);
    setModal("edit");
  }

  function handleSubmit() {
    if (!form.numero || !form.placa || !form.modelo) return;

    const payload = {
      numero: form.numero,
      placa: form.placa,
      modelo: form.modelo,
      ano: Number(form.ano),
      km: Number(form.km),
      unidade: form.unidade,
      status: form.status,
      ultimaRevisao: form.ultimaRevisao,
      proximaRevisao: form.proximaRevisao,
      x: selected?.x ?? 50,
      y: selected?.y ?? 40,
      velocidade: selected?.velocidade ?? 0,
      direcao: selected?.direcao ?? 0,
    };

    if (modal === "add") addViatura(payload);
    if (modal === "edit" && selected) updateViatura(selected.id, payload);
    setModal(null);
  }

  return (
    <div className="space-y-5 animate-frota-slide-up">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Cadastro de Viaturas</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{viaturas.length} viaturas cadastradas</p>
        </div>
        {canManage && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200">
            <Plus size={15} /> Criar viatura
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por número, placa ou modelo..." className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.1)] transition-all duration-200" />
        </div>
        {(["todos", "operação", "manutenção", "indisponível"] as const).map((status) => (
          <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-2 rounded-md text-xs font-medium border transition-all duration-200 capitalize ${filterStatus === status ? "bg-primary/20 border-primary/40 text-primary shadow-sm shadow-primary/10" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/30"}`}>
            {status === "todos" ? "Todos" : status}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden shadow-sm" style={{ background: "linear-gradient(180deg, #0f1a2e 0%, #0b1422 100%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ background: "rgba(45,120,245,0.04)" }}>
                {["Nº", "Placa", "Modelo", "Ano", "KM", "Unidade", "Status", "Próx. Revisão", "Ações"].map((header) => (
                  <th key={header} className="text-left text-xs text-muted-foreground font-semibold px-4 py-3 uppercase tracking-wider whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((viatura, index) => (
                <tr key={viatura.id} className={`border-b border-border/40 transition-all duration-150 hover:bg-primary/[0.06] ${index % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                  <td className="px-4 py-3 font-semibold text-foreground mono" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.numero}</td>
                  <td className="px-4 py-3 mono text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.placa}</td>
                  <td className="px-4 py-3 text-foreground">{viatura.modelo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{viatura.ano}</td>
                  <td className="px-4 py-3 mono text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.km.toLocaleString("pt-BR")} km</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{viatura.unidade}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs border capitalize ${STATUS_COLORS[viatura.status]}`}>{viatura.status}</span>
                  </td>
                  <td className="px-4 py-3 mono text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.proximaRevisao || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button onClick={() => { setSelected(viatura); setModal("view"); }} className="px-2 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/30 transition-all duration-150 inline-flex items-center gap-1">
                        <Eye size={12} /> Visualizar
                      </button>
                      {canManage && (
                        <>
                          <button onClick={() => openEdit(viatura)} className="px-2 py-1 rounded-md border border-primary/20 text-xs text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-150 inline-flex items-center gap-1">
                            <Edit2 size={12} /> Editar
                          </button>
                          <button onClick={() => deleteViatura(viatura.id)} className="px-2 py-1 rounded-md border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-150 inline-flex items-center gap-1">
                            <Trash2 size={12} /> Excluir
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma viatura encontrada.</div>}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="border border-border rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-frota-scale-in" style={{ background: "linear-gradient(135deg, #0f1a2e 0%, #0b1422 100%)", boxShadow: "0 32px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(45,120,245,0.10)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0" style={{ background: "linear-gradient(135deg, #0f1a2e 0%, #0b1422 100%)" }}>
              <h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>
                {modal === "add" ? "Criar viatura" : modal === "edit" ? "Editar viatura" : "Visualizar viatura"}
              </h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg p-1 transition-all duration-150"><X size={18} /></button>
            </div>

            {modal === "view" && selected ? (
              <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Número", selected.numero],
                  ["Placa", selected.placa],
                  ["Modelo", selected.modelo],
                  ["Ano", selected.ano],
                  ["Quilometragem", `${selected.km.toLocaleString("pt-BR")} km`],
                  ["Unidade", selected.unidade],
                  ["Status", selected.status],
                  ["Última revisão", selected.ultimaRevisao || "—"],
                  ["Próxima revisão", selected.proximaRevisao || "—"],
                ].map(([label, value]) => (
                  <div key={String(label)} className={label === "Unidade" ? "col-span-2" : ""}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-foreground font-medium">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {([ ["número", "numero", "text"], ["placa", "placa", "text"], ["modelo", "modelo", "text"], ["ano", "ano", "number"], ["quilometragem", "km", "number"] ] as const).map(([label, key, type]) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label>
                      <input type={type} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.1)] transition-all duration-200" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">status</label>
                    <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ViaturaStatus }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.1)] transition-all duration-200">
                      {["operação", "manutenção", "indisponível"].map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">unidade responsável</label>
                    <select value={form.unidade} onChange={(event) => setForm((current) => ({ ...current, unidade: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.1)] transition-all duration-200">
                      {UNIDADES.map((unidade) => <option key={unidade} value={unidade}>{unidade}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">última revisão</label>
                    <input type="date" value={form.ultimaRevisao} onChange={(event) => setForm((current) => ({ ...current, ultimaRevisao: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.1)] transition-all duration-200" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">próxima revisão</label>
                    <input type="date" value={form.proximaRevisao} onChange={(event) => setForm((current) => ({ ...current, proximaRevisao: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(29,108,240,0.1)] transition-all duration-200" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                  <button onClick={() => setModal(null)} className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 hover:bg-muted/20 transition-all duration-200">Cancelar</button>
                  <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 font-medium transition-all duration-200 active:scale-[0.98]">Salvar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
