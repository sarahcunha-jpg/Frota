import { AlertTriangle, Car, CheckCircle, Clock, DollarSign, TrendingUp, Wrench } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFleet } from "../context/FleetContext";
import { buildAvailabilitySeries, buildMaintenanceSeries, getFleetStats, getKpis } from "../lib/fleet";

const COLORS = ["#1f6fff", "#10b981", "#ef4444"];

function StatCard({
  label, value, sub, icon: Icon, iconBg,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
}) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="card small text-xs">
    <p className="text-muted mb-1">{label}</p>
    {payload.map((item: any) => (
      <p key={item.name} style={{ color: item.color }}>
        {item.name}: <span className="text-foreground font-medium">{item.value}</span>
      </p>
    ))}
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

  const totalCusto = historico.reduce((acc, h) => acc + h.custo, 0);

  return (
    <div className="space-y-6 animate-frota-slide-up">

      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1f6fff 0%, #1558d4 60%, #1040a8 100%)", minHeight: 160 }}>
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
          <Car size={140} className="absolute -right-6 top-1/2 -translate-y-1/2 text-white/10" />
          <Wrench size={90} className="absolute right-32 bottom-0 translate-y-4 text-white/8" />
          <TrendingUp size={80} className="absolute right-60 top-2 text-white/8" />
        </div>

        <div className="relative z-10 px-8 py-7">
          <h1 className="text-2xl font-bold text-white leading-tight">Painel de Controle da Frota</h1>
          <p className="text-blue-200 text-sm mt-1">Polícia Militar de Blumenau — visão geral em tempo real</p>
          <p className="mt-4 text-white">
            <span className="text-4xl font-extrabold">{kpis.disponibilidade}%</span>
            <span className="text-blue-200 text-base ml-2">de disponibilidade</span>
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Viaturas"
          value={stats.total}
          sub="unidades cadastradas"
          icon={Car}
          iconBg="linear-gradient(135deg,#1f6fff,#4f8dff)"
        />
        <StatCard
          label="Operacionais"
          value={stats.emOperacao}
          sub={`${stats.total ? Math.round((stats.emOperacao / stats.total) * 100) : 0}% da frota`}
          icon={CheckCircle}
          iconBg="linear-gradient(135deg,#059669,#10b981)"
        />
        <StatCard
          label="Em Manutenção"
          value={stats.emManutencao + stats.indisponiveis}
          sub={`${stats.ordensAbertas} ordens abertas`}
          icon={Clock}
          iconBg="linear-gradient(135deg,#d97706,#f59e0b)"
        />
        <StatCard
          label="Custo Total"
          value={totalCusto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          sub={`${historico.length} manutenções`}
          icon={DollarSign}
          iconBg="linear-gradient(135deg,#0284c7,#38bdf8)"
        />
      </div>

      {/* Maintenance alerts */}
      {(stats.manutencoesVencidas.length > 0 || stats.manutencoesAlerta.length > 0) && (
        <div className="card" style={{ background: "rgba(255,249,230,0.9)", border: "1px solid rgba(249,205,116,0.25)" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-amber-500" />
            <span className="text-amber-700 font-semibold text-sm">Alertas de manutenção vencida</span>
          </div>
          <div className="space-y-1.5">
            {stats.manutencoesVencidas.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-foreground">{item.item}</span>
                <span className="text-red-500 ml-auto">Vencida em {item.proximaData || "data não informada"}</span>
              </div>
            ))}
            {stats.manutencoesAlerta.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-foreground">{item.item}</span>
                <span className="text-amber-600 ml-auto">Vence em {item.proximaData || "data não informada"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Status da Frota</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                {pieData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[index] }} />
                  <span className="text-muted">{item.name}</span>
                </div>
                <span className="text-foreground font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Custos Mensais (R$)</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={maintenanceSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="custo" name="Custo R$" fill="#1f6fff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Disponibilidade da frota (%)</h3>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={availabilitySeries}>
              <defs>
                <linearGradient id="dispGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1f6fff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1f6fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="disponibilidade" name="Disponibilidade %" stroke="#1f6fff" fill="url(#dispGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Manutenções por mês</h3>
            <span className="text-xs text-muted">Histórico consolidado</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={maintenanceSeries} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
              <Bar dataKey="preventiva" name="Preventiva" fill="#1f6fff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="corretiva" name="Corretiva" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
