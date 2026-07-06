import { UserRole } from "../data/mockData";

export type AppTabId = "dashboard" | "viaturas" | "preventiva" | "os" | "historico" | "rastreamento" | "kpis" | "relatorios" | "usuarios";

const TAB_ACCESS: Record<AppTabId, UserRole[]> = {
  dashboard: ["administrador", "gestor", "mecanico", "policial"],
  viaturas: ["administrador", "gestor", "mecanico", "policial"],
  preventiva: ["administrador", "gestor", "mecanico", "policial"],
  os: ["administrador", "gestor", "mecanico", "policial"],
  historico: ["administrador", "gestor", "mecanico", "policial"],
  rastreamento: ["administrador", "gestor"],
  kpis: ["administrador", "gestor"],
  relatorios: ["administrador", "gestor"],
  usuarios: ["administrador"],
};

export function canAccessTab(role: UserRole, tab: AppTabId) {
  return TAB_ACCESS[tab].includes(role);
}

export function canManageViaturas(role: UserRole) {
  return role === "administrador";
}

export function canManagePreventiva(role: UserRole) {
  return role === "administrador" || role === "gestor" || role === "mecanico";
}

export function canManageUsers(role: UserRole) {
  return role === "administrador";
}

export function canManageOrders(role: UserRole) {
  return role === "administrador" || role === "gestor" || role === "mecanico";
}

export function canFinalizeOrders(role: UserRole) {
  return role === "administrador" || role === "gestor" || role === "mecanico";
}

export function canOpenMaintenanceRequest(role: UserRole) {
  return role === "administrador" || role === "gestor" || role === "mecanico" || role === "policial";
}

export function canTrack(role: UserRole) {
  return role === "administrador" || role === "gestor";
}

export function canExportReports(role: UserRole) {
  return role === "administrador" || role === "gestor";
}
