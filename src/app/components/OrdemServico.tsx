import { Wrench, Plus, Eye, Edit2, Trash2, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import { Card, Button, Badge, Input } from "./ui";

export default function OrdemServico() {
  const { ordensServico, deleteOrder } = useFleet();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = ordensServico.filter((os) => {
    const matchSearch = os.numero.includes(searchTerm) || os.viatura.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || os.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberta":
        return "primary";
      case "andamento":
        return "warning";
      case "finalizada":
        return "success";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aberta":
        return "📋 Aberta";
      case "andamento":
        return "🔄 Em Andamento";
      case "finalizada":
        return "✅ Finalizada";
      default:
        return status;
    }
  };

  const totalCusto = filtered.reduce((acc, os) => acc + os.custo, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ordens de Serviço</h1>
          <p className="text-gray-600">Acompanhe todas as solicitações de manutenção</p>
        </div>
        <Button icon={<Plus size={18} />}>Nova Ordem</Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Buscar por número ou viatura..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1E3A5F]"
        >
          <option value="">Todos os Status</option>
          <option value="aberta">Aberta</option>
          <option value="andamento">Em Andamento</option>
          <option value="finalizada">Finalizada</option>
        </select>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-1">Abertas</p>
          <p className="text-3xl font-bold text-blue-700">{filtered.filter((os) => os.status === "aberta").length}</p>
        </Card>
        <Card className="bg-yellow-50 border-yellow-100">
          <p className="text-xs text-yellow-600 uppercase tracking-wide font-semibold mb-1">Em Andamento</p>
          <p className="text-3xl font-bold text-yellow-700">{filtered.filter((os) => os.status === "andamento").length}</p>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <p className="text-xs text-green-600 uppercase tracking-wide font-semibold mb-1">Custo Total</p>
          <p className="text-2xl font-bold text-green-700">{totalCusto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
        </Card>
      </div>

      {/* Lista de Ordens em Cards */}
      <div className="space-y-3">
        {filtered.map((ordem) => (
          <Card key={ordem.id} className="hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench size={18} className="text-[#1E3A5F]" />
                  <h3 className="font-semibold text-gray-900">{ordem.numero}</h3>
                  <Badge variant={getStatusColor(ordem.status) as any}>{getStatusLabel(ordem.status)}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Viatura</p>
                    <p className="text-gray-800 font-medium">{ordem.viatura}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Problema</p>
                    <p className="text-gray-800 font-medium">{ordem.problema}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Data</p>
                    <p className="text-gray-800 font-medium">{ordem.data}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Responsável</p>
                    <p className="text-gray-800 font-medium">{ordem.responsavel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Custo</p>
                    <p className="text-gray-800 font-medium">{ordem.custo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="primary" icon={<Eye size={14} />} />
                <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} />
                <Button size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={() => deleteOrder(ordem.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhuma ordem de serviço encontrada</p>
        </Card>
      )}
    </div>
  );
}