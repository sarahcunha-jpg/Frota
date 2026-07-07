import { useMemo, useState } from "react";
import { FileText, Download, BarChart2, Car, Wrench, AlertTriangle } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import { buildVehicleHistoryStats, downloadBlob, getKpis, openPrintableWindow } from "../lib/fleet";
import { canExportReports } from "../lib/permissions";

const RELATORIOS = [
  { id: "frota", label: "Situação da Frota", icon: Car, desc: "Status completo de todas as viaturas cadastradas" },
  { id: "manutencoes", label: "Manutenções Vencidas", icon: AlertTriangle, desc: "Itens com prazo de manutenção vencido ou próximo" },
  { id: "os", label: "Viaturas em Manutenção", icon: Wrench, desc: "Ordens de serviço por período e situação" },
  { id: "custos", label: "Custos Mensais", icon: BarChart2, desc: "Custo consolidado de manutenção por mês" },
  { id: "historico", label: "Histórico por Viatura", icon: FileText, desc: "Registro completo de manutenções por viatura" },
  { id: "kpi", label: "Disponibilidade da Frota", icon: BarChart2, desc: "KPIs: disponibilidade, MTTR, MTBF e custo por viatura" },
] as const;

export default function Relatorios() {
  const { viaturas, ordensServico, historico, manutencaoItens, currentUser } = useFleet();
  const [selected, setSelected] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState({ inicio: "2025-01-01", fim: new Date().toISOString().split("T")[0] });
  const [viaturaId, setViaturaId] = useState(viaturas[0]?.id ?? "");
  const canExport = currentUser ? canExportReports(currentUser.role) : false;

  const withinRange = (date: string) => (!periodo.inicio || date >= periodo.inicio) && (!periodo.fim || date <= periodo.fim);

  const report = useMemo(() => {
    const kpis = getKpis(viaturas, ordensServico);
    switch (selected) {
      case "frota": {
        const rows = viaturas.map((item) => [item.numero, item.placa, item.modelo, String(item.ano), item.km.toLocaleString("pt-BR"), item.unidade, item.status, item.proximaRevisao || "—"]);
        return { headers: ["Nº", "Placa", "Modelo", "Ano", "KM", "Unidade", "Status", "Próx. Revisão"], rows, footer: `Total de viaturas: ${viaturas.length}` };
      }
      case "manutencoes": {
        const rows = manutencaoItens.filter((item) => item.status !== "ok").map((item) => [item.item, item.frequencia, item.proximaData || "—", item.proximoKm ? `${item.proximoKm.toLocaleString("pt-BR")} km` : "—", item.status]);
        return { headers: ["Item", "Frequência", "Próxima Data", "Próximo KM", "Status"], rows, footer: `Itens em alerta/vencidos: ${rows.length}` };
      }
      case "os": {
        const rows = ordensServico.filter((item) => withinRange(item.data)).map((item) => [item.numero, item.data, item.viatura, item.problema, item.responsavel, `R$ ${item.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, item.status]);
        return { headers: ["OS", "Data", "Viatura", "Problema", "Responsável", "Custo", "Status"], rows, footer: `OS no período: ${rows.length}` };
      }
      case "custos": {
        const grouped = new Map<string, number>();
        historico.filter((item) => withinRange(item.data)).forEach((item) => {
          const month = item.data.slice(0, 7);
          grouped.set(month, (grouped.get(month) ?? 0) + item.custo);
        });
        const rows = Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => [month, `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]);
        return { headers: ["Mês", "Custo"], rows, footer: `Custo total: R$ ${Array.from(grouped.values()).reduce((sum, value) => sum + value, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` };
      }
      case "historico": {
        const stats = buildVehicleHistoryStats(viaturaId, historico.filter((item) => withinRange(item.data)), ordensServico);
        const viatura = viaturas.find((item) => item.id === viaturaId);
        const rows = stats.items.map((item) => [item.data, item.tipo, item.servico, item.km.toLocaleString("pt-BR"), `R$ ${item.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, item.responsavel]);
        return { headers: ["Data", "Tipo", "Serviço", "KM", "Custo", "Responsável"], rows, footer: `${viatura?.numero ?? "Viatura"} · custo acumulado R$ ${stats.totalCusto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` };
      }
      case "kpi": {
        const rows = [
          ["Disponibilidade da Frota", `${kpis.disponibilidade}%`],
          ["MTTR", `${kpis.mttr.toFixed(1)} dias`],
          ["MTBF", kpis.mtbf ? `${kpis.mtbf.toLocaleString("pt-BR")} h` : "—"],
          ["Custo por Viatura", `R$ ${Math.round(kpis.custoPorViatura).toLocaleString("pt-BR")}`],
        ];
        return { headers: ["Indicador", "Valor"], rows, footer: `Base: ${viaturas.length} viaturas e ${ordensServico.length} OS` };
      }
      default:
        return null;
    }
  }, [selected, viaturas, manutencaoItens, ordensServico, historico, viaturaId, periodo]);

  function exportCsv() {
    if (!report) return;
    const csv = [report.headers.join(";"), ...report.rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))].join("\n");
    downloadBlob(`relatorio-${selected}.csv`, csv, "text/csv;charset=utf-8;");
  }

  function exportPdf() {
    if (!report) return;
    openPrintableWindow(RELATORIOS.find((item) => item.id === selected)?.label ?? "Relatório", {
      subtitle: `Período: ${periodo.inicio} a ${periodo.fim}`,
      table: { headers: report.headers, rows: report.rows },
      footer: report.footer,
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Roboto Slab, serif" }}>Relatórios</h1>
        <p className="text-muted-foreground text-xs mt-0.5">Geração e exportação de relatórios operacionais em nível MVP</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {RELATORIOS.map((item) => (
          <button key={item.id} onClick={() => setSelected(item.id === selected ? null : item.id)}
            className="flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-200"
            style={selected === item.id
              ? { background: "rgba(37,117,245,0.12)", border: "1px solid rgba(37,117,245,0.4)", boxShadow: "0 4px 16px rgba(37,117,245,0.15)" }
              : { background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }
            }
            onMouseEnter={(e) => { if (selected !== item.id) (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.22)"; }}
            onMouseLeave={(e) => { if (selected !== item.id) (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.11)"; }}
          >
            <item.icon size={16} className={`mt-0.5 ${selected === item.id ? "text-primary" : "text-muted-foreground"}`} />
            <div>
              <p className={`font-medium text-sm mb-0.5 ${selected === item.id ? "text-primary" : "text-foreground"}`}>{item.label}</p>
              <p className="text-muted-foreground text-xs">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && report && (
        <>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">De:</label>
              <input type="date" value={periodo.inicio} onChange={(event) => setPeriodo((current) => ({ ...current, inicio: event.target.value }))}
                className="rounded-lg px-3 py-1.5 text-sm text-foreground outline-none"
                style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.15)" }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Até:</label>
              <input type="date" value={periodo.fim} onChange={(event) => setPeriodo((current) => ({ ...current, fim: event.target.value }))}
                className="rounded-lg px-3 py-1.5 text-sm text-foreground outline-none"
                style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.15)" }} />
            </div>
            {selected === "historico" && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Viatura:</label>
                <select value={viaturaId} onChange={(event) => setViaturaId(event.target.value)}
                  className="rounded-lg px-3 py-1.5 text-sm text-foreground outline-none"
                  style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.15)" }}>
                  {viaturas.map((item) => <option key={item.id} value={item.id}>{item.numero} – {item.placa}</option>)}
                </select>
              </div>
            )}
            {canExport && (
              <div className="ml-auto flex gap-2">
                <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-all"
                  style={{ border: "1px solid rgba(148,163,184,0.15)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                ><Download size={13} /> CSV/Excel</button>
                <button onClick={exportPdf} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium transition-all"
                  style={{ background: "linear-gradient(135deg,#2575f5,#4f8dff)", boxShadow: "0 4px 14px rgba(37,117,245,0.35)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(37,117,245,0.5)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(37,117,245,0.35)"; }}
                ><Download size={13} /> PDF</button>
              </div>
            )}
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg shadow-black/30 animate-frota-slide-up" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(148,163,184,0.09)" }}>
              <div>
                <h3 className="font-semibold text-foreground text-sm" style={{ fontFamily: "Roboto Slab, serif" }}>{RELATORIOS.find((item) => item.id === selected)?.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Período: {periodo.inicio} a {periodo.fim} · 10º BPM Blumenau/SC</p>
              </div>
              <p className="text-xs text-muted-foreground">{report.footer}</p>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(148,163,184,0.09)" }}>
                    {report.headers.map((header) => <th key={header} className="text-left text-muted-foreground px-3 py-2 font-medium">{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row, index) => (
                    <tr key={`${row[0]}-${index}`} className="transition-colors"
                      style={{ borderBottom: "1px solid rgba(148,163,184,0.06)", background: index % 2 !== 0 ? "rgba(255,255,255,0.012)" : "" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,117,245,0.05)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = index % 2 !== 0 ? "rgba(255,255,255,0.012)" : ""; }}
                    >
                      {row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`} className="px-3 py-2">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {report.rows.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">Nenhum dado encontrado para os filtros selecionados.</div>}
            </div>
          </div>
        </>
      )}

      {selected && !canExport && <div className="text-sm text-muted-foreground rounded-xl p-4" style={{ background: "rgba(15,26,46,0.9)", border: "1px solid rgba(148,163,184,0.11)" }}>Exportações CSV/PDF estão disponíveis apenas para Administrador e Gestor.</div>}
    </div>
  );
}
