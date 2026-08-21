import { apiClient } from './client';
import type { Cliente } from '../types';

export async function getClientes(): Promise<Cliente[]> {
  const { data } = await apiClient.get<Cliente[]>('/clientes');
  return data;
}

export async function createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
  const { data } = await apiClient.post<Cliente>('/clientes', cliente);
  return data;
}

export async function updateCliente(id: string, cliente: Partial<Omit<Cliente, 'id'>>): Promise<Cliente> {
  const { data } = await apiClient.put<Cliente>(`/clientes/${id}`, cliente);
  return data;
}
