import type { Pedido } from '../../types';
import PedidoCard, { type PedidoCardVariant } from './PedidoCard';

interface PedidoListProps {
  pedidos: Pedido[];
  variant: PedidoCardVariant;
  emptyMessage?: string;
  onVerMas?: (pedido: Pedido) => void;
  onEditar?: (pedido: Pedido) => void;
  onCancelar?: (pedido: Pedido) => void;
  onMarcarListo?: (pedido: Pedido) => void;
  onQuitarListo?: (pedido: Pedido) => void;
  onAbrirMaps?: (pedido: Pedido) => void;
  onEntregado?: (pedido: Pedido) => void;
}

export default function PedidoList({
  pedidos,
  variant,
  emptyMessage = 'No hay pedidos por mostrar',
  onVerMas,
  onEditar,
  onCancelar,
  onMarcarListo,
  onQuitarListo,
  onAbrirMaps,
  onEntregado,
}: PedidoListProps) {
  const ordenados = [...pedidos].sort(
    (a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime(),
  );

  if (ordenados.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-400">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3 p-4">
      {ordenados.map((pedido) => (
        <PedidoCard
          key={pedido.id}
          pedido={pedido}
          variant={variant}
          onVerMas={() => onVerMas?.(pedido)}
          onEditar={() => onEditar?.(pedido)}
          onCancelar={() => onCancelar?.(pedido)}
          onMarcarListo={() => onMarcarListo?.(pedido)}
          onQuitarListo={() => onQuitarListo?.(pedido)}
          onAbrirMaps={() => onAbrirMaps?.(pedido)}
          onEntregado={() => onEntregado?.(pedido)}
        />
      ))}
    </div>
  );
}
