export type Rol = 'Admin' | 'Cocina' | 'Domiciliario';

export interface Usuario {
  id: string;
  email: string;
  passwordHash: string;
  rol: Rol;
  nombre: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface Producto {
  id: string;
  nombre: string;
}

export interface ItemPedido {
  productoId: string;
  cantidad: number;
  nombre: string;
}

export type TipoEntrega = 'Domicilio' | 'Local';
export type EstadoPedido = 'Pendiente' | 'Listo' | 'Entregado' | 'Cancelado';

export interface Pedido {
  id: string;
  clienteId: string;
  clienteNombre: string;
  items: ItemPedido[];
  tipoEntrega: TipoEntrega;
  direccion: string;
  direccionAlternativa?: string;
  nombreAlternativo?: string;
  fechaCreacion: string;
  fechaEntrega: string;
  estado: EstadoPedido;
  llevaTarjeta: boolean;
  notas?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  rol: Rol;
  nombre: string;
}
