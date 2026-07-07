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
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm text-foreground outline-none transition-all duration-200"
          style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.15)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(37,117,245,0.5)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)"; }}
        >
          {viaturas.map((item) => <option key={item.id} value={item.id}>{item.numero} – {item.placa} {item.modelo}</option>)}
        </select>
      </div>

      <div className="rounded-xl p-5" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}>
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
          <div key={label} className="rounded-xl p-4 transition-all duration-200"
            style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${glow}`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            <div className="flex items-center gap-2 mb-2"><Icon size={14} style={{ color }} /><span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">{label}</span></div>
            <p className="text-2xl font-bold" style={{ fontFamily: "DM Mono, monospace", color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-3">Revisões registradas</p>
        <div className="flex flex-wrap gap-2">
          {stats.revisoes.length > 0 ? stats.revisoes.map((date) => (
            <span key={date} className="text-xs px-2.5 py-1 rounded-lg" style={{ fontFamily: "DM Mono, monospace", background: "rgba(37,117,245,0.1)", border: "1px solid rgba(37,117,245,0.22)", color: "#60a5fa" }}>{date}</span>
          )) : <span className="text-sm text-muted-foreground">Nenhuma revisão preventiva registrada.</span>}
        </div>
      </div>

      {stats.items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm rounded-xl" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}>Nenhum histórico encontrado para esta viatura.</div>
      ) : (
        <div className="relative">
          <div className="absolute left-[120px] top-0 bottom-0 w-px" style={{ background: "rgba(148,163,184,0.1)" }} />
          <div className="space-y-0">
            {stats.items.map((item) => (
              <div key={item.id} className="flex gap-6 group animate-frota-slide-up">
                <div className="w-[104px] flex-shrink-0 pt-5 text-right">
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.data}</p>
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.km.toLocaleString("pt-BR")} km</p>
                </div>
                <div className="relative pt-4 pb-6 flex-1">
                  <div className={`absolute left-[-20px] top-5 w-3 h-3 rounded-full border-2 z-10 ${item.tipo === "preventiva" ? "border-primary bg-primary" : "border-amber-500 bg-amber-500"}`}
                    style={{ boxShadow: item.tipo === "preventiva" ? "0 0 8px rgba(37,117,245,0.7)" : "0 0 8px rgba(245,158,11,0.7)" }} />
                  <div className="rounded-xl p-4 transition-all duration-200"
                    style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.11)"; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
                  >
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs border capitalize ${item.tipo === "preventiva" ? "bg-primary/10 border-primary/25 text-primary" : "bg-amber-500/10 border-amber-500/25 text-amber-400"}`}>{item.tipo}</span>
                        <span className="text-xs text-muted-foreground">{item.responsavel}</span>
                      </div>
                      <span className="text-sm font-semibold text-amber-400" style={{ fontFamily: "DM Mono, monospace" }}>R$ {item.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <p className="text-foreground font-medium text-sm mb-2">{item.servico}</p>
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
        </div>
      )}
    </div>
  );
}
