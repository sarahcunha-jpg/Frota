import { HistoricoItem, ManutencaoItem, OrdemServico, Viatura, disponibilidadeMensal } from "../data/mockData";

export function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export function addDays(dateIso: string, days: number) {
  const date = new Date(`${dateIso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function daysUntil(dateIso: string) {
  if (!dateIso) return Number.POSITIVE_INFINITY;
  const target = new Date(`${dateIso}T12:00:00`).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function deriveMaintenanceStatus(item: Pick<ManutencaoItem, "proximaData" | "proximoKm" | "ultimoKm">, currentKm?: number): ManutencaoItem["status"] {
  const dueByDate = item.proximaData ? daysUntil(item.proximaData) : Number.POSITIVE_INFINITY;
  const kmBase = currentKm ?? item.ultimoKm;
  const remainingKm = item.proximoKm ? item.proximoKm - kmBase : Number.POSITIVE_INFINITY;

  if (dueByDate <= 0 || remainingKm <= 0) return "vencida";
  if (dueByDate <= 30 || remainingKm <= 1000) return "alerta";
  return "ok";
}

export function buildOrderLabel(index: number) {
  return `OS-${new Date().getFullYear()}-${String(index).padStart(3, "0")}`;
}

export function buildMaintenanceSeries(historico: HistoricoItem[]) {
  const monthMap = new Map<string, { mes: string; preventiva: number; corretiva: number; custo: number }>();

  historico.forEach((item) => {
    const date = new Date(`${item.data}T12:00:00`);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const current = monthMap.get(key) ?? { mes: label.charAt(0).toUpperCase() + label.slice(1), preventiva: 0, corretiva: 0, custo: 0 };
    current[item.tipo] += 1;
    current.custo += item.custo;
    monthMap.set(key, current);
  });

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, value]) => value);
}

export function buildAvailabilitySeries(viaturas: Viatura[]) {
  const currentAvailability = viaturas.length > 0
    ? Math.round((viaturas.filter((item) => item.status === "operação").length / viaturas.length) * 100)
    : 0;

  return disponibilidadeMensal.map((item, index, items) => (
    index === items.length - 1 ? { ...item, disponibilidade: currentAvailability } : item
  ));
}

export function getFleetStats(viaturas: Viatura[], ordensServico: OrdemServico[], manutencaoItens: ManutencaoItem[]) {
  const total = viaturas.length;
  const emOperacao = viaturas.filter((item) => item.status === "operação").length;
  const emManutencao = viaturas.filter((item) => item.status === "manutenção").length;
  const indisponiveis = viaturas.filter((item) => item.status === "indisponível").length;
  const proximasRevisoes = viaturas.filter((item) => {
    const diff = daysUntil(item.proximaRevisao);
    return diff <= 30 && diff > 0;
  }).length;

  return {
    total,
    emOperacao,
    emManutencao,
    indisponiveis,
    proximasRevisoes,
    ordensAbertas: ordensServico.filter((item) => item.status !== "finalizada").length,
    manutencoesVencidas: manutencaoItens.filter((item) => item.status === "vencida"),
    manutencoesAlerta: manutencaoItens.filter((item) => item.status === "alerta"),
  };
}

export function getKpis(viaturas: Viatura[], ordensServico: OrdemServico[]) {
  const total = viaturas.length || 1;
  const disponiveis = viaturas.filter((item) => item.status === "operação").length;
  const disponibilidade = Math.round((disponiveis / total) * 100);
  const finalizadas = ordensServico.filter((item) => item.status === "finalizada");
  const mttr = finalizadas.length > 0 ? Number((finalizadas.reduce((sum, item) => sum + item.tempoParada, 0) / finalizadas.length).toFixed(1)) : 0;
  const custoTotal = ordensServico.reduce((sum, item) => sum + item.custo, 0);
  const custoPorViatura = total > 0 ? custoTotal / total : 0;
  const falhas = finalizadas.filter((item) => !/revis|prevent|troca de óleo|alinhamento|pneu/i.test(`${item.problema} ${item.servico}`)).length;
  const horasOperacao = viaturas.reduce((sum, item) => sum + Math.max(item.km / 40, 1), 0);
  const mtbf = falhas > 0 ? Math.round(horasOperacao / falhas) : 0;

  return { disponibilidade, mttr, mtbf, custoTotal, custoPorViatura, finalizadas };
}

export function buildVehicleHistoryStats(viaturaId: string, historico: HistoricoItem[], ordensServico: OrdemServico[]) {
  const items = historico.filter((item) => item.viaturaId === viaturaId).sort((a, b) => b.data.localeCompare(a.data));
  const orders = ordensServico.filter((item) => item.viaturaId === viaturaId);
  return {
    items,
    totalCusto: items.reduce((sum, item) => sum + item.custo, 0),
    totalParadaDias: orders.reduce((sum, item) => sum + item.tempoParada, 0),
    pecas: Array.from(new Set(items.flatMap((item) => item.pecas))).sort(),
    revisoes: items.filter((item) => item.tipo === "preventiva").map((item) => item.data),
  };
}

export function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function openPrintableWindow(title: string, body: string) {
  const popup = window.open("", "_blank", "width=960,height=720");
  if (!popup) return;
  popup.document.write(`<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111827}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;font-size:12px}h1{font-size:20px;margin-bottom:8px}p{font-size:12px;color:#4b5563}</style></head><body>${body}</body></html>`);
  popup.document.close();
  popup.focus();
  popup.print();
}
