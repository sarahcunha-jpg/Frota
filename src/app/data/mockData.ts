export type ViaturaStatus = "operação" | "manutenção" | "indisponível";
export type OSStatus = "aberta" | "andamento" | "finalizada";
export type UserRole = "administrador" | "gestor" | "mecanico" | "policial";

export interface Viatura {
  id: string;
  numero: string;
  placa: string;
  modelo: string;
  ano: number;
  km: number;
  unidade: string;
  status: ViaturaStatus;
  ultimaRevisao: string;
  proximaRevisao: string;
  x: number;
  y: number;
  velocidade: number;
  direcao: number;
}

export interface ManutencaoItem {
  id: string;
  viaturaId?: string;
  item: string;
  frequencia: string;
  frequenciaKm?: number;
  frequenciaMeses?: number;
  ultimaData: string;
  ultimoKm: number;
  proximaData: string;
  proximoKm: number;
  status: "ok" | "alerta" | "vencida";
}

export interface OrdemServico {
  id: string;
  numero: string;
  data: string;
  viaturaId: string;
  viatura: string;
  problema: string;
  servico: string;
  responsavel: string;
  pecas: string;
  custo: number;
  tempoParada: number;
  status: OSStatus;
}

export interface HistoricoItem {
  id: string;
  viaturaId: string;
  data: string;
  tipo: "preventiva" | "corretiva";
  servico: string;
  custo: number;
  responsavel: string;
  km: number;
  pecas: string[];
}

export interface Usuario {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  role: UserRole;
  unidade: string;
  ativo: boolean;
}

export const viaturas: Viatura[] = [
  { id: "v01", numero: "001", placa: "BNU-1A34", modelo: "Toyota Hilux SW4", ano: 2022, km: 87450, unidade: "10º BPM – Centro", status: "operação", ultimaRevisao: "2025-01-15", proximaRevisao: "2025-07-15", x: 52, y: 38, velocidade: 68, direcao: 45 },
  { id: "v02", numero: "002", placa: "BNU-2B45", modelo: "Ford Ranger XL", ano: 2021, km: 124300, unidade: "10º BPM – Centro", status: "manutenção", ultimaRevisao: "2024-11-20", proximaRevisao: "2025-05-20", x: 0, y: 0, velocidade: 0, direcao: 0 },
  { id: "v03", numero: "003", placa: "BNU-3C56", modelo: "Chevrolet S10", ano: 2020, km: 156780, unidade: "1ª CIPM – Garcia", status: "operação", ultimaRevisao: "2025-02-10", proximaRevisao: "2025-08-10", x: 68, y: 55, velocidade: 42, direcao: 120 },
  { id: "v04", numero: "004", placa: "BNU-4D67", modelo: "Volkswagen Amarok", ano: 2023, km: 34200, unidade: "1ª CIPM – Garcia", status: "operação", ultimaRevisao: "2025-03-05", proximaRevisao: "2025-09-05", x: 30, y: 62, velocidade: 55, direcao: 200 },
  { id: "v05", numero: "005", placa: "BNU-5E78", modelo: "Toyota Corolla", ano: 2021, km: 98600, unidade: "2ª CIPM – Velha", status: "indisponível", ultimaRevisao: "2024-09-12", proximaRevisao: "2025-03-12", x: 0, y: 0, velocidade: 0, direcao: 0 },
  { id: "v06", numero: "006", placa: "BNU-6F89", modelo: "Ford Ranger XL", ano: 2022, km: 72100, unidade: "2ª CIPM – Velha", status: "operação", ultimaRevisao: "2025-02-28", proximaRevisao: "2025-08-28", x: 78, y: 42, velocidade: 33, direcao: 90 },
  { id: "v07", numero: "007", placa: "BNU-7G90", modelo: "Hyundai Tucson", ano: 2023, km: 21500, unidade: "3ª CIPM – Itoupava", status: "operação", ultimaRevisao: "2025-01-22", proximaRevisao: "2025-07-22", x: 22, y: 28, velocidade: 78, direcao: 310 },
  { id: "v08", numero: "008", placa: "BNU-8H01", modelo: "Chevrolet S10", ano: 2020, km: 188450, unidade: "3ª CIPM – Itoupava", status: "manutenção", ultimaRevisao: "2024-10-30", proximaRevisao: "2025-04-30", x: 0, y: 0, velocidade: 0, direcao: 0 },
  { id: "v09", numero: "009", placa: "BNU-9I12", modelo: "Toyota Hilux SW4", ano: 2022, km: 65900, unidade: "4ª CIPM – Ponta Aguda", status: "operação", ultimaRevisao: "2025-03-15", proximaRevisao: "2025-09-15", x: 45, y: 72, velocidade: 50, direcao: 170 },
  { id: "v10", numero: "010", placa: "BNU-0J23", modelo: "Ford Explorer", ano: 2021, km: 112000, unidade: "4ª CIPM – Ponta Aguda", status: "operação", ultimaRevisao: "2025-01-08", proximaRevisao: "2025-07-08", x: 60, y: 25, velocidade: 61, direcao: 45 },
  { id: "v11", numero: "011", placa: "BNU-1K34", modelo: "Mitsubishi L200", ano: 2020, km: 203100, unidade: "5ª CIPM – Fortaleza", status: "indisponível", ultimaRevisao: "2024-08-05", proximaRevisao: "2025-02-05", x: 0, y: 0, velocidade: 0, direcao: 0 },
  { id: "v12", numero: "012", placa: "BNU-2L45", modelo: "Volkswagen Amarok", ano: 2023, km: 18300, unidade: "5ª CIPM – Fortaleza", status: "operação", ultimaRevisao: "2025-04-01", proximaRevisao: "2025-10-01", x: 85, y: 60, velocidade: 44, direcao: 230 },
  { id: "v13", numero: "013", placa: "BNU-3M56", modelo: "Toyota Hilux", ano: 2019, km: 241800, unidade: "10º BPM – Centro", status: "manutenção", ultimaRevisao: "2024-07-20", proximaRevisao: "2025-01-20", x: 0, y: 0, velocidade: 0, direcao: 0 },
  { id: "v14", numero: "014", placa: "BNU-4N67", modelo: "Jeep Commander", ano: 2024, km: 8900, unidade: "Comando BPTUR", status: "operação", ultimaRevisao: "2025-04-10", proximaRevisao: "2025-10-10", x: 40, y: 48, velocidade: 90, direcao: 135 },
  { id: "v15", numero: "015", placa: "BNU-5O78", modelo: "Ford Ranger XLS", ano: 2022, km: 79500, unidade: "Comando BPTUR", status: "operação", ultimaRevisao: "2025-02-18", proximaRevisao: "2025-08-18", x: 15, y: 55, velocidade: 37, direcao: 280 },
];

export const manutencaoItens: ManutencaoItem[] = [
  { id: "m01", item: "Troca de óleo e filtro", frequencia: "A cada 10.000 km", frequenciaKm: 10000, ultimaData: "2025-03-10", ultimoKm: 80000, proximaData: "2025-08-10", proximoKm: 90000, status: "ok" },
  { id: "m02", item: "Revisão dos freios", frequencia: "A cada 20.000 km", frequenciaKm: 20000, ultimaData: "2025-01-15", ultimoKm: 70000, proximaData: "2025-09-15", proximoKm: 90000, status: "ok" },
  { id: "m03", item: "Alinhamento e balanceamento", frequencia: "A cada 15.000 km", frequenciaKm: 15000, ultimaData: "2024-12-20", ultimoKm: 75000, proximaData: "2025-06-20", proximoKm: 90000, status: "alerta" },
  { id: "m04", item: "Troca de pneus", frequencia: "Conforme desgaste", ultimaData: "2024-08-05", ultimoKm: 55000, proximaData: "2025-08-05", proximoKm: 95000, status: "ok" },
  { id: "m05", item: "Revisão elétrica", frequencia: "A cada 6 meses", frequenciaMeses: 6, ultimaData: "2024-09-01", ultimoKm: 60000, proximaData: "2025-03-01", proximoKm: 0, status: "vencida" },
  { id: "m06", item: "Revisão geral", frequencia: "Anual", frequenciaMeses: 12, ultimaData: "2024-04-15", ultimoKm: 40000, proximaData: "2025-04-15", proximoKm: 0, status: "alerta" },
  { id: "m07", item: "Troca de filtro de ar", frequencia: "A cada 20.000 km", frequenciaKm: 20000, ultimaData: "2025-02-01", ultimoKm: 68000, proximaData: "2025-10-01", proximoKm: 88000, status: "ok" },
  { id: "m08", item: "Troca de filtro de combustível", frequencia: "A cada 30.000 km", frequenciaKm: 30000, ultimaData: "2024-11-10", ultimoKm: 58000, proximaData: "2025-11-10", proximoKm: 88000, status: "ok" },
  { id: "m09", item: "Verificação do sistema de arrefecimento", frequencia: "A cada 6 meses", frequenciaMeses: 6, ultimaData: "2024-10-20", ultimoKm: 65000, proximaData: "2025-04-20", proximoKm: 0, status: "alerta" },
  { id: "m10", item: "Troca de correia dentada", frequencia: "A cada 60.000 km", frequenciaKm: 60000, ultimaData: "2024-06-30", ultimoKm: 30000, proximaData: "2026-06-30", proximoKm: 90000, status: "ok" },
];

export const ordensServico: OrdemServico[] = [
  { id: "os01", numero: "OS-2025-001", data: "2025-06-28", viaturaId: "v02", viatura: "002 – BNU-2B45 Ford Ranger", problema: "Falha no sistema de freios traseiros – ruído ao frear", servico: "Substituição das pastilhas e discos traseiros", responsavel: "Sgt. Pereira", pecas: "Pastilhas Bosch, Discos traseiros", custo: 1850.00, tempoParada: 2, status: "andamento" },
  { id: "os02", numero: "OS-2025-002", data: "2025-06-25", viaturaId: "v08", viatura: "008 – BNU-8H01 Chevrolet S10", problema: "Motor com superaquecimento intermitente", servico: "Substituição do radiador e mangueiras", responsavel: "Cb. Santos", pecas: "Radiador original, mangueiras superiores e inferiores", custo: 3240.00, tempoParada: 3, status: "andamento" },
  { id: "os03", numero: "OS-2025-003", data: "2025-06-20", viaturaId: "v13", viatura: "013 – BNU-3M56 Toyota Hilux", problema: "Caixa de câmbio com dificuldade nas trocas de marcha", servico: "Revisão e troca de óleo da caixa de câmbio", responsavel: "Sgt. Pereira", pecas: "Óleo Dexron VI 4L", custo: 890.00, tempoParada: 1, status: "finalizada" },
  { id: "os04", numero: "OS-2025-004", data: "2025-06-15", viaturaId: "v05", viatura: "005 – BNU-5E78 Toyota Corolla", problema: "Acidente de trânsito – dano na lataria dianteira", servico: "Reparo de lataria, pintura e troca do para-choque", responsavel: "Of. Lima", pecas: "Para-choque dianteiro, faróis LED", custo: 7600.00, tempoParada: 12, status: "andamento" },
  { id: "os05", numero: "OS-2025-005", data: "2025-06-10", viaturaId: "v11", viatura: "011 – BNU-1K34 Mitsubishi L200", problema: "Suspensão traseira com barulho – molas comprometidas", servico: "Substituição do conjunto de molas traseiras e amortecedores", responsavel: "Cb. Santos", pecas: "Kit suspensão traseira Monroe", custo: 2980.00, tempoParada: 4, status: "finalizada" },
  { id: "os06", numero: "OS-2025-006", data: "2025-06-05", viaturaId: "v01", viatura: "001 – BNU-1A34 Toyota Hilux SW4", problema: "Revisão preventiva 80.000 km", servico: "Troca de óleo, filtros, velas e correia auxiliar", responsavel: "Sgt. Pereira", pecas: "Óleo Mobil 5W30, filtros, velas NGK, correia", custo: 1420.00, tempoParada: 1, status: "finalizada" },
  { id: "os07", numero: "OS-2025-007", data: "2025-05-28", viaturaId: "v03", viatura: "003 – BNU-3C56 Chevrolet S10", problema: "Falha na injeção eletrônica – luz de diagnóstico acesa", servico: "Diagnóstico eletrônico e limpeza dos injetores", responsavel: "Of. Lima", pecas: "Limpeza injetores", custo: 650.00, tempoParada: 1, status: "finalizada" },
  { id: "os08", numero: "OS-2025-008", data: "2025-06-30", viaturaId: "v06", viatura: "006 – BNU-6F89 Ford Ranger", problema: "Troca de pneus – desgaste irregular dianteiro", servico: "Substituição dos 4 pneus e alinhamento", responsavel: "Cb. Santos", pecas: "4x Pneu Pirelli Scorpion 265/70 R17", custo: 4200.00, tempoParada: 1, status: "aberta" },
];

export const historico: HistoricoItem[] = [
  { id: "h01", viaturaId: "v01", data: "2025-06-05", tipo: "preventiva", servico: "Revisão 80.000 km – óleo, filtros, velas", custo: 1420, responsavel: "Sgt. Pereira", km: 80000, pecas: ["Óleo Mobil 5W30 6L", "Filtro de óleo", "Filtro de ar", "4x Vela NGK"] },
  { id: "h02", viaturaId: "v01", data: "2025-01-15", tipo: "preventiva", servico: "Troca de óleo 70.000 km", custo: 380, responsavel: "Cb. Santos", km: 70000, pecas: ["Óleo Mobil 5W30 6L", "Filtro de óleo"] },
  { id: "h03", viaturaId: "v01", data: "2024-08-20", tipo: "corretiva", servico: "Reparo no sistema de ar-condicionado", custo: 1200, responsavel: "Of. Lima", km: 62000, pecas: ["Compressor A/C", "Gás R134a"] },
  { id: "h04", viaturaId: "v02", data: "2025-06-28", tipo: "corretiva", servico: "Substituição pastilhas e discos traseiros", custo: 1850, responsavel: "Sgt. Pereira", km: 124300, pecas: ["Pastilhas Bosch", "2x Disco traseiro"] },
  { id: "h05", viaturaId: "v02", data: "2025-02-10", tipo: "preventiva", servico: "Revisão 120.000 km completa", custo: 2800, responsavel: "Cb. Santos", km: 120000, pecas: ["Óleo, filtros, correias", "Fluido de freio DOT4", "Velas"] },
  { id: "h06", viaturaId: "v03", data: "2025-05-28", tipo: "corretiva", servico: "Diagnóstico e limpeza dos injetores", custo: 650, responsavel: "Of. Lima", km: 155000, pecas: ["Limpeza ultrassônica injetores"] },
  { id: "h07", viaturaId: "v03", data: "2025-01-08", tipo: "preventiva", servico: "Troca de óleo e filtros 150.000 km", custo: 520, responsavel: "Sgt. Pereira", km: 150000, pecas: ["Óleo Castrol 10W40 6L", "Filtro de óleo", "Filtro de ar"] },
  { id: "h08", viaturaId: "v04", data: "2025-03-05", tipo: "preventiva", servico: "Revisão 30.000 km", custo: 890, responsavel: "Cb. Santos", km: 30000, pecas: ["Óleo VW 5W30", "Filtros", "Fluido de freio"] },
  { id: "h09", viaturaId: "v05", data: "2025-06-15", tipo: "corretiva", servico: "Reparo de lataria – acidente", custo: 7600, responsavel: "Of. Lima", km: 98600, pecas: ["Para-choque dianteiro", "Faróis LED", "Pintura"] },
  { id: "h10", viaturaId: "v06", data: "2025-04-12", tipo: "preventiva", servico: "Troca de óleo e revisão geral", custo: 680, responsavel: "Sgt. Pereira", km: 70000, pecas: ["Óleo Ford 5W30 6L", "Filtro de óleo", "Filtro de ar"] },
  { id: "h11", viaturaId: "v08", data: "2025-06-25", tipo: "corretiva", servico: "Substituição do radiador", custo: 3240, responsavel: "Cb. Santos", km: 188450, pecas: ["Radiador original GM", "Mangueiras superiores", "Mangueiras inferiores"] },
  { id: "h12", viaturaId: "v13", data: "2025-06-20", tipo: "corretiva", servico: "Revisão caixa de câmbio", custo: 890, responsavel: "Sgt. Pereira", km: 241800, pecas: ["Óleo Dexron VI 4L"] },
];

export const usuarios: Usuario[] = [
  { id: "u01", nome: "Ten. Col. Rodrigo Alves", matricula: "PM-10001", email: "rodrigo.alves@pm.sc.gov.br", role: "administrador", unidade: "Comando 10º BPM", ativo: true },
  { id: "u02", nome: "Maj. Fernanda Costa", matricula: "PM-10045", email: "fernanda.costa@pm.sc.gov.br", role: "gestor", unidade: "10º BPM – Centro", ativo: true },
  { id: "u03", nome: "Cap. Eduardo Braga", matricula: "PM-10078", email: "eduardo.braga@pm.sc.gov.br", role: "gestor", unidade: "1ª CIPM – Garcia", ativo: true },
  { id: "u04", nome: "Sgt. Carlos Pereira", matricula: "PM-10234", email: "carlos.pereira@pm.sc.gov.br", role: "mecanico", unidade: "Oficina Central", ativo: true },
  { id: "u05", nome: "Cb. Marcos Santos", matricula: "PM-10567", email: "marcos.santos@pm.sc.gov.br", role: "mecanico", unidade: "Oficina Central", ativo: true },
  { id: "u06", nome: "Of. Rafael Lima", matricula: "PM-10890", email: "rafael.lima@pm.sc.gov.br", role: "mecanico", unidade: "Oficina Central", ativo: true },
  { id: "u07", nome: "Sd. Ana Souza", matricula: "PM-11234", email: "ana.souza@pm.sc.gov.br", role: "policial", unidade: "2ª CIPM – Velha", ativo: true },
  { id: "u08", nome: "Sd. João Ferreira", matricula: "PM-11345", email: "joao.ferreira@pm.sc.gov.br", role: "policial", unidade: "3ª CIPM – Itoupava", ativo: true },
  { id: "u09", nome: "Cb. Patricia Nunes", matricula: "PM-11567", email: "patricia.nunes@pm.sc.gov.br", role: "policial", unidade: "4ª CIPM – Ponta Aguda", ativo: false },
  { id: "u10", nome: "Sgt. Ricardo Mendes", matricula: "PM-11890", email: "ricardo.mendes@pm.sc.gov.br", role: "gestor", unidade: "5ª CIPM – Fortaleza", ativo: true },
];

export const manutencoesMensais = [
  { mes: "Jan", preventiva: 8, corretiva: 3, custo: 12400 },
  { mes: "Fev", preventiva: 6, corretiva: 5, custo: 18700 },
  { mes: "Mar", preventiva: 9, corretiva: 2, custo: 9800 },
  { mes: "Abr", preventiva: 7, corretiva: 4, custo: 15200 },
  { mes: "Mai", preventiva: 11, corretiva: 3, custo: 11600 },
  { mes: "Jun", preventiva: 5, corretiva: 6, custo: 21900 },
];

export const disponibilidadeMensal = [
  { mes: "Jan", disponibilidade: 86 },
  { mes: "Fev", disponibilidade: 80 },
  { mes: "Mar", disponibilidade: 91 },
  { mes: "Abr", disponibilidade: 84 },
  { mes: "Mai", disponibilidade: 88 },
  { mes: "Jun", disponibilidade: 80 },
];
