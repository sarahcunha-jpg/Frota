import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Plus, X, Edit2 } from "lucide-react";
import { ManutencaoItem } from "../data/mockData";
import { useFleet } from "../context/FleetContext";
import { canManagePreventiva } from "../lib/permissions";
import { deriveMaintenanceStatus } from "../lib/fleet";

const STATUS_CONFIG = {
  ok: { icon: CheckCircle, color: "var(--success)", bg: "rgba(24,178,107,0.08)", label: "No prazo" },
  alerta: { icon: AlertTriangle, color: "var(--warning)", bg: "rgba(255,176,32,0.08)", label: "Próximo do vencimento" },
  vencida: { icon: XCircle, color: "var(--danger)", bg: "rgba(255,77,79,0.08)", label: "Vencida" },
};

const seedOptions = [
  { item: "Troca de óleo", frequencia: "A cada 10.000 km" },
  { item: "Revisão dos freios", frequencia: "A cada 20.000 km" },
  { item: "Alinhamento e balanceamento", frequencia: "A cada 15.000 km" },
  { item: "Troca de pneus", frequencia: "Conforme desgaste" },
  { item: "Revisão elétrica", frequencia: "A cada 6 meses" },
  { item: "Revisão geral", frequencia: "Anual" },
];

export default function ManutencaoPreventiva() {
  const { manutencaoItens, viaturas, currentUser, saveMaintenanceItem } = useFleet();
  const [selectedViatura, setSelectedViatura] = useState(viaturas[0]?.id ?? "");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<ManutencaoItem | null>(null);
  const [form, setForm] = useState({ item: seedOptions[0].item, frequencia: seedOptions[0].frequencia, ultimaData: "", ultimoKm: "", proximaData: "", proximoKm: "" });

  const canManage = currentUser ? canManagePreventiva(currentUser.role) : false;
  const viatura = viaturas.find((item) => item.id === selectedViatura);

  const items = useMemo(() => manutencaoItens
    .filter((item) => !item.viaturaId || item.viaturaId === selectedViatura)
    .map((item) => ({ ...item, status: deriveMaintenanceStatus(item, viatura?.km) })), [manutencaoItens, selectedViatura, viatura?.km]);

  const counts = { ok: items.filter((item) => item.status === "ok").length, alerta: items.filter((item) => item.status === "alerta").length, vencida: items.filter((item) => item.status === "vencida").length };

  function openNew() {
    setEditing(null);
    setForm({ item: seedOptions[0].item, frequencia: seedOptions[0].frequencia, ultimaData: viatura?.ultimaRevisao ?? "", ultimoKm: String(viatura?.km ?? 0), proximaData: viatura?.proximaRevisao ?? "", proximoKm: String(viatura?.km ?? 0 + 10000) });
    setModal(true);
  }

  function openEdit(item: ManutencaoItem) {
    setEditing(item);
    setForm({ item: item.item, frequencia: item.frequencia, ultimaData: item.ultimaData, ultimoKm: String(item.ultimoKm || 0), proximaData: item.proximaData, proximoKm: String(item.proximoKm || 0) });
    setModal(true);
  }

  function handleSave() {
    if (!form.item || !form.frequencia) return;
    saveMaintenanceItem({
      id: editing?.id,
      viaturaId: selectedViatura,
      item: form.item,
      frequencia: form.frequencia,
      ultimaData: form.ultimaData,
      ultimoKm: Number(form.ultimoKm),
      proximaData: form.proximaData,
      proximoKm: Number(form.proximoKm),
    });
    setModal(false);
  }

  return (
    <div className="space-y-5 animate-frota-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Manutenção Preventiva</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Plano de revisões, agendamentos simples por data/KM e alertas visuais</p>
        </div>
        {canManage && (
          <button onClick={openNew} className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium btn-primary">
            <Plus size={15} /> Novo item
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div>
          <label className="text-xs text-muted-foreground mr-2">Viatura:</label>
          <select value={selectedViatura} onChange={(event) => setSelectedViatura(event.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm text-foreground outline-none input-surface">
            {viaturas.map((item) => <option key={item.id} value={item.id}>{item.numero} – {item.placa} {item.modelo}</option>)}
          </select>
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs" style={{ background: config.bg, color: config.color }}>
              <config.icon size={11} />
              <span>{config.label}</span>
              <span className="font-bold ml-0.5">{counts[key as keyof typeof counts]}</span>
            </div>
          ))}
        </div>
      </div>

      {viatura && (
        <div className="rounded-xl p-4 flex items-center gap-6 flex-wrap card">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Viatura</p>
            <p className="font-semibold text-foreground">{viatura.numero} – {viatura.modelo}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Placa</p>
            <p className="font-semibold" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.placa}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">KM Atual</p>
            <p className="font-semibold" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.km.toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Próxima revisão</p>
            <p className="font-semibold" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.proximaRevisao || "—"}</p>
          </div>
        </div>
      )}

      <div className="maintenance-list">
        {items.map((item) => {
          const status = deriveMaintenanceStatus(item, viatura?.km);
          const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          return (
            <div key={item.id} className="maintenance-card card flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{item.item}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.frequencia} · Próx: {item.proximaData || '—'} · {item.proximoKm ? `${item.proximoKm.toLocaleString('pt-BR')} km` : '—'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge" style={{ background: cfg.bg, color: cfg.color }}><cfg.icon size={11} /> <span className="ml-1">{cfg.label}</span></span>
                {canManage && <button onClick={() => openEdit(item)} className="btn-ghost">Editar</button>}
              </div>
            </div>
          );
        })}
        {items.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">Nenhum item de manutenção encontrado.</div>}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="w-full max-w-lg modal-panel">
            <div className="flex items-center justify-between px-6 py-4 modal-header">
              <h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>{editing ? "Editar item preventivo" : "Novo item de manutenção"}</h2>
              <button onClick={() => setModal(false)} className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-all duration-150 hover:bg-white/5"><X size={18} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">item</label>
                <select value={`${form.item}|||${form.frequencia}`} onChange={(event) => {
                  const [item, frequencia] = event.target.value.split("|||");
                  setForm((current) => ({ ...current, item, frequencia }));
                }} className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none input-surface">
                  {seedOptions.map((option) => <option key={option.item} value={`${option.item}|||${option.frequencia}`}>{option.item} — {option.frequencia}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">frequência</label>
                <input value={form.frequencia} onChange={(event) => setForm((current) => ({ ...current, frequencia: event.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none input-surface" />
              </div>
              {[ ["Última Data", "ultimaData", "date"], ["Último KM", "ultimoKm", "number"], ["Próxima Data", "proximaData", "date"], ["Próximo KM", "proximoKm", "number"] ].map(([label, key, type]) => (
                <div key={String(key)}>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">{label as string}</label>
                  <input type={type as string} value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-sm text-foreground outline-none input-surface" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 modal-actions">
              <button onClick={() => setModal(false)} className="btn-ghost">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
