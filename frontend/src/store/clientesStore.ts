import { create } from 'zustand';
import * as clientesApi from '../api/clientes';
import type { Cliente } from '../types';

interface ClientesState {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  fetchClientes: () => Promise<void>;
  addCliente: (cliente: Omit<Cliente, 'id'>) => Promise<Cliente>;
  editCliente: (id: string, cliente: Partial<Omit<Cliente, 'id'>>) => Promise<void>;
}

export const useClientesStore = create<ClientesState>((set, get) => ({
  clientes: [],
  loading: false,
  error: null,

  fetchClientes: async () => {
    set({ loading: true, error: null });
    try {
      const clientes = await clientesApi.getClientes();
      set({ clientes, loading: false });
    } catch (err: any) {
      set({ error: 'No se pudieron cargar los clientes', loading: false });
    }
  },

  addCliente: async (cliente) => {
    const nuevo = await clientesApi.createCliente(cliente);
    set({ clientes: [...get().clientes, nuevo] });
    return nuevo;
  },

  editCliente: async (id, cliente) => {
    const actualizado = await clientesApi.updateCliente(id, cliente);
    set({ clientes: get().clientes.map((c) => (c.id === id ? actualizado : c)) });
  },
}));
