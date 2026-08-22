import type { Pedido } from '../../types';
import { formatFechaEntrega } from '../../utils/dates';
import { calcularTotalPedido, formatItemPedido, formatMoney } from '../../utils/formatting';
import Button from '../common/Button';

export type PedidoCardVariant = 'admin' | 'cocina' | 'domiciliario';

interface PedidoCardProps {
  pedido: Pedido;
  variant: PedidoCardVariant;
  onVerMas?: () => void;
  onEditar?: () => void;
  onCancelar?: () => void;
  onMarcarListo?: () => void;
  onQuitarListo?: () => void;
  onAbrirMaps?: () => void;
  onEntregado?: () => void;
}

export default function PedidoCard({
  pedido,
  variant,
  onVerMas,
  onEditar,
  onCancelar,
  onMarcarListo,
  onQuitarListo,
  onAbrirMaps,
  onEntregado,
}: PedidoCardProps) {
  const esParaRecoger = pedido.tipoEntrega === 'Local';

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className={variant === 'cocina' ? 'text-lg font-extrabold' : 'font-bold'}>{pedido.clienteNombre}</h3>
        {pedido.llevaTarjeta && <span title="Lleva tarjeta">🎴</span>}
      </div>

      <ul className="mt-1 space-y-0.5 text-sm text-gray-700">
        {pedido.items.map((item, i) => (
          <li key={i}>{formatItemPedido(item)}</li>
        ))}
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-gray-600">{formatFechaEntrega(pedido.fechaEntrega)}</span>
        {variant === 'admin' && (
          <>
            <span className="text-gray-400">| {pedido.tipoEntrega.toUpperCase()}</span>
            <span className="font-semibold text-gray-800">{formatMoney(calcularTotalPedido(pedido))}</span>
          </>
        )}
        {variant === 'cocina' && esParaRecoger && (
          <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">🔴 PARA RECOGER</span>
        )}
      </div>

      {(variant === 'domiciliario' || (variant === 'admin' && pedido.tipoEntrega === 'Domicilio')) && (
        <div className="mt-2 space-y-1 text-sm text-gray-700">
          <p>{pedido.direccion}</p>
          {pedido.nombreEntrega && <p>Entregar a: {pedido.nombreEntrega}</p>}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {variant === 'admin' && (
          <>
            <Button variant="secondary" onClick={onEditar}>EDITAR</Button>
            <Button variant="secondary" onClick={onCancelar}>CANCELAR</Button>
            {pedido.estado === 'Pendiente' && (
              <Button variant="primary" onClick={onMarcarListo}>LISTO</Button>
            )}
            {pedido.estado === 'Listo' && (
              <>
                <Button variant="secondary" onClick={onQuitarListo}>QUITAR LISTO</Button>
                <Button variant="primary" onClick={onEntregado}>ENTREGADO</Button>
              </>
            )}
            {pedido.tipoEntrega === 'Domicilio' && (
              <Button variant="secondary" onClick={onAbrirMaps}>ABRIR EN MAPS</Button>
            )}
          </>
        )}

        {variant === 'cocina' && pedido.estado === 'Pendiente' && (
          <>
            <Button variant="primary" onClick={onMarcarListo}>LISTO</Button>
            <Button variant="secondary" onClick={onVerMas}>VER MÁS</Button>
          </>
        )}
        {variant === 'cocina' && pedido.estado === 'Listo' && (
          <>
            <Button variant="secondary" onClick={onQuitarListo}>QUITAR LISTO</Button>
            <Button variant="secondary" onClick={onVerMas}>VER MÁS</Button>
          </>
        )}

        {variant === 'domiciliario' && (
          <>
            <Button variant="secondary" onClick={onAbrirMaps}>ABRIR EN MAPS</Button>
            <Button variant="secondary" onClick={onVerMas}>VER DETALLES</Button>
            {pedido.estado === 'Listo' && (
              <Button variant="primary" onClick={onEntregado}>ENTREGADO</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
