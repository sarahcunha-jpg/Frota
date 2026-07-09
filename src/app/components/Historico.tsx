import { History, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import { Card, Badge, Input } from "./ui";

export default function Historico() {
  const { historico, viaturas } = useFleet();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");

  const filtered = historico.filter((h) => {
    const viatura = viaturas.find((v) => v.id === h.viaturaId);
    const matchSearch =
      h.id.includes(searchTerm) ||
      h.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (viatura?.placa.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchTipo = !tipoFilter || h.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  const getTipoColor = (tipo: string) => (tipo === "preventiva" ? "success" : "warning");
  const getTipoLabel = (tipo: string) => (tipo === "preventiva" ? "🔧 Preventiva" : "🚨 Corretiva");

  const totalCusto = filtered.reduce((acc, h) => acc + h.custo, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Manutenções</h1>
        <p className="text-gray-600">Acompanhe todas as manutenções realizadas</p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Buscar por serviço ou viatura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={16} />}
        />
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1E3A5F]"
        >
          <option value="">Todos os Tipos</option>
          <option value="preventiva">Preventiva</option>
          <option value="corretiva">Corretiva</option>
        </select>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-100">
          <p className="text-xs text-green-600 uppercase tracking-wide font-semibold mb-1">Preventivas</p>
          <p className="text-3xl font-bold text-green-700">{filtered.filter((h) => h.tipo === "preventiva").length}</p>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
          <p className="text-xs text-orange-600 uppercase tracking-wide font-semibold mb-1">Corretivas</p>
          <p className="text-3xl font-bold text-orange-700">{filtered.filter((h) => h.tipo === "corretiva").length}</p>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-1">Custo Total</p>
          <p className="text-2xl font-bold text-blue-700">{totalCusto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
        </Card>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filtered.map((item, index) => {
          const viatura = viaturas.find((v) => v.id === item.viaturaId);
          return (
            <Card key={item.id} className="hover:shadow-md border-l-4 border-l-[#1E3A5F]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A5F]/10">
                    <History size={16} className="text-[#1E3A5F]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{item.servico}</h3>
                    <Badge variant={getTipoColor(item.tipo) as any}>{getTipoLabel(item.tipo)}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Viatura</p>
                      <p className="text-gray-800 font-medium">{viatura?.placa || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Data</p>
                      <p className="text-gray-800 font-medium">{item.data}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Responsável</p>
                      <p className="text-gray-800 font-medium">{item.responsavel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">KM</p>
                      <p className="text-gray-800 font-medium">{item.km?.toLocaleString() || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Custo</p>
                      <p className="text-gray-800 font-medium">{item.custo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </div>
                  </div>
                  {item.pecas && item.pecas.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Peças Utilizadas</p>
                      <div className="flex flex-wrap gap-2">
                        {item.pecas.map((peca, idx) => (
                          <Badge key={idx} variant="primary">
                            {peca}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <History size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhum histórico de manutenção encontrado</p>
        </Card>
      )}
    </div>
  );
}