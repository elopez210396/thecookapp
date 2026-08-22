import { v4 as uuid } from 'uuid';
import { readSheet, appendRow, updateRowById } from './sheets.js';
import type { Pedido, ItemPedido } from '../types/index.js';

const SHEET_NAME = 'Pedidos';
const HEADERS = [
  'id',
  'clienteId',
  'clienteNombre',
  'items',
  'tipoEntrega',
  'direccion',
  'direccionAlternativa',
  'nombreAlternativo',
  'fechaCreacion',
  'fechaEntrega',
  'estado',
  'llevaTarjeta',
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
    clienteId: row.clienteId,
    clienteNombre: row.clienteNombre,
    items,
    tipoEntrega: row.tipoEntrega as Pedido['tipoEntrega'],
    direccion: row.direccion,
    direccionAlternativa: row.direccionAlternativa || undefined,
    nombreAlternativo: row.nombreAlternativo || undefined,
    fechaCreacion: row.fechaCreacion,
    fechaEntrega: row.fechaEntrega,
    estado: row.estado as Pedido['estado'],
    llevaTarjeta: row.llevaTarjeta === 'TRUE' || row.llevaTarjeta === 'true',
    textoTarjeta: row.texto_tarjeta || undefined,
  };
}

function pedidoToRow(pedido: Pedido): Record<string, string> {
  return {
    id: pedido.id,
    clienteId: pedido.clienteId,
    clienteNombre: pedido.clienteNombre,
    items: JSON.stringify(pedido.items),
    tipoEntrega: pedido.tipoEntrega,
    direccion: pedido.direccion,
    direccionAlternativa: pedido.direccionAlternativa || '',
    nombreAlternativo: pedido.nombreAlternativo || '',
    fechaCreacion: pedido.fechaCreacion,
    fechaEntrega: pedido.fechaEntrega,
    estado: pedido.estado,
    llevaTarjeta: pedido.llevaTarjeta ? 'TRUE' : 'FALSE',
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
