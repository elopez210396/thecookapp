import type { Pedido } from '../../types';
import { formatItemPedido } from '../../utils/formatting';
import { formatFechaEntrega } from '../../utils/dates';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface PedidoDetailProps {
  pedido: Pedido;
  onClose: () => void;
  onEditar?: () => void;
  onCancelar?: () => void;
  onAbrirMaps?: () => void;
  onEntregado?: () => void;
}

export default function PedidoDetail({ pedido, onClose, onEditar, onCancelar, onAbrirMaps, onEntregado }: PedidoDetailProps) {
  return (
    <Modal title={pedido.clienteNombre} onClose={onClose}>
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-semibold text-gray-500">Items</p>
          <ul className="mt-1 space-y-0.5">
            {pedido.items.map((item, i) => (
              <li key={i}>• {formatItemPedido(item)}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-500">Entrega</p>
          <p>
            {pedido.tipoEntrega === 'Local' ? (
              <span className="font-bold text-red-600">PARA RECOGER EN LOCAL</span>
            ) : (
              'A domicilio'
            )}
          </p>
          <p>{formatFechaEntrega(pedido.fechaEntrega)}</p>
        </div>

        {pedido.tipoEntrega === 'Domicilio' && (
          <div>
            <p className="font-semibold text-gray-500">Dirección</p>
            <p>{pedido.direccionAlternativa || pedido.direccion}</p>
            {pedido.nombreAlternativo && <p>Entregar a: {pedido.nombreAlternativo}</p>}
          </div>
        )}

        {pedido.clienteTelefono && (
          <div>
            <p className="font-semibold text-gray-500">Teléfono</p>
            <p>{pedido.clienteTelefono}</p>
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-500">¿Lleva tarjeta?</p>
          <p>{pedido.llevaTarjeta ? '🎴 Sí' : 'No'}</p>
        </div>

        {pedido.textoTarjeta && (
          <div>
            <p className="font-semibold text-gray-500">Texto de la Tarjeta</p>
            <p>{pedido.textoTarjeta}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {onEditar && <Button variant="secondary" onClick={onEditar}>Editar</Button>}
          {onCancelar && <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>}
          {onAbrirMaps && <Button variant="secondary" onClick={onAbrirMaps}>ABRIR EN MAPS</Button>}
          {onEntregado && <Button variant="primary" onClick={onEntregado}>ENTREGADO</Button>}
          <Button variant="ghost" onClick={onClose}>Volver</Button>
        </div>
      </div>
    </Modal>
  );
}
