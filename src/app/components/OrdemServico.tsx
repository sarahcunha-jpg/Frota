import { useMemo, useState } from "react";
import { Plus, X, FileText, CheckSquare, Clock, AlertCircle, Printer } from "lucide-react";
import { OrdemServico as OS, OSStatus } from "../data/mockData";
import { useFleet } from "../context/FleetContext";
import { canFinalizeOrders, canManageOrders, canOpenMaintenanceRequest } from "../lib/permissions";
import { openPrintableWindow } from "../lib/fleet";

const STATUS_CONFIG: Record<OSStatus, { label: string; color: string; bg: string }> = {
  aberta: { label: "Aberta", color: "var(--brand-500)", bg: "rgba(31,111,255,0.08)" },
  andamento: { label: "Em Andamento", color: "var(--warning)", bg: "rgba(255,176,32,0.08)" },
  finalizada: { label: "Finalizada", color: "var(--success)", bg: "rgba(24,178,107,0.08)" },
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
    openPrintableWindow(order.numero, {
      subtitle: `Data: ${order.data} · Status: ${STATUS_CONFIG[order.status].label}`,
      paragraphs: [
        ["Viatura", order.viatura],
        ["Problema identificado", order.problema],
        ["Serviço executado", order.servico],
        ["Responsável", order.responsavel],
        ["Peças utilizadas", order.pecas || "—"],
        ["Custo", `R$ ${order.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
        ["Tempo de parada", `${order.tempoParada} dia(s)`],
      ],
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Ordens de Serviço</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{ordensServico.length} ordens no total</p>
        </div>
        {canOpen && (
          <button onClick={() => setModal("add")} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> {canManage ? "Abrir OS" : "Solicitar manutenção"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {([ ["aberta", FileText, "Abertas"], ["andamento", Clock, "Em Andamento"], ["finalizada", CheckSquare, "Finalizadas"] ] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setFilter((current) => current === key ? "todos" : key)} className={`report-card ${filter === key ? 'report-card-active' : ''}`}>
            <Icon size={16} className={"text-muted"} />
            <div>
              <p className="text-muted text-xs">{label}</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "DM Mono, monospace", color: filter === key ? 'var(--brand-700)' : 'var(--muted)' }}>{counts[key as keyof typeof counts]}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((order) => {
          const config = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="card cursor-pointer" onClick={() => { setSelected(order); setModal("view"); }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5"><AlertCircle size={15} style={{ color: config.color }} /></div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-foreground text-sm" style={{ fontFamily: "DM Mono, monospace" }}>{order.numero}</span>
                      <span className="badge small" style={{ background: config.bg, color: config.color }}>{config.label}</span>
                    </div>
                    <p className="text-foreground text-sm mb-0.5">{order.viatura}</p>
                    <p className="text-muted-foreground text-xs">{order.problema}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-foreground font-semibold" style={{ fontFamily: "DM Mono, monospace" }}>R$ {order.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
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
        <div className="modal-overlay">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>{canManage ? "Abrir ordem de serviço" : "Solicitar manutenção"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-all hover:bg-white/5"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "viatura", content: (
                  <select value={form.viaturaId} onChange={(event) => setForm((current) => ({ ...current, viaturaId: event.target.value }))} className="input-surface w-full">
                    {viaturas.map((viatura) => <option key={viatura.id} value={viatura.id}>{viatura.numero} – {viatura.placa} {viatura.modelo}</option>)}
                  </select>
                )},
                { label: "problema identificado", content: (
                  <textarea value={form.problema} onChange={(event) => setForm((current) => ({ ...current, problema: event.target.value }))} rows={2} className="input-surface w-full resize-none" />
                )},
                { label: "serviço executado", content: (
                  <textarea value={form.servico} onChange={(event) => setForm((current) => ({ ...current, servico: event.target.value }))} rows={2} className="input-surface w-full resize-none" />
                )},
              ].map(({ label, content }) => (
                <div key={label as string}>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">{label}</label>
                  {content}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">responsável</label>
                  <input value={form.responsavel} onChange={(event) => setForm((current) => ({ ...current, responsavel: event.target.value }))} className="input-surface w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">custo estimado (R$)</label>
                  <input type="number" value={form.custo} onChange={(event) => setForm((current) => ({ ...current, custo: event.target.value }))} className="input-surface w-full" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">peças utilizadas</label>
                <input value={form.pecas} onChange={(event) => setForm((current) => ({ ...current, pecas: event.target.value }))} className="input-surface w-full" placeholder="Ex: Pastilhas de freio, fluido DOT4" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">tempo de parada (dias)</label>
                <input type="number" value={form.tempoParada} onChange={(event) => setForm((current) => ({ ...current, tempoParada: event.target.value }))} className="input-surface w-full" />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setModal(null)} className="btn-ghost">Cancelar</button>
              <button onClick={handleAdd} className="btn-primary">Enviar</button>
            </div>
          </div>
        </div>
      )}

      {modal === "view" && selected && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <div className="modal-header">
              <div>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{selected.numero}</span>
                <span className="ml-3 badge small" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>{STATUS_CONFIG[selected.status].label}</span>
              </div>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-all hover:bg-white/5"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[["Data", selected.data], ["Viatura", selected.viatura], ["Responsável", selected.responsavel], ["Tempo de parada", `${selected.tempoParada} dia(s)`], ["Custo", `R$ ${selected.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]].map(([key, value]: any) => (
                  <div key={String(key)} className={key === "Viatura" ? "col-span-2" : ""}>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-0.5">{key}</p>
                    <p className="text-foreground font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {[["Problema identificado", selected.problema], ["Serviço executado", selected.servico], ["Peças utilizadas", selected.pecas || "—"]].map(([label, content]) => (
                <div key={label as string}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1">{label}</p>
                  <p className="text-foreground text-sm rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(148,163,184,0.08)" }}>{content}</p>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => printOrder(selected)} className="btn-ghost"><Printer size={14} /> Imprimir</button>
              <div className="ml-auto flex gap-2 flex-wrap">
                {selected.status === "aberta" && canFinalize && (<button onClick={() => advanceOrder(selected.id)} className="btn-ghost" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>Iniciar atendimento</button>)}
                {selected.status !== "finalizada" && canFinalize && (<button onClick={() => { finalizeOrder(selected.id); setModal(null); }} className="btn-primary">Finalizar OS</button>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
