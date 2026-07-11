import { Car, Edit2, Trash2, Eye, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import { Card, Button, StatusBadge, Input } from "./ui";

interface ViaturaFilters {
  search: string;
  status: string;
  unidade: string;
}

export default function Viaturas() {
  const { viaturas, deleteViatura } = useFleet();
  const [filters, setFilters] = useState<ViaturaFilters>({
    search: "",
    status: "",
    unidade: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const unidades = [...new Set(viaturas.map((v) => v.unidade))];
  const statusOptions = ["operação", "manutenção", "indisponível"];

  const filtered = viaturas.filter((v) => {
    const matchSearch = v.placa.toLowerCase().includes(filters.search.toLowerCase()) ||
      v.numero.toLowerCase().includes(filters.search.toLowerCase()) ||
      v.modelo.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = !filters.status || v.status === filters.status;
    const matchUnidade = !filters.unidade || v.unidade === filters.unidade;
    return matchSearch && matchStatus && matchUnidade;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operação":
        return "success";
      case "manutenção":
        return "warning";
      case "indisponível":
        return "danger";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "operação":
        return "🟢 Operacional";
      case "manutenção":
        return "🟡 Em Manutenção";
      case "indisponível":
        return "🔴 Indisponível";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Viaturas</h1>
        <p className="text-gray-600">Gerencie todos os veículos da frota</p>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-50 border-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por placa, número ou modelo..."
            icon={<Search size={16} />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1E3A5F]"
          >
            <option value="">Todos os Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {getStatusLabel(s)}
              </option>
            ))}
          </select>
          <select
            value={filters.unidade}
            onChange={(e) => setFilters({ ...filters, unidade: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1E3A5F]"
          >
            <option value="">Todas as Unidades</option>
            {unidades.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Contador */}
      <div className="text-sm text-gray-600">
        Exibindo <span className="font-semibold">{filtered.length}</span> de{" "}
        <span className="font-semibold">{viaturas.length}</span> viaturas
      </div>

      {/* Grid de Viaturas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((viatura) => (
          <Card
            key={viatura.id}
            className="hover:shadow-lg"
            header={
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Car size={20} className="text-[#1E3A5F]" />
                  <div>
                    <p className="font-semibold text-gray-900">{viatura.placa}</p>
                    <p className="text-xs text-gray-500">Número: {viatura.numero}</p>
                  </div>
                </div>
                <StatusBadge variant={getStatusColor(viatura.status) as any}>
                  {getStatusLabel(viatura.status)}
                </StatusBadge>
              </div>
            }
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Modelo</p>
                <p className="text-sm font-medium text-gray-800">{viatura.modelo}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ano</p>
                  <p className="text-sm font-medium text-gray-800">{viatura.ano}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">KM</p>
                  <p className="text-sm font-medium text-gray-800">{viatura.km.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Unidade</p>
                <p className="text-sm font-medium text-gray-800">{viatura.unidade}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Última Revisão</p>
                  <p className="text-xs font-medium text-gray-800">{viatura.ultimaRevisao}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Próxima</p>
                  <p className="text-xs font-medium text-gray-800">{viatura.proximaRevisao}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Button size="sm" variant="primary" icon={<Eye size={14} />} className="flex-1">
                Visualizar
              </Button>
              <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} />
              <Button size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={() => deleteViatura(viatura.id)} />
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <Car size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhuma viatura encontrada</p>
        </Card>
      )}
    </div>
  );
}
