import { AlertTriangle, TrendingUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFleet } from "../context/FleetContext";
import { buildAvailabilitySeries, buildMaintenanceSeries, getFleetStats, getKpis } from "../lib/fleet";
import { Card, CardBody, CardHeader, KPICard, StatusBadge } from "./ui";

const COLORS = ["#1E3A8A", "#10B981", "#EF4444"];

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs shadow-lg">
    <p className="text-neutral-500 mb-1">{label}</p>
    {payload.map((item: any) => (
      <p key={item.name} style={{ color: item.color }}>
        {item.name}: <span className="text-neutral-800 font-medium">{item.value}</span>
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
      <Card className="bg-gradient-to-r from-primary-900 to-primary-700 text-white border-0">
        <CardBody className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold">Painel de Controle da Frota</h1>
            <p className="text-primary-100 mt-1">Polícia Militar de Blumenau — Gestão de manutenção em tempo real</p>
          </div>
          <div className="flex items-baseline gap-3 pt-4">
            <span className="text-5xl font-extrabold">{kpis.disponibilidade}%</span>
            <span className="text-primary-100 text-lg">de disponibilidade operacional</span>
          </div>
        </CardBody>
      </Card>

      {/* KPI Cards - 4 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total de Viaturas"
          value={stats.total}
          unit="unidades"
          icon="🚓"
          color="blue"
        />
        <KPICard
          title="Operacionais"
          value={stats.emOperacao}
          unit={`${stats.total ? Math.round((stats.emOperacao / stats.total) * 100) : 0}% da frota`}
          icon="✅"
          color="green"
          trend={{
            value: stats.emOperacao > 0 ? 5 : -5,
            direction: stats.emOperacao > 0 ? "up" : "down",
          }}
        />
        <KPICard
          title="Em Manutenção"
          value={stats.emManutencao + stats.indisponiveis}
          unit={`${stats.ordersAbertas} ordens abertas`}
          icon="🔧"
          color="orange"
        />
        <KPICard
          title="Custo Total"
          value={`R$ ${(totalCusto / 1000).toFixed(1)}k`}
          unit={`${historico.length} manutenções`}
          icon="💰"
          color="red"
        />
      </div>

      {/* Maintenance Alerts */}
      {(stats.manutencoesVencidas.length > 0 || stats.manutencoesAlerta.length > 0) && (
        <Card className="border-l-4 border-l-warning bg-warning_light">
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-warning" />
              <h3 className="font-semibold text-neutral-900">Alertas de Manutenção</h3>
            </div>
            <div className="space-y-2">
              {stats.manutencoesVencidas.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-warning">
                  <div className="flex items-center gap-2">
                    <StatusBadge status="danger" label="Vencida" />
                    <span className="text-sm text-neutral-700">{item.item}</span>
                  </div>
                  <span className="text-xs text-neutral-500">{item.proximaData}</span>
                </div>
              ))}
              {stats.manutencoesAlerta.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-warning">
                  <div className="flex items-center gap-2">
                    <StatusBadge status="warning" label="Alerta" />
                    <span className="text-sm text-neutral-700">{item.item}</span>
                  </div>
                  <span className="text-xs text-neutral-500">{item.proximaData}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Status da Frota"
            icon="🔍"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
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
                    <span className="text-neutral-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-neutral-800">{item.value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Custos Mensais"
            icon="💵"
            subtitle="(R$)"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={maintenanceSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="custo" name="Custo R$" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Disponibilidade"
            icon={<TrendingUp size={16} className="text-primary-600" />}
            subtitle="(%)"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={availabilitySeries}>
                <defs>
                  <linearGradient id="dispGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="disponibilidade" name="Disponibilidade %" stroke="#1E3A8A" fill="url(#dispGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Manutenções por Mês"
            icon="📊"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={maintenanceSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
                <Bar dataKey="preventiva" name="Preventiva" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="corretiva" name="Corretiva" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
