import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { Navigation, Wifi, WifiOff } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import { canTrack } from "../lib/permissions";

function toLatLng(x: number, y: number) {
  return {
    lat: -26.91 + (50 - y) * 0.0017,
    lng: -49.10 + (x - 50) * 0.0018,
  };
}

function divIcon(active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${active ? "#1d6cf0" : "#10b981"};border:2px solid rgba(255,255,255,0.9);box-shadow:0 0 0 4px ${active ? "rgba(29,108,240,0.18)" : "rgba(16,185,129,0.18)"};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function Rastreamento() {
  const { viaturas, currentUser } = useFleet();
  const [selected, setSelected] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [positions, setPositions] = useState<Record<string, { lat: number; lng: number; heading: number }>>(() =>
    Object.fromEntries(viaturas.filter((item) => item.status === "operação").map((item) => [item.id, { ...toLatLng(item.x, item.y), heading: item.direcao }]))
  );
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<Record<string, L.Marker>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const allowed = currentUser ? canTrack(currentUser.role) : false;
  const activeViaturas = useMemo(() => viaturas.filter((item) => item.status === "operação"), [viaturas]);
  const selectedViatura = viaturas.find((item) => item.id === selected);

  useEffect(() => {
    if (!allowed || !containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current, { zoomControl: true }).setView([-26.915, -49.09], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [allowed]);

  useEffect(() => {
    if (!allowed) return;
    const interval = window.setInterval(() => {
      setPositions((prev) => Object.fromEntries(activeViaturas.map((item) => {
        const current = prev[item.id] ?? { ...toLatLng(item.x, item.y), heading: item.direcao };
        const lat = current.lat + (Math.random() - 0.5) * 0.002;
        const lng = current.lng + (Math.random() - 0.5) * 0.002;
        const heading = (current.heading + (Math.random() - 0.5) * 35 + 360) % 360;
        return [item.id, { lat, lng, heading }];
      })));
      setLastUpdate(new Date());
    }, 4000);
    return () => window.clearInterval(interval);
  }, [activeViaturas, allowed]);

  useEffect(() => {
    if (!allowed || !mapRef.current) return;

    activeViaturas.forEach((item) => {
      const pos = positions[item.id] ?? { ...toLatLng(item.x, item.y), heading: item.direcao };
      const popup = `<strong>Viatura ${item.numero}</strong><br/>${item.modelo}<br/>Velocidade: ${item.velocidade} km/h<br/>Status: ${item.status}<br/>KM: ${item.km.toLocaleString("pt-BR")}<br/>Atualização: ${lastUpdate.toLocaleTimeString("pt-BR")}`;
      const existing = markerRef.current[item.id];
      if (existing) {
        existing.setLatLng([pos.lat, pos.lng]);
        existing.setIcon(divIcon(selected === item.id));
        existing.setPopupContent(popup);
      } else {
        markerRef.current[item.id] = L.marker([pos.lat, pos.lng], { icon: divIcon(selected === item.id) }).addTo(mapRef.current!).bindPopup(popup);
        markerRef.current[item.id].on("click", () => setSelected(item.id));
      }
    });

    Object.entries(markerRef.current).forEach(([id, marker]) => {
      if (!activeViaturas.some((item) => item.id === id)) {
        marker.remove();
        delete markerRef.current[id];
      }
    });
  }, [activeViaturas, allowed, lastUpdate, positions, selected]);

  useEffect(() => {
    if (!selected || !mapRef.current || !positions[selected]) return;
    mapRef.current.flyTo([positions[selected].lat, positions[selected].lng], 13, { duration: 0.8 });
    markerRef.current[selected]?.openPopup();
  }, [positions, selected]);

  if (!allowed) {
    return <div className="bg-card border border-border rounded-xl p-6 text-sm text-muted-foreground">O rastreamento em tempo real está disponível apenas para perfis de Administrador e Gestor.</div>;
  }

  return (
    <div className="space-y-5 h-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Rastreamento em Tempo Real</h1>
          <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />Ao vivo — Atualizado às {lastUpdate.toLocaleTimeString("pt-BR")}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full"><Wifi size={12} /> GPS simulado ativo — {activeViaturas.length} viaturas</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ minHeight: 520 }}>
        <div className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden relative" style={{ minHeight: 520 }}>
          <div ref={containerRef} className="w-full h-full" style={{ minHeight: 520 }} />
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[520px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">Viaturas ativas</p>
          {activeViaturas.map((item) => {
            const pos = positions[item.id];
            const active = item.id === selected;
            return (
              <button key={item.id} onClick={() => setSelected(item.id === selected ? null : item.id)} className={`w-full text-left p-3 rounded-lg border transition-colors ${active ? "border-primary/50 bg-primary/10" : "border-border bg-card hover:border-border/80"}`}>
                <div className="flex items-center justify-between mb-1"><span className="mono font-bold text-sm" style={{ fontFamily: "DM Mono, monospace", color: active ? "#60a5fa" : "#e2e8f0" }}>V-{item.numero}</span><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /></div>
                <p className="text-xs text-muted-foreground">{item.modelo}</p>
                <p className="text-xs text-muted-foreground">{item.placa}</p>
                {pos && <p className="mono text-xs mt-1" style={{ fontFamily: "DM Mono, monospace", color: "#64748b" }}>{pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}</p>}
                <p className="mono text-xs" style={{ fontFamily: "DM Mono, monospace", color: "#f59e0b" }}>{item.velocidade} km/h</p>
              </button>
            );
          })}

          <p className="text-xs text-muted-foreground uppercase tracking-wider px-1 pt-2">Fora de serviço</p>
          {viaturas.filter((item) => item.status !== "operação").map((item) => (
            <div key={item.id} className="p-3 rounded-lg border border-border bg-card opacity-50">
              <div className="flex items-center justify-between mb-1"><span className="mono font-bold text-sm" style={{ fontFamily: "DM Mono, monospace" }}>V-{item.numero}</span><WifiOff size={11} className="text-muted-foreground" /></div>
              <p className="text-xs text-muted-foreground">{item.modelo}</p>
              <span className={`text-xs capitalize ${item.status === "manutenção" ? "text-amber-400" : "text-red-400"}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedViatura && positions[selectedViatura.id] && (
        <div className="bg-card border border-primary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3"><Navigation size={14} className="text-primary" /><h3 className="font-semibold text-foreground text-sm" style={{ fontFamily: "Roboto Slab, serif" }}>Viatura {selectedViatura.numero} — {selectedViatura.modelo}</h3></div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            {[ ["Placa", selectedViatura.placa], ["Unidade", selectedViatura.unidade], ["Velocidade", `${selectedViatura.velocidade} km/h`], ["KM", selectedViatura.km.toLocaleString("pt-BR")], ["Última atualiz.", lastUpdate.toLocaleTimeString("pt-BR")] ].map(([key, value]) => (
              <div key={String(key)}><p className="text-xs text-muted-foreground mb-0.5">{key}</p><p className="text-foreground font-medium mono text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{value}</p></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
