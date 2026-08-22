import { v4 as uuid } from 'uuid';
import { readSheet, appendRow, updateRowById } from './sheets.js';
import type { Pedido, ItemPedido } from '../types/index.js';

const SHEET_NAME = 'Pedidos';
const HEADERS = [
  'id',
  'cliente_id',
  'cliente_nombre',
  'items',
  'tipo_entrega',
  'direccion',
  'nombre_entrega',
  'fecha_creacion',
  'fecha_entrega',
  'estado',
  'lleva_tarjeta',
  'texto_tarjeta',
];

function rowToPedido(row: Record<string, string>): Pedido {
  let items: ItemPedido[] = [];
  try {
    items = JSON.parse(row.items || '[]');
  } catch {
    items = [];
  }

  return {
    id: row.id,
    clienteId: row.cliente_id,
    clienteNombre: row.cliente_nombre,
    items,
    tipoEntrega: row.tipo_entrega as Pedido['tipoEntrega'],
    direccion: row.direccion,
    nombreEntrega: row.nombre_entrega || undefined,
    fechaCreacion: row.fecha_creacion,
    fechaEntrega: row.fecha_entrega,
    estado: row.estado as Pedido['estado'],
    llevaTarjeta: row.lleva_tarjeta === 'TRUE' || row.lleva_tarjeta === 'true',
    textoTarjeta: row.texto_tarjeta || undefined,
  };
}

function pedidoToRow(pedido: Pedido): Record<string, string> {
  return {
    id: pedido.id,
    cliente_id: pedido.clienteId,
    cliente_nombre: pedido.clienteNombre,
    items: JSON.stringify(pedido.items),
    tipo_entrega: pedido.tipoEntrega,
    direccion: pedido.direccion,
    nombre_entrega: pedido.nombreEntrega || '',
    fecha_creacion: pedido.fechaCreacion,
    fecha_entrega: pedido.fechaEntrega,
    estado: pedido.estado,
    lleva_tarjeta: pedido.llevaTarjeta ? 'TRUE' : 'FALSE',
    texto_tarjeta: pedido.textoTarjeta || '',
  };
}

export async function getAllPedidos(): Promise<Pedido[]> {
  const rows = await readSheet(SHEET_NAME);
  return rows.map(rowToPedido);
}

export async function createPedido(data: Omit<Pedido, 'id' | 'fechaCreacion' | 'estado'>): Promise<Pedido> {
  const pedido: Pedido = {
    ...data,
    id: uuid(),
    fechaCreacion: new Date().toISOString(),
    estado: 'Pendiente',
  };

  await appendRow(SHEET_NAME, HEADERS, pedidoToRow(pedido));
  return pedido;
}

export async function updatePedido(id: string, data: Partial<Pedido>): Promise<Pedido> {
  const pedidos = await getAllPedidos();
  const existente = pedidos.find((p) => p.id === id);
  if (!existente) throw new Error('Pedido no encontrado');

  const actualizado: Pedido = { ...existente, ...data, id };
  await updateRowById(SHEET_NAME, HEADERS, id, pedidoToRow(actualizado));
  return actualizado;
}

export async function setEstadoPedido(id: string, estado: Pedido['estado']): Promise<Pedido> {
  return updatePedido(id, { estado });
}
