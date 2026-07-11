import { Calendar, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import { Card, Button, StatusBadge, Input } from "./ui";
import { deriveMaintenanceStatus } from "../lib/fleet";

export default function ManutencaoPreventiva() {
  const { manutencaoItens, deleteMaintenanceItem } = useFleet();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = manutencaoItens.filter(
    (m) =>
      m.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.frequencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "success";
      case "alerta":
        return "warning";
      case "vencida":
        return "danger";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return "✓";
      case "alerta":
        return "!";
      case "vencida":
        return "✕";
      default:
        return "?";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manutenção Preventiva</h1>
          <p className="text-gray-600">Planeje e gerencie manutenções preventivas</p>
        </div>
        <Button icon={<Plus size={18} />}>Nova Manutenção</Button>
      </div>

      {/* Buscador */}
      <Input
        placeholder="Buscar por item ou frequência..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-100">
          <p className="text-xs text-green-600 uppercase tracking-wide font-semibold mb-1">OK</p>
          <p className="text-3xl font-bold text-green-700">
            {filtered.filter((m) => deriveMaintenanceStatus(m) === "ok").length}
          </p>
        </Card>
        <Card className="bg-yellow-50 border-yellow-100">
          <p className="text-xs text-yellow-600 uppercase tracking-wide font-semibold mb-1">Alerta</p>
          <p className="text-3xl font-bold text-yellow-700">
            {filtered.filter((m) => deriveMaintenanceStatus(m) === "alerta").length}
          </p>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-1">Vencida</p>
          <p className="text-3xl font-bold text-red-700">
            {filtered.filter((m) => deriveMaintenanceStatus(m) === "vencida").length}
          </p>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-1">Total</p>
          <p className="text-3xl font-bold text-blue-700">{filtered.length}</p>
        </Card>
      </div>

      {/* Lista de Manutenções em Cards */}
      <div className="space-y-3">
        {filtered.map((manutencao) => {
          const status = deriveMaintenanceStatus(manutencao);
          return (
            <Card key={manutencao.id} className="hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={18} className="text-[#1E3A5F]" />
                    <h3 className="font-semibold text-gray-900">{manutencao.item}</h3>
                    <StatusBadge variant={getStatusColor(status) as any}>
                      {getStatusIcon(status)} {status.toUpperCase()}
                    </StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Frequência</p>
                      <p className="text-gray-800 font-medium">{manutencao.frequencia}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Última Data</p>
                      <p className="text-gray-800 font-medium">{manutencao.ultimaData}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Próxima Data</p>
                      <p className="text-gray-800 font-medium">{manutencao.proximaData}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Próximo KM</p>
                      <p className="text-gray-800 font-medium">{manutencao.proximoKm?.toLocaleString() || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} />
                  <Button
                    size="sm"
                    variant="danger"
                    icon={<Trash2 size={14} />}
                    onClick={() => deleteMaintenanceItem(manutencao.id)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhuma manutenção encontrada</p>
        </Card>
      )}
    </div>
  );
}
