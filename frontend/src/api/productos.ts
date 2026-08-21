import { apiClient } from './client';
import type { Producto } from '../types';

export async function getProductos(): Promise<Producto[]> {
  const { data } = await apiClient.get<Producto[]>('/productos');
  return data;
}
