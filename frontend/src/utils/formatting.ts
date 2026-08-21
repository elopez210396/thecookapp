import type { ItemPedido } from '../types';

export function formatItemPedido(item: ItemPedido): string {
  return `${item.cantidad} ${item.nombre}`;
}

export function formatTelefono(telefono: string): string {
  return telefono;
}
