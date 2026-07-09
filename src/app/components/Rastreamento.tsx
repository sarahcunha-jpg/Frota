import { MapPin, Navigation, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import { Card, Badge, Input } from "./ui";

export default function Rastreamento() {
  const { viaturas } = useFleet();
  const [selectedViatura, setSelectedViatura] = useState<string | null>(null);

  const selected = selectedViatura ? viaturas.find((v) => v.id === selectedViatura) : viaturas[0];

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rastreamento de Viaturas</h1>
        <p className="text-gray-600">Monitore a localização em tempo real da frota</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden h-96">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-blue-300 mb-4" />
                <p className="text-gray-500 text-sm">Mapa interativo</p>
                <p className="text-gray-400 text-xs mt-1">Integração com Leaflet em desenvolvimento</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-4">
          <Card header={<h3 className="font-semibold text-gray-800 text-sm">Viaturas</h3>}>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {viaturas.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedViatura(v.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedViatura === v.id
                      ? "border-[#1E3A5F] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-900">{v.placa}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.modelo}</p>
                  <Badge variant={getStatusColor(v.status) as any} className="mt-2">
                    {v.status === "operação" ? "🟢" : v.status === "manutenção" ? "🟡" : "🔴"} {v.status}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>

          {selected && (
            <Card header={<h3 className="font-semibold text-gray-800 text-sm">Detalhes</h3>}>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Localização</p>
                  <p className="text-gray-800 font-medium flex items-center gap-1">
                    <MapPin size={14} className="text-[#1E3A5F]" />
                    {selected.x}, {selected.y}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Velocidade</p>
                  <p className="text-gray-800 font-medium flex items-center gap-1">
                    <Navigation size={14} className="text-[#1E3A5F]" />
                    {selected.velocidade} km/h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Direção</p>
                  <p className="text-gray-800 font-medium">{selected.direcao}°</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Quilometragem</p>
                  <p className="text-gray-800 font-medium">{selected.km.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <Badge variant={getStatusColor(selected.status) as any} className="mt-1">
                    {selected.status}
                  </Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}