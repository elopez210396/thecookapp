import { create } from 'zustand';
import * as pedidosApi from '../api/pedidos';
import type { Pedido } from '../types';

interface PedidosState {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  fetchPedidos: () => Promise<void>;
  addPedido: (pedido: Omit<Pedido, 'id' | 'fechaCreacion' | 'estado'>) => Promise<Pedido>;
  editPedido: (id: string, pedido: Partial<Pedido>) => Promise<void>;
  setEstado: (id: string, estado: Pedido['estado']) => Promise<void>;
}

export const usePedidosStore = create<PedidosState>((set, get) => ({
  pedidos: [],
  loading: false,
  error: null,

  fetchPedidos: async () => {
    set({ loading: true, error: null });
    try {
      const pedidos = await pedidosApi.getPedidos();
      set({ pedidos, loading: false });
    } catch (err: any) {
      set({ error: 'No se pudieron cargar los pedidos', loading: false });
    }
  },

  addPedido: async (pedido) => {
    const nuevo = await pedidosApi.createPedido(pedido);
    set({ pedidos: [...get().pedidos, nuevo] });
    return nuevo;
  },

  editPedido: async (id, pedido) => {
    const actualizado = await pedidosApi.updatePedido(id, pedido);
    set({ pedidos: get().pedidos.map((p) => (p.id === id ? actualizado : p)) });
  },

  setEstado: async (id, estado) => {
    const prev = get().pedidos;
    // optimistic update
    set({ pedidos: prev.map((p) => (p.id === id ? { ...p, estado } : p)) });
    try {
      const actualizado = await pedidosApi.cambiarEstadoPedido(id, estado);
      set({ pedidos: get().pedidos.map((p) => (p.id === id ? actualizado : p)) });
    } catch (err) {
      set({ pedidos: prev, error: 'No se pudo actualizar el estado' });
    }
  },
}));
