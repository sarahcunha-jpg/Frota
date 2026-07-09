import { AlertTriangle, Car, CheckCircle, Clock, DollarSign, TrendingUp, Wrench } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFleet } from "../context/FleetContext";
import { buildAvailabilitySeries, buildMaintenanceSeries, getFleetStats, getKpis } from "../lib/fleet";
import { Card, KPICard, Badge } from "./ui";

const COLORS = ["#1E3A5F", "#27AE60", "#E74C3C"];

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg">
    <p className="text-gray-500 mb-1">{label}</p>
    {payload.map((item: any) => (
      <p key={item.name} style={{ color: item.color }}>
        {item.name}: <span className="text-gray-800 font-medium">{item.value}</span>
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
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div
        className="relative rounded-xl overflow-hidden p-8 text-white"
        style={{
          background: "linear-gradient(135deg, #1E3A5F 0%, #2c4f7c 60%, #162a47 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-10" aria-hidden>
          <Car size={200} className="absolute -right-10 top-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Painel de Controle da Frota</h1>
          <p className="text-blue-100 text-sm mb-6">Polícia Militar de Blumenau — Gestão de manutenção em tempo real</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold">{kpis.disponibilidade}%</span>
            <span className="text-blue-100">de disponibilidade operacional</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - 4 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total de Viaturas"
          value={stats.total}
          subtitle="unidades cadastradas"
          icon={Car}
          iconBg="linear-gradient(135deg, #1E3A5F 0%, #2c4f7c 100%)"
        />
        <KPICard
          label="Operacionais"
          value={stats.emOperacao}
          subtitle={`${stats.total ? Math.round((stats.emOperacao / stats.total) * 100) : 0}% da frota`}
          icon={CheckCircle}
          iconBg="linear-gradient(135deg, #27AE60 0%, #52be7f 100%)"
        />
        <KPICard
          label="Em Manutenção"
          value={stats.emManutencao + stats.indisponiveis}
          subtitle={`${stats.ordensAbertas} ordens abertas`}
          icon={Clock}
          iconBg="linear-gradient(135deg, #F39C12 0%, #f5b041 100%)"
        />
        <KPICard
          label="Custo Total"
          value={totalCusto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          subtitle={`${historico.length} manutenções`}
          icon={DollarSign}
          iconBg="linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)"
        />
      </div>

      {/* Maintenance Alerts */}
      {(stats.manutencoesVencidas.length > 0 || stats.manutencoesAlerta.length > 0) && (
        <Card className="border-l-4 border-l-yellow-400 bg-yellow-50">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={18} className="text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Alertas de Manutenção</h3>
          </div>
          <div className="space-y-2">
            {stats.manutencoesVencidas.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Badge variant="danger">Vencida</Badge>
                  <span className="text-sm text-gray-700">{item.item}</span>
                </div>
                <span className="text-xs text-gray-500">{item.proximaData}</span>
              </div>
            ))}
            {stats.manutencoesAlerta.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Alerta</Badge>
                  <span className="text-sm text-gray-700">{item.item}</span>
                </div>
                <span className="text-xs text-gray-500">{item.proximaData}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card header={<h3 className="font-semibold text-gray-800 text-sm">Status da Frota</h3>}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[index] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card header={<h3 className="font-semibold text-gray-800 text-sm">Custos Mensais (R$)</h3>}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={maintenanceSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="custo" name="Custo R$" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card header={<div className="flex items-center gap-2"><TrendingUp size={14} className="text-[#1E3A5F]" /><h3 className="font-semibold text-gray-800 text-sm">Disponibilidade (%)</h3></div>}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={availabilitySeries}>
              <defs>
                <linearGradient id="dispGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis domain={[70, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="disponibilidade" name="Disponibilidade %" stroke="#1E3A5F" fill="url(#dispGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card header={<h3 className="font-semibold text-gray-800 text-sm">Manutenções por Mês</h3>}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={maintenanceSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
              <Bar dataKey="preventiva" name="Preventiva" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="corretiva" name="Corretiva" fill="#F39C12" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
