import type { ItemPedido, Pedido, Producto } from '../types';
import { COSTO_DOMICILIO } from './constants';

export function formatProducto(producto: Producto): string {
  if (producto.unidad === 'unidad') return producto.nombre;
  if (producto.unidad === 'unidades') return `${producto.nombre} x${producto.cantidad}`;
  return `${producto.nombre} ${producto.cantidad} ${producto.unidad}`;
}

export function formatItemPedido(item: ItemPedido): string {
  return item.sabor ? `${item.cantidad} ${item.nombre} (${item.sabor})` : `${item.cantidad} ${item.nombre}`;
}

export function formatTelefono(telefono: string): string {
  return telefono;
}

export function formatMoney(valor: number): string {
  return `$${valor.toLocaleString('es-CO')}`;
}

export function calcularTotalPedido(pedido: Pedido): number {
  const totalItems = pedido.items.reduce((acc, item) => acc + item.cantidad * (item.precioUnitario ?? 0), 0);
  const domicilio = pedido.tipoEntrega === 'Domicilio' ? COSTO_DOMICILIO : 0;
  return totalItems + domicilio;
}
