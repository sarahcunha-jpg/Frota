import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  HistoricoItem,
  ManutencaoItem,
  OrdemServico,
  OSStatus,
  Usuario,
  UserRole,
  Viatura,
  manutencaoItens as seedManutencaoItens,
  historico as seedHistorico,
  ordensServico as seedOrdensServico,
  usuarios as seedUsuarios,
  viaturas as seedViaturas,
} from "../data/mockData";
import { addDays, buildOrderLabel, deriveMaintenanceStatus, todayIso } from "../lib/fleet";

interface FleetState {
  viaturas: Viatura[];
  manutencaoItens: ManutencaoItem[];
  ordensServico: OrdemServico[];
  historico: HistoricoItem[];
  usuarios: Usuario[];
}

interface MaintenancePayload {
  viaturaId?: string;
  item: string;
  frequencia: string;
  ultimaData: string;
  ultimoKm: number;
  proximaData: string;
  proximoKm: number;
}

interface OrderPayload {
  viaturaId: string;
  problema: string;
  servico: string;
  responsavel: string;
  pecas: string;
  custo: number;
  tempoParada: number;
}

interface FleetContextValue extends FleetState {
  currentUser: Usuario | null;
  login: (userId: string, matricula: string) => boolean;
  logout: () => void;
  addViatura: (payload: Omit<Viatura, "id">) => void;
  updateViatura: (id: string, payload: Partial<Viatura>) => void;
  deleteViatura: (id: string) => void;
  saveMaintenanceItem: (payload: MaintenancePayload & { id?: string }) => void;
  addOrder: (payload: OrderPayload) => void;
  advanceOrder: (id: string) => void;
  finalizeOrder: (id: string) => void;
  addUser: (payload: Omit<Usuario, "id" | "ativo">) => void;
  toggleUser: (id: string) => void;
}

const STORAGE_KEY = "frota-mvp-store-v1";
const SESSION_KEY = "frota-mvp-session-v1";

const defaultState: FleetState = {
  viaturas: seedViaturas,
  manutencaoItens: seedManutencaoItens,
  ordensServico: seedOrdensServico,
  historico: seedHistorico,
  usuarios: seedUsuarios,
};

const FleetContext = createContext<FleetContextValue | null>(null);

function cloneDefaultState(): FleetState {
  return JSON.parse(JSON.stringify(defaultState));
}

function loadState(): FleetState {
  if (typeof window === "undefined") return cloneDefaultState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneDefaultState();

  try {
    const parsed = JSON.parse(raw) as Partial<FleetState>;
    return {
      viaturas: parsed.viaturas ?? cloneDefaultState().viaturas,
      manutencaoItens: parsed.manutencaoItens ?? cloneDefaultState().manutencaoItens,
      ordensServico: parsed.ordensServico ?? cloneDefaultState().ordensServico,
      historico: parsed.historico ?? cloneDefaultState().historico,
      usuarios: parsed.usuarios ?? cloneDefaultState().usuarios,
    };
  } catch {
    return cloneDefaultState();
  }
}

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FleetState>(loadState);
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(SESSION_KEY);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentUserId) window.localStorage.setItem(SESSION_KEY, currentUserId);
    else window.localStorage.removeItem(SESSION_KEY);
  }, [currentUserId]);

  const currentUser = useMemo(() => {
    const found = state.usuarios.find((user) => user.id === currentUserId && user.ativo);
    return found ?? null;
  }, [currentUserId, state.usuarios]);

  useEffect(() => {
    if (currentUserId && !currentUser) {
      setCurrentUserId(null);
    }
  }, [currentUserId, currentUser]);

  const value = useMemo<FleetContextValue>(() => ({
    ...state,
    currentUser,
    login: (userId, matricula) => {
      const user = state.usuarios.find((item) => item.id === userId && item.ativo);
      if (!user) return false;
      const ok = user.matricula.trim().toLowerCase() === matricula.trim().toLowerCase();
      if (ok) setCurrentUserId(user.id);
      return ok;
    },
    logout: () => setCurrentUserId(null),
    addViatura: (payload) => {
      setState((prev) => ({
        ...prev,
        viaturas: [...prev.viaturas, { ...payload, id: `v${Date.now()}` }],
      }));
    },
    updateViatura: (id, payload) => {
      setState((prev) => ({
        ...prev,
        viaturas: prev.viaturas.map((viatura) => (viatura.id === id ? { ...viatura, ...payload } : viatura)),
      }));
    },
    deleteViatura: (id) => {
      setState((prev) => ({
        ...prev,
        viaturas: prev.viaturas.filter((viatura) => viatura.id !== id),
        manutencaoItens: prev.manutencaoItens.filter((item) => item.viaturaId !== id),
        ordensServico: prev.ordensServico.filter((order) => order.viaturaId !== id),
        historico: prev.historico.filter((item) => item.viaturaId !== id),
      }));
    },
    saveMaintenanceItem: ({ id, ...payload }) => {
      const normalized: ManutencaoItem = {
        id: id ?? `m${Date.now()}`,
        ...payload,
        status: deriveMaintenanceStatus(payload),
      };

      setState((prev) => ({
        ...prev,
        manutencaoItens: id
          ? prev.manutencaoItens.map((item) => (item.id === id ? normalized : item))
          : [...prev.manutencaoItens, normalized],
      }));
    },
    addOrder: (payload) => {
      setState((prev) => {
        const viatura = prev.viaturas.find((item) => item.id === payload.viaturaId);
        if (!viatura) return prev;

        const newOrder: OrdemServico = {
          id: `os${Date.now()}`,
          numero: buildOrderLabel(prev.ordensServico.length + 1),
          data: todayIso(),
          viaturaId: payload.viaturaId,
          viatura: `${viatura.numero} – ${viatura.placa} ${viatura.modelo}`,
          problema: payload.problema,
          servico: payload.servico,
          responsavel: payload.responsavel,
          pecas: payload.pecas,
          custo: payload.custo,
          tempoParada: payload.tempoParada,
          status: "aberta",
        };

        return {
          ...prev,
          ordensServico: [newOrder, ...prev.ordensServico],
          viaturas: prev.viaturas.map((item) =>
            item.id === payload.viaturaId ? { ...item, status: "manutenção" } : item,
          ),
        };
      });
    },
    advanceOrder: (id) => {
      setState((prev) => ({
        ...prev,
        ordensServico: prev.ordensServico.map((order) =>
          order.id === id && order.status === "aberta" ? { ...order, status: "andamento" } : order,
        ),
      }));
    },
    finalizeOrder: (id) => {
      setState((prev) => {
        const order = prev.ordensServico.find((item) => item.id === id);
        if (!order || order.status === "finalizada") return prev;

        const isPreventive = /revis|prevent|troca de óleo|alinhamento|pneu/i.test(`${order.problema} ${order.servico}`);
        const pieces = order.pecas
          .split(",")
          .map((piece) => piece.trim())
          .filter(Boolean);

        return {
          ...prev,
          ordensServico: prev.ordensServico.map((item) =>
            item.id === id ? { ...item, status: "finalizada" as OSStatus } : item,
          ),
          viaturas: prev.viaturas.map((item) =>
            item.id === order.viaturaId
              ? {
                  ...item,
                  status: "operação",
                  ultimaRevisao: todayIso(),
                  proximaRevisao: addDays(todayIso(), isPreventive ? 180 : 90),
                }
              : item,
          ),
          historico: [
            {
              id: `h${Date.now()}`,
              viaturaId: order.viaturaId,
              data: todayIso(),
              tipo: isPreventive ? "preventiva" : "corretiva",
              servico: order.servico,
              custo: order.custo,
              responsavel: order.responsavel,
              km: prev.viaturas.find((item) => item.id === order.viaturaId)?.km ?? 0,
              pecas: pieces,
            },
            ...prev.historico,
          ],
        };
      });
    },
    addUser: (payload) => {
      setState((prev) => ({
        ...prev,
        usuarios: [...prev.usuarios, { id: `u${Date.now()}`, ...payload, ativo: true }],
      }));
    },
    toggleUser: (id) => {
      setState((prev) => ({
        ...prev,
        usuarios: prev.usuarios.map((user) =>
          user.id === id ? { ...user, ativo: !user.ativo } : user,
        ),
      }));
      if (currentUserId === id) {
        setCurrentUserId(null);
      }
    },
  }), [currentUser, currentUserId, state]);

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error("useFleet must be used within FleetProvider");
  }
  return context;
}

export type { FleetState, OrderPayload };
