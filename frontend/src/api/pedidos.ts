import { apiClient } from './client';
import type { Pedido } from '../types';

export async function getPedidos(): Promise<Pedido[]> {
  const { data } = await apiClient.get<Pedido[]>('/pedidos');
  return data;
}

export async function createPedido(pedido: Omit<Pedido, 'id' | 'fechaCreacion' | 'estado'>): Promise<Pedido> {
  const { data } = await apiClient.post<Pedido>('/pedidos', pedido);
  return data;
}

export async function updatePedido(id: string, pedido: Partial<Pedido>): Promise<Pedido> {
  const { data } = await apiClient.put<Pedido>(`/pedidos/${id}`, pedido);
  return data;
}

export async function cambiarEstadoPedido(id: string, estado: Pedido['estado']): Promise<Pedido> {
  const { data } = await apiClient.patch<Pedido>(`/pedidos/${id}/estado`, { estado });
  return data;
}
