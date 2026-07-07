import { useState } from "react";
import { Wrench, Shield, DollarSign, CalendarClock } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import { buildVehicleHistoryStats } from "../lib/fleet";

export default function Historico() {
  const { viaturas, historico, ordensServico } = useFleet();
  const [selectedId, setSelectedId] = useState(viaturas[0]?.id ?? "");
  const viatura = viaturas.find((item) => item.id === selectedId);

  if (!viatura) {
    return <div className="text-sm text-muted-foreground">Nenhuma viatura cadastrada.</div>;
  }

  const stats = buildVehicleHistoryStats(selectedId, historico, ordensServico);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Histórico de Manutenção</h1>
        <p className="text-muted-foreground text-xs mt-0.5">Registro completo por viatura, com custos e indisponibilidade</p>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mr-2">Selecionar Viatura:</label>
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="input-surface">
          {viaturas.map((item) => <option key={item.id} value={item.id}>{item.numero} – {item.placa} {item.modelo}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-2">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Viatura</p>
            <p className="font-bold text-foreground text-lg" style={{ fontFamily: "Roboto Slab, serif" }}>{viatura.numero}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Modelo</p>
            <p className="font-medium text-foreground">{viatura.modelo}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Placa</p>
            <p className="font-medium" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.placa}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">KM Atual</p>
            <p className="font-medium" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.km.toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Unidade</p>
            <p className="font-medium text-foreground text-xs">{viatura.unidade}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { icon: DollarSign, color: "#fbbf24", label: "Custo acumulado", value: `R$ ${stats.totalCusto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, glow: "rgba(251,191,36,0.3)" },
          { icon: Wrench, color: "#2575f5", label: "Total de serviços", value: String(stats.items.length), glow: "rgba(37,117,245,0.3)" },
          { icon: Shield, color: "#34d399", label: "Indisponibilidade", value: `${stats.totalParadaDias} dia(s)`, glow: "rgba(52,211,153,0.3)" },
          { icon: CalendarClock, color: "#a78bfa", label: "Peças substituídas", value: String(stats.pecas.length), glow: "rgba(167,139,250,0.3)" },
        ].map(({ icon: Icon, color, label, value, glow }) => (
          <div key={label} className="card" style={{ transition: 'box-shadow .15s' }}>
            <div className="flex items-center gap-2 mb-2"><Icon size={14} style={{ color }} /><span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">{label}</span></div>
            <p className="text-2xl font-bold" style={{ fontFamily: "DM Mono, monospace", color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-3">Revisões registradas</p>
        <div className="flex flex-wrap gap-2">
          {stats.revisoes.length > 0 ? stats.revisoes.map((date) => (
            <span key={date} className="text-xs px-2.5 py-1 rounded-lg" style={{ fontFamily: "DM Mono, monospace", background: "rgba(37,117,245,0.1)", border: "1px solid rgba(37,117,245,0.22)", color: "var(--muted)" }}>{date}</span>
          )) : <span className="text-sm text-muted-foreground">Nenhuma revisão preventiva registrada.</span>}
        </div>
      </div>

      {stats.items.length === 0 ? (
        <div className="card text-center py-16 text-muted-foreground text-sm">Nenhum histórico encontrado para essa viatura.</div>
      ) : (
        <div className="space-y-3">
          {stats.items.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-28 flex-shrink-0 text-right">
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.data}</p>
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.km.toLocaleString("pt-BR")} km</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`badge small`} style={{ background: item.tipo === "preventiva" ? 'rgba(31,111,255,0.08)' : 'rgba(245,158,11,0.08)', color: item.tipo === 'preventiva' ? 'var(--brand-700)' : 'var(--warning)' }}>{item.tipo === 'preventiva' ? 'Preventiva' : 'Corretiva'}</span>
                      <span className="text-xs text-muted-foreground">{item.responsavel}</span>
                    </div>
                    <span className="text-sm font-semibold" style={{ fontFamily: "DM Mono, monospace", color: item.tipo === 'preventiva' ? 'var(--brand-700)' : 'var(--warning)' }}>R$ {item.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-foreground font-medium mb-2">{item.servico}</p>
                  {item.pecas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.pecas.map((piece) => <span key={piece} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>{piece}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
