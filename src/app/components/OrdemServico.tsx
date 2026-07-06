import { useMemo, useState } from "react";
import { Plus, X, FileText, CheckSquare, Clock, AlertCircle, Printer } from "lucide-react";
import { OrdemServico as OS, OSStatus } from "../data/mockData";
import { useFleet } from "../context/FleetContext";
import { canFinalizeOrders, canManageOrders, canOpenMaintenanceRequest } from "../lib/permissions";
import { openPrintableWindow } from "../lib/fleet";

const STATUS_CONFIG: Record<OSStatus, { label: string; color: string; bg: string }> = {
  aberta: { label: "Aberta", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
  andamento: { label: "Em Andamento", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  finalizada: { label: "Finalizada", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
};

export default function OrdemServico() {
  const { ordensServico, viaturas, currentUser, addOrder, advanceOrder, finalizeOrder } = useFleet();
  const [filter, setFilter] = useState<OSStatus | "todos">("todos");
  const [modal, setModal] = useState<"add" | "view" | null>(null);
  const [selected, setSelected] = useState<OS | null>(null);
  const [form, setForm] = useState({ viaturaId: viaturas[0]?.id ?? "", problema: "", servico: "", responsavel: currentUser?.nome ?? "", pecas: "", custo: "", tempoParada: "" });

  const canOpen = currentUser ? canOpenMaintenanceRequest(currentUser.role) : false;
  const canManage = currentUser ? canManageOrders(currentUser.role) : false;
  const canFinalize = currentUser ? canFinalizeOrders(currentUser.role) : false;

  const filtered = useMemo(() => filter === "todos" ? ordensServico : ordensServico.filter((order) => order.status === filter), [filter, ordensServico]);
  const counts = { aberta: ordensServico.filter((item) => item.status === "aberta").length, andamento: ordensServico.filter((item) => item.status === "andamento").length, finalizada: ordensServico.filter((item) => item.status === "finalizada").length };

  function handleAdd() {
    if (!form.problema || !form.servico || !form.viaturaId) return;
    addOrder({
      viaturaId: form.viaturaId,
      problema: form.problema,
      servico: form.servico,
      responsavel: form.responsavel,
      pecas: form.pecas,
      custo: Number(form.custo),
      tempoParada: Number(form.tempoParada),
    });
    setModal(null);
    setForm({ viaturaId: viaturas[0]?.id ?? "", problema: "", servico: "", responsavel: currentUser?.nome ?? "", pecas: "", custo: "", tempoParada: "" });
  }

  function printOrder(order: OS) {
    openPrintableWindow(order.numero, `
      <h1>${order.numero}</h1>
      <p>Data: ${order.data} · Status: ${STATUS_CONFIG[order.status].label}</p>
      <p><strong>Viatura:</strong> ${order.viatura}</p>
      <p><strong>Problema identificado:</strong> ${order.problema}</p>
      <p><strong>Serviço executado:</strong> ${order.servico}</p>
      <p><strong>Responsável:</strong> ${order.responsavel}</p>
      <p><strong>Peças utilizadas:</strong> ${order.pecas || "—"}</p>
      <p><strong>Custo:</strong> R$ ${order.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      <p><strong>Tempo de parada:</strong> ${order.tempoParada} dia(s)</p>
    `);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Ordens de Serviço</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{ordensServico.length} ordens no total</p>
        </div>
        {canOpen && (
          <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={15} /> {canManage ? "Abrir OS" : "Solicitar manutenção"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {([ ["aberta", FileText, "Abertas"], ["andamento", Clock, "Em Andamento"], ["finalizada", CheckSquare, "Finalizadas"] ] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setFilter((current) => current === key ? "todos" : key)} className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-left ${filter === key ? "border-primary/40 bg-primary/10" : "border-border bg-card hover:border-border/80"}`}>
            <Icon size={16} className={STATUS_CONFIG[key].color} />
            <div>
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="text-2xl font-bold mono" style={{ fontFamily: "DM Mono, monospace", color: filter === key ? "#1d6cf0" : "#e2e8f0" }}>{counts[key]}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((order) => {
          const config = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors cursor-pointer" onClick={() => { setSelected(order); setModal("view"); }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5"><AlertCircle size={15} className={config.color} /></div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold mono text-foreground text-sm" style={{ fontFamily: "DM Mono, monospace" }}>{order.numero}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs border ${config.bg} ${config.color}`}>{config.label}</span>
                    </div>
                    <p className="text-foreground text-sm mb-0.5">{order.viatura}</p>
                    <p className="text-muted-foreground text-xs">{order.problema}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="mono text-foreground font-medium" style={{ fontFamily: "DM Mono, monospace" }}>R$ {order.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  <p className="text-muted-foreground text-xs">{order.data}</p>
                  <p className="text-muted-foreground text-xs">{order.responsavel}</p>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma ordem encontrada.</div>}
      </div>

      {modal === "add" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
              <h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>{canManage ? "Abrir ordem de serviço" : "Solicitar manutenção"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">viatura</label>
                <select value={form.viaturaId} onChange={(event) => setForm((current) => ({ ...current, viaturaId: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50">
                  {viaturas.map((viatura) => <option key={viatura.id} value={viatura.id}>{viatura.numero} – {viatura.placa} {viatura.modelo}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">problema identificado</label>
                <textarea value={form.problema} onChange={(event) => setForm((current) => ({ ...current, problema: event.target.value }))} rows={2} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">serviço executado</label>
                <textarea value={form.servico} onChange={(event) => setForm((current) => ({ ...current, servico: event.target.value }))} rows={2} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">responsável</label>
                  <input value={form.responsavel} onChange={(event) => setForm((current) => ({ ...current, responsavel: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">custo estimado (R$)</label>
                  <input type="number" value={form.custo} onChange={(event) => setForm((current) => ({ ...current, custo: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">peças utilizadas</label>
                <input value={form.pecas} onChange={(event) => setForm((current) => ({ ...current, pecas: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" placeholder="Ex: Pastilhas de freio, fluido DOT4" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">tempo de parada (dias)</label>
                <input type="number" value={form.tempoParada} onChange={(event) => setForm((current) => ({ ...current, tempoParada: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-md text-sm text-muted-foreground border border-border hover:border-foreground/20 transition-colors">Cancelar</button>
              <button onClick={handleAdd} className="px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">Enviar</button>
            </div>
          </div>
        </div>
      )}

      {modal === "view" && selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <span className="font-bold text-foreground mono" style={{ fontFamily: "DM Mono, monospace" }}>{selected.numero}</span>
                <span className={`ml-3 inline-flex px-2 py-0.5 rounded text-xs border ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color}`}>{STATUS_CONFIG[selected.status].label}</span>
              </div>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[ ["Data", selected.data], ["Viatura", selected.viatura], ["Responsável", selected.responsavel], ["Tempo de parada", `${selected.tempoParada} dia(s)`], ["Custo", `R$ ${selected.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`] ].map(([key, value]) => (
                  <div key={String(key)} className={key === "Viatura" ? "col-span-2" : ""}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{key}</p>
                    <p className="text-foreground font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Problema identificado</p>
                <p className="text-foreground text-sm bg-muted/30 rounded-md p-3">{selected.problema}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Serviço executado</p>
                <p className="text-foreground text-sm bg-muted/30 rounded-md p-3">{selected.servico}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Peças utilizadas</p>
                <p className="text-foreground text-sm bg-muted/30 rounded-md p-3">{selected.pecas || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-border flex-wrap">
              <button onClick={() => printOrder(selected)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm border border-border px-3 py-1.5 rounded-md transition-colors">
                <Printer size={14} /> Imprimir
              </button>
              <div className="ml-auto flex gap-2 flex-wrap">
                {selected.status === "aberta" && canFinalize && (
                  <button onClick={() => advanceOrder(selected.id)} className="px-3 py-1.5 rounded-md text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">Iniciar atendimento</button>
                )}
                {selected.status !== "finalizada" && canFinalize && (
                  <button onClick={() => { finalizeOrder(selected.id); setModal(null); }} className="px-3 py-1.5 rounded-md text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">Finalizar OS</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
