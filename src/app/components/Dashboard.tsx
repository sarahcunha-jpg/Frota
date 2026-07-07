import { AlertTriangle, Car, CheckCircle, Clock, TrendingUp, Wrench } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFleet } from "../context/FleetContext";
import { buildAvailabilitySeries, buildMaintenanceSeries, getFleetStats, getKpis } from "../lib/fleet";

const COLORS = ["#2575f5", "#10b981", "#ef4444"];

function StatCard({ label, value, sub, icon: Icon, color, glowColor }: { label: string; value: string | number; sub: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; glowColor: string; }) {
  return (
    <div className="rounded-xl p-5 flex items-start gap-4 cursor-default group transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(148,163,184,0.16), 0 4px 20px ${glowColor}`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"; }}
    >
      <div className="p-2.5 rounded-lg flex-shrink-0" style={{ background: color, boxShadow: `0 4px 14px ${glowColor}` }}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="text-muted-foreground text-[10px] uppercase tracking-[0.1em] mb-1">{label}</p>
        <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{value}</p>
        <p className="text-muted-foreground text-xs mt-1">{sub}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="bg-popover border border-border rounded-md px-3 py-2 text-xs shadow-lg">
    <p className="text-muted-foreground mb-1">{label}</p>
    {payload.map((item: any) => <p key={item.name} style={{ color: item.color }}>{item.name}: <span className="text-foreground font-medium">{item.value}</span></p>)}
  </div>
) : null;

export default function Dashboard() {
  const { viaturas, ordensServico, manutencaoItens, historico } = useFleet();
  const stats = getFleetStats(viaturas, ordensServico, manutencaoItens);
  const kpis = getKpis(viaturas, ordensServico);
  const pieData = [
    { name: "Em Operação", value: stats.emOperacao },
    { name: "Em Manutenção", value: stats.emManutencao },
    { name: "Indisponível", value: stats.indisponiveis },
  ];
  const maintenanceSeries = buildMaintenanceSeries(historico);
  const availabilitySeries = buildAvailabilitySeries(viaturas);

  return (
    <div className="space-y-6 animate-frota-slide-up">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Dashboard</h1>
        <p className="text-muted-foreground text-xs mt-0.5">Visão geral da frota — 10º BPM Blumenau</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total de Viaturas" value={stats.total} sub="unidades cadastradas" icon={Car} color="linear-gradient(135deg,#2575f5,#4f8dff)" glowColor="rgba(37,117,245,0.35)" />
        <StatCard label="Em Operação" value={stats.emOperacao} sub={`${stats.total ? Math.round((stats.emOperacao / stats.total) * 100) : 0}% da frota ativa`} icon={CheckCircle} color="linear-gradient(135deg,#059669,#10b981)" glowColor="rgba(16,185,129,0.35)" />
        <StatCard label="Em Manutenção" value={stats.emManutencao + stats.indisponiveis} sub={`${stats.ordensAbertas} ordens abertas`} icon={Wrench} color="linear-gradient(135deg,#d97706,#f59e0b)" glowColor="rgba(245,158,11,0.35)" />
        <StatCard label="Próx. Revisões" value={stats.proximasRevisoes} sub="nos próximos 30 dias" icon={Clock} color="linear-gradient(135deg,#7c3aed,#8b5cf6)" glowColor="rgba(139,92,246,0.35)" />
        <StatCard label="Disponibilidade" value={`${kpis.disponibilidade}%`} sub="KPI calculado automaticamente" icon={TrendingUp} color="linear-gradient(135deg,#0284c7,#38bdf8)" glowColor="rgba(56,189,248,0.35)" />
      </div>

      {(stats.manutencoesVencidas.length > 0 || stats.manutencoesAlerta.length > 0) && (
        <div className="rounded-xl p-4 animate-frota-slide-up" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.22)" }}>
          <div className="flex items-center gap-2 mb-3"><AlertTriangle size={15} className="text-amber-400" /><span className="text-amber-400 font-semibold text-sm">Alertas de manutenção vencida</span></div>
          <div className="space-y-1.5">
            {stats.manutencoesVencidas.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /><span className="text-foreground">{item.item}</span><span className="text-red-400 ml-auto">Vencida em {item.proximaData || "data não informada"}</span></div>
            ))}
            {stats.manutencoesAlerta.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" /><span className="text-foreground">{item.item}</span><span className="text-amber-400 ml-auto">Vence em {item.proximaData || "data não informada"}</span></div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl p-5 transition-all duration-200" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
        >
          <div className="flex items-center justify-between mb-5"><h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Manutenções por mês</h3><span className="text-xs text-muted-foreground">Histórico consolidado</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={maintenanceSeries} barGap={4}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Bar dataKey="preventiva" name="Preventiva" fill="#2575f5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="corretiva" name="Corretiva" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-5 transition-all duration-200" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-5" style={{ fontFamily: "Roboto Slab, serif" }}>Status da frota</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{pieData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}</Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[index] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-foreground font-semibold" style={{ fontFamily: "DM Mono, monospace" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-5 transition-all duration-200" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
        >
          <div className="flex items-center gap-2 mb-5"><TrendingUp size={14} className="text-primary" /><h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Disponibilidade da frota (%)</h3></div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={availabilitySeries}>
              <defs><linearGradient id="dispGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2575f5" stopOpacity={0.25} /><stop offset="95%" stopColor="#2575f5" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="disponibilidade" name="Disponibilidade %" stroke="#2575f5" fill="url(#dispGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl p-5 transition-all duration-200" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-5" style={{ fontFamily: "Roboto Slab, serif" }}>Custos de manutenção</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={maintenanceSeries}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="custo" name="Custo R$" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
