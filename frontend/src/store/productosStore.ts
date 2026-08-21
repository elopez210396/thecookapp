import { create } from 'zustand';
import * as productosApi from '../api/productos';
import type { Producto } from '../types';

interface ProductosState {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  fetchProductos: () => Promise<void>;
}

export const useProductosStore = create<ProductosState>((set) => ({
  productos: [],
  loading: false,
  error: null,

  fetchProductos: async () => {
    set({ loading: true, error: null });
    try {
      const productos = await productosApi.getProductos();
      set({ productos, loading: false });
    } catch (err: any) {
      set({ error: 'No se pudieron cargar los productos', loading: false });
    }
  },
}));
