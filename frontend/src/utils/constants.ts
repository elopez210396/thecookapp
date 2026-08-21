export const ESTADOS_PEDIDO = ['Pendiente', 'Listo', 'Entregado', 'Cancelado'] as const;

export const ROLES_HOME: Record<string, string> = {
  Admin: '/admin',
  Cocina: '/cocina',
  Domiciliario: '/domiciliario',
};

export const TOKEN_KEY = 'the-cook-token';
export const USER_KEY = 'the-cook-user';
