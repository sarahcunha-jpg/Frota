import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFleet } from "../context/FleetContext";
import { buildAvailabilitySeries, buildMaintenanceSeries, getKpis } from "../lib/fleet";

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="bg-popover border border-border rounded-md px-3 py-2 text-xs shadow-lg">
    <p className="text-muted-foreground mb-1">{label}</p>
    {payload.map((item: any) => <p key={item.name} style={{ color: item.color }}>{item.name}: <span className="text-foreground font-medium">{item.value}</span></p>)}
  </div>
) : null;

function KpiCard({ title, value, unit, formula, trend, desc, color }: { title: string; value: string; unit: string; formula: string; trend: "up" | "down" | "neutral"; desc: string; color: string; }) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground";
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{title}</p>
      <div className="flex items-end gap-2 mb-3"><span className="text-4xl font-bold mono" style={{ fontFamily: "DM Mono, monospace", color }}>{value}</span><span className="text-muted-foreground text-sm mb-1">{unit}</span><TrendIcon size={14} className={`${trendColor} mb-1.5 ml-auto`} /></div>
      <p className="text-xs text-muted-foreground mb-3">{desc}</p>
      <div className="bg-muted/30 rounded-md px-3 py-2"><p className="text-xs text-muted-foreground mono" style={{ fontFamily: "DM Mono, monospace" }}>{formula}</p></div>
    </div>
  );
}

export default function KPIs() {
  const { viaturas, ordensServico, historico } = useFleet();
  const kpis = getKpis(viaturas, ordensServico);
  const maintenanceSeries = buildMaintenanceSeries(historico);
  const availabilitySeries = buildAvailabilitySeries(viaturas).map((item) => ({ ...item, meta: 85 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Indicadores de Desempenho</h1>
        <p className="text-muted-foreground text-xs mt-0.5">KPIs operacionais calculados a partir das viaturas e das ordens de serviço</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Disponibilidade da Frota" value={String(kpis.disponibilidade)} unit="%" formula={`(${viaturas.filter((item) => item.status === "operação").length} ÷ ${viaturas.length || 1}) × 100`} trend={kpis.disponibilidade >= 85 ? "up" : "down"} desc={`${viaturas.filter((item) => item.status === "operação").length} de ${viaturas.length} viaturas disponíveis`} color="#1d6cf0" />
        <KpiCard title="MTTR — Tempo Médio de Reparo" value={kpis.mttr.toFixed(1)} unit="dias" formula="Σ tempo_reparo ÷ Nº reparos" trend="neutral" desc={`Baseado em ${kpis.finalizadas.length} OS finalizadas`} color="#f59e0b" />
        <KpiCard title="MTBF — Tempo Entre Falhas" value={kpis.mtbf ? kpis.mtbf.toLocaleString("pt-BR") : "—"} unit="h" formula="Horas de operação ÷ Nº falhas" trend="up" desc="Intervalo médio entre falhas corretivas" color="#10b981" />
        <KpiCard title="Custo por Viatura" value={`R$ ${Math.round(kpis.custoPorViatura).toLocaleString("pt-BR")}`} unit="" formula={`R$ ${kpis.custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ÷ ${viaturas.length || 1} viaturas`} trend={kpis.custoPorViatura < 3000 ? "up" : "down"} desc="Custo médio acumulado por viatura" color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-5" style={{ fontFamily: "Roboto Slab, serif" }}>Disponibilidade vs Meta (85%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={availabilitySeries}>
              <defs><linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1d6cf0" stopOpacity={0.2} /><stop offset="95%" stopColor="#1d6cf0" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="disponibilidade" name="Disponibilidade %" stroke="#1d6cf0" fill="url(#kpiGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="meta" name="Meta %" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-5" style={{ fontFamily: "Roboto Slab, serif" }}>Custo Mensal de Manutenção (R$)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={maintenanceSeries}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="custo" name="Custo R$" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "Roboto Slab, serif" }}>Resumo por Unidade</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">{["Unidade", "Total Viaturas", "Em Operação", "Em Manutenção", "Disponibilidade"].map((header) => <th key={header} className="text-left text-xs text-muted-foreground font-medium px-4 py-2 uppercase tracking-wider">{header}</th>)}</tr></thead>
            <tbody>
              {Array.from(new Set(viaturas.map((item) => item.unidade))).map((unidade) => {
                const list = viaturas.filter((item) => item.unidade === unidade);
                const operacao = list.filter((item) => item.status === "operação").length;
                const manutencao = list.filter((item) => item.status !== "operação").length;
                const disponibilidade = list.length > 0 ? Math.round((operacao / list.length) * 100) : 0;
                return (
                  <tr key={unidade} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-foreground text-xs">{unidade}</td>
                    <td className="px-4 py-3 mono text-center" style={{ fontFamily: "DM Mono, monospace" }}>{list.length}</td>
                    <td className="px-4 py-3 mono text-emerald-400 text-center" style={{ fontFamily: "DM Mono, monospace" }}>{operacao}</td>
                    <td className="px-4 py-3 mono text-amber-400 text-center" style={{ fontFamily: "DM Mono, monospace" }}>{manutencao}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 bg-muted rounded-full h-1.5"><div className="h-1.5 rounded-full transition-all" style={{ width: `${disponibilidade}%`, background: disponibilidade >= 85 ? "#10b981" : disponibilidade >= 70 ? "#f59e0b" : "#ef4444" }} /></div><span className="mono text-xs w-10" style={{ fontFamily: "DM Mono, monospace", color: disponibilidade >= 85 ? "#10b981" : "#f59e0b" }}>{disponibilidade}%</span></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
