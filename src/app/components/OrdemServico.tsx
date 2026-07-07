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
          <button onClick={() => setModal("add")} className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium active:scale-[0.98] transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#2575f5,#4f8dff)", boxShadow: "0 4px 14px rgba(37,117,245,0.4)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(37,117,245,0.55)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(37,117,245,0.4)"; }}
          >
            <Plus size={15} /> {canManage ? "Abrir OS" : "Solicitar manutenção"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {([ ["aberta", FileText, "Abertas"], ["andamento", Clock, "Em Andamento"], ["finalizada", CheckSquare, "Finalizadas"] ] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setFilter((current) => current === key ? "todos" : key)}
            className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200"
            style={filter === key
              ? { background: "rgba(37,117,245,0.12)", border: "1px solid rgba(37,117,245,0.35)", boxShadow: "0 4px 16px rgba(37,117,245,0.15)" }
              : { background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }
            }
            onMouseEnter={(e) => { if (filter !== key) (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.22)"; }}
            onMouseLeave={(e) => { if (filter !== key) (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.11)"; }}
          >
            <Icon size={16} className={STATUS_CONFIG[key].color} />
            <div>
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "DM Mono, monospace", color: filter === key ? "#60a5fa" : "#e2e8f0" }}>{counts[key]}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((order) => {
          const config = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="rounded-xl p-4 cursor-pointer transition-all duration-200"
              style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.22)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.11)"; (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
              onClick={() => { setSelected(order); setModal("view"); }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5"><AlertCircle size={15} className={config.color} /></div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-foreground text-sm" style={{ fontFamily: "DM Mono, monospace" }}>{order.numero}</span>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs border ${config.bg} ${config.color}`}>{config.label}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-frota-scale-in" style={{ background: "#0f1a2e", border: "1px solid rgba(148,163,184,0.14)", borderRadius: "1rem" }}>
            <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: "1px solid rgba(148,163,184,0.1)", background: "#0f1a2e" }}>
              <h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>{canManage ? "Abrir ordem de serviço" : "Solicitar manutenção"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-all hover:bg-white/5"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "viatura", content: (
                  <select value={form.viaturaId} onChange={(event) => setForm((current) => ({ ...current, viaturaId: event.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                    style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }}>
                    {viaturas.map((viatura) => <option key={viatura.id} value={viatura.id}>{viatura.numero} – {viatura.placa} {viatura.modelo}</option>)}
                  </select>
                )},
                { label: "problema identificado", content: (
                  <textarea value={form.problema} onChange={(event) => setForm((current) => ({ ...current, problema: event.target.value }))} rows={2}
                    className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none resize-none"
                    style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }} />
                )},
                { label: "serviço executado", content: (
                  <textarea value={form.servico} onChange={(event) => setForm((current) => ({ ...current, servico: event.target.value }))} rows={2}
                    className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none resize-none"
                    style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }} />
                )},
              ].map(({ label, content }) => (
                <div key={label}>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">{label}</label>
                  {content}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">responsável</label>
                  <input value={form.responsavel} onChange={(event) => setForm((current) => ({ ...current, responsavel: event.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                    style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }} />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">custo estimado (R$)</label>
                  <input type="number" value={form.custo} onChange={(event) => setForm((current) => ({ ...current, custo: event.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                    style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">peças utilizadas</label>
                <input value={form.pecas} onChange={(event) => setForm((current) => ({ ...current, pecas: event.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                  style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }}
                  placeholder="Ex: Pastilhas de freio, fluido DOT4" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">tempo de parada (dias)</label>
                <input type="number" value={form.tempoParada} onChange={(event) => setForm((current) => ({ ...current, tempoParada: event.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                  style={{ background: "#162035", border: "1px solid rgba(148,163,184,0.15)" }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(148,163,184,0.1)" }}>
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-all"
                style={{ border: "1px solid rgba(148,163,184,0.15)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
              >Cancelar</button>
              <button onClick={handleAdd} className="px-4 py-2 rounded-lg text-sm text-white font-semibold transition-all"
                style={{ background: "linear-gradient(135deg,#2575f5,#4f8dff)", boxShadow: "0 4px 14px rgba(37,117,245,0.35)" }}>Enviar</button>
            </div>
          </div>
        </div>
      )}

      {modal === "view" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-xl shadow-2xl animate-frota-scale-in" style={{ background: "#0f1a2e", border: "1px solid rgba(148,163,184,0.14)", borderRadius: "1rem" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
              <div>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{selected.numero}</span>
                <span className={`ml-3 inline-flex px-2.5 py-0.5 rounded-full text-xs border ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color}`}>{STATUS_CONFIG[selected.status].label}</span>
              </div>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-all hover:bg-white/5"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[ ["Data", selected.data], ["Viatura", selected.viatura], ["Responsável", selected.responsavel], ["Tempo de parada", `${selected.tempoParada} dia(s)`], ["Custo", `R$ ${selected.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`] ].map(([key, value]) => (
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
            <div className="flex items-center gap-3 px-6 py-4 flex-wrap" style={{ borderTop: "1px solid rgba(148,163,184,0.1)" }}>
              <button onClick={() => printOrder(selected)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm px-3 py-1.5 rounded-lg transition-all"
                style={{ border: "1px solid rgba(148,163,184,0.15)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
              >
                <Printer size={14} /> Imprimir
              </button>
              <div className="ml-auto flex gap-2 flex-wrap">
                {selected.status === "aberta" && canFinalize && (
                  <button onClick={() => advanceOrder(selected.id)} className="px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.25)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.15)"; }}
                  >Iniciar atendimento</button>
                )}
                {selected.status !== "finalizada" && canFinalize && (
                  <button onClick={() => { finalizeOrder(selected.id); setModal(null); }} className="px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.25)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.15)"; }}
                  >Finalizar OS</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
