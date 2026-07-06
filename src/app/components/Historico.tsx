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
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50">
          {viaturas.map((item) => <option key={item.id} value={item.id}>{item.numero} – {item.placa} {item.modelo}</option>)}
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Viatura</p>
            <p className="font-bold text-foreground text-lg" style={{ fontFamily: "Roboto Slab, serif" }}>{viatura.numero}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Modelo</p>
            <p className="font-medium text-foreground">{viatura.modelo}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Placa</p>
            <p className="font-medium mono" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.placa}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">KM Atual</p>
            <p className="font-medium mono" style={{ fontFamily: "DM Mono, monospace" }}>{viatura.km.toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Unidade</p>
            <p className="font-medium text-foreground text-xs">{viatura.unidade}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign size={14} className="text-amber-400" /><span className="text-xs text-muted-foreground uppercase tracking-wider">Custo acumulado</span></div>
          <p className="text-2xl font-bold mono" style={{ fontFamily: "DM Mono, monospace", color: "#fbbf24" }}>R$ {stats.totalCusto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1"><Wrench size={14} className="text-primary" /><span className="text-xs text-muted-foreground uppercase tracking-wider">Total de serviços</span></div>
          <p className="text-2xl font-bold mono" style={{ fontFamily: "DM Mono, monospace", color: "#1d6cf0" }}>{stats.items.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1"><Shield size={14} className="text-emerald-400" /><span className="text-xs text-muted-foreground uppercase tracking-wider">Indisponibilidade</span></div>
          <p className="text-2xl font-bold mono" style={{ fontFamily: "DM Mono, monospace", color: "#34d399" }}>{stats.totalParadaDias} dia(s)</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1"><CalendarClock size={14} className="text-violet-400" /><span className="text-xs text-muted-foreground uppercase tracking-wider">Peças substituídas</span></div>
          <p className="text-2xl font-bold mono" style={{ fontFamily: "DM Mono, monospace", color: "#a78bfa" }}>{stats.pecas.length}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Revisões registradas</p>
        <div className="flex flex-wrap gap-2">
          {stats.revisoes.length > 0 ? stats.revisoes.map((date) => (
            <span key={date} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md mono" style={{ fontFamily: "DM Mono, monospace" }}>{date}</span>
          )) : <span className="text-sm text-muted-foreground">Nenhuma revisão preventiva registrada.</span>}
        </div>
      </div>

      {stats.items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-lg">Nenhum histórico encontrado para esta viatura.</div>
      ) : (
        <div className="relative">
          <div className="absolute left-[120px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-0">
            {stats.items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-[104px] flex-shrink-0 pt-5 text-right">
                  <p className="mono text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.data}</p>
                  <p className="mono text-muted-foreground text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{item.km.toLocaleString("pt-BR")} km</p>
                </div>
                <div className="relative pt-4 pb-6 flex-1">
                  <div className={`absolute left-[-20px] top-5 w-3 h-3 rounded-full border-2 border-card z-10 ${item.tipo === "preventiva" ? "bg-primary" : "bg-amber-500"}`} />
                  <div className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs border capitalize ${item.tipo === "preventiva" ? "bg-primary/10 border-primary/20 text-primary" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}>{item.tipo}</span>
                        <span className="text-xs text-muted-foreground">{item.responsavel}</span>
                      </div>
                      <span className="mono text-sm font-medium text-amber-400" style={{ fontFamily: "DM Mono, monospace" }}>R$ {item.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <p className="text-foreground font-medium text-sm mb-2">{item.servico}</p>
                    {item.pecas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.pecas.map((piece) => <span key={piece} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded">{piece}</span>)}
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
