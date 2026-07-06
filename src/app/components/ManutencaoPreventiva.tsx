import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Plus, X, Edit2 } from "lucide-react";
import { ManutencaoItem } from "../data/mockData";
import { useFleet } from "../context/FleetContext";
import { canManagePreventiva } from "../lib/permissions";
import { deriveMaintenanceStatus } from "../lib/fleet";

const STATUS_CONFIG = {
  ok: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "No prazo" },
  alerta: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Próximo do vencimento" },
  vencida: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Vencida" },
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
    setForm({ item: seedOptions[0].item, frequencia: seedOptions[0].frequencia, ultimaData: viatura?.ultimaRevisao ?? "", ultimoKm: String(viatura?.km ?? 0), proximaData: viatura?.proximaRevisao ?? "", proximoKm: String((viatura?.km ?? 0) + 10000) });
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
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Manutenção Preventiva</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Plano de revisões, agendamentos simples por data/KM e alertas visuais</p>
        </div>
        {canManage && (
          <button onClick={openNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={15} /> Novo item
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div>
          <label className="text-xs text-muted-foreground mr-2">Viatura:</label>
          <select value={selectedViatura} onChange={(event) => setSelectedViatura(event.target.value)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50">
            {viaturas.map((item) => <option key={item.id} value={item.id}>{item.numero} – {item.placa} {item.modelo}</option>)}
          </select>
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs ${config.bg} ${config.color}`}>
              <config.icon size={12} />
              <span>{config.label}</span>
              <span className="font-bold">{counts[key as keyof typeof counts]}</span>
            </div>
          ))}
        </div>
      </div>

      {viatura && (
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground">Viatura</p>
            <p className="font-semibold text-foreground">{viatura.numero} – {viatura.modelo}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Placa</p>
            <p className="font-semibold mono" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.placa}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">KM Atual</p>
            <p className="font-semibold mono" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.km.toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Próxima revisão</p>
            <p className="font-semibold mono" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.proximaRevisao || "—"}</p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Item de Manutenção", "Frequência", "Última Data", "Último KM", "Próxima Data", "Próximo KM", "Status", ""].map((header) => (
                <th key={header} className="text-left text-xs text-muted-foreground font-medium px-4 py-3 uppercase tracking-wider whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const config = STATUS_CONFIG[item.status];
              return (
                <tr key={item.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? "" : "bg-muted/10"}`}>
                  <td className="px-4 py-3 text-foreground font-medium">{item.item}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{item.frequencia}</td>
                  <td className="px-4 py-3 mono text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.ultimaData || "—"}</td>
                  <td className="px-4 py-3 mono text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.ultimoKm ? `${item.ultimoKm.toLocaleString("pt-BR")} km` : "—"}</td>
                  <td className="px-4 py-3 mono text-xs" style={{ fontFamily: "DM Mono, monospace", color: item.status === "vencida" ? "#f87171" : item.status === "alerta" ? "#fbbf24" : "#94a3b8" }}>{item.proximaData || "—"}</td>
                  <td className="px-4 py-3 mono text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.proximoKm ? `${item.proximoKm.toLocaleString("pt-BR")} km` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs border ${config.bg} ${config.color}`}>
                      <config.icon size={10} /> {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {canManage && (
                      <button onClick={() => openEdit(item)} className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
                        <Edit2 size={12} /> Editar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>{editing ? "Editar item preventivo" : "Novo item de manutenção"}</h2>
              <button onClick={() => setModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">item</label>
                <select value={`${form.item}|||${form.frequencia}`} onChange={(event) => {
                  const [item, frequencia] = event.target.value.split("|||");
                  setForm((current) => ({ ...current, item, frequencia }));
                }} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
                  {seedOptions.map((option) => <option key={option.item} value={`${option.item}|||${option.frequencia}`}>{option.item} — {option.frequencia}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">frequência</label>
                <input value={form.frequencia} onChange={(event) => setForm((current) => ({ ...current, frequencia: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
              </div>
              {[ ["Última Data", "ultimaData", "date"], ["Último KM", "ultimoKm", "number"], ["Próxima Data", "proximaData", "date"], ["Próximo KM", "proximoKm", "number"] ].map(([label, key, type]) => (
                <div key={String(key)}>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label>
                  <input type={type as string} value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModal(false)} className="px-4 py-2 rounded-md text-sm text-muted-foreground border border-border hover:border-foreground/20 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
