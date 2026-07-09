import { TrendingUp, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Download } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useFleet } from "../context/FleetContext";
import { Card, Button, Badge } from "./ui";
import { buildAvailabilitySeries, buildMaintenanceSeries, getFleetStats } from "../lib/fleet";

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

export default function Relatorios() {
  const { viaturas, historico } = useFleet();
  const stats = getFleetStats(viaturas, [], []);
  const maintenanceSeries = buildMaintenanceSeries(historico);
  const availabilitySeries = buildAvailabilitySeries(viaturas);

  const totalCusto = historico.reduce((acc, h) => acc + h.custo, 0);
  const preventivas = historico.filter((h) => h.tipo === "preventiva").length;
  const corretivas = historico.filter((h) => h.tipo === "corretiva").length;
  const custoMedio = historico.length > 0 ? totalCusto / historico.length : 0;

  const pieData = [
    { name: "Preventiva", value: preventivas },
    { name: "Corretiva", value: corretivas },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
          <p className="text-gray-600">Análise completa de manutenções e custos</p>
        </div>
        <Button icon={<Download size={18} />}>Exportar PDF</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Total de Manutenções</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{historico.length}</p>
            </div>
            <BarChartIcon size={32} className="text-blue-300" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 uppercase tracking-wide font-semibold">Preventivas</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{preventivas}</p>
            </div>
            <Badge variant="success" className="text-lg">{((preventivas / historico.length) * 100 || 0).toFixed(0)}%</Badge>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 uppercase tracking-wide font-semibold">Corretivas</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{corretivas}</p>
            </div>
            <Badge variant="warning" className="text-lg">{((corretivas / historico.length) * 100 || 0).toFixed(0)}%</Badge>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold">Custo Médio</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">{custoMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <TrendingUp size={32} className="text-purple-300" />
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<h3 className="font-semibold text-gray-800 text-sm">Manutenções por Mês</h3>}>
          <ResponsiveContainer width="100%" height={300}>
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

        <Card header={<h3 className="font-semibold text-gray-800 text-sm">Proporção (Preventiva vs Corretiva)</h3>}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#27AE60" : "#F39C12"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<h3 className="font-semibold text-gray-800 text-sm">Custos Acumulados</h3>}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={maintenanceSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="custo" name="Custo (R$)" stroke="#1E3A5F" strokeWidth={2} dot={{ fill: "#1E3A5F", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card header={<h3 className="font-semibold text-gray-800 text-sm">Disponibilidade da Frota</h3>}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={availabilitySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="disponibilidade" name="Disponibilidade (%)" stroke="#27AE60" strokeWidth={2} dot={{ fill: "#27AE60", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}