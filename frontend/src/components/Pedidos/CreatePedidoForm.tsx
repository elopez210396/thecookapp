import { useEffect, useState } from 'react';
import type { Cliente, ItemPedido, Pedido, TipoEntrega } from '../../types';
import { useClientesStore } from '../../store/clientesStore';
import { useProductosStore } from '../../store/productosStore';
import { toDatetimeLocalValue } from '../../utils/dates';
import { formatProducto } from '../../utils/formatting';
import ClienteSelect from '../Clientes/ClienteSelect';
import ClienteForm from '../Clientes/ClienteForm';
import Button from '../common/Button';
import Modal from '../common/Modal';

export interface PedidoFormValues {
  clienteId: string;
  clienteNombre: string;
  items: ItemPedido[];
  tipoEntrega: TipoEntrega;
  direccion: string;
  direccionAlternativa?: string;
  nombreAlternativo?: string;
  fechaEntrega: string;
  llevaTarjeta: boolean;
  textoTarjeta?: string;
}

interface CreatePedidoFormProps {
  pedido?: Pedido;
  onSubmit: (values: PedidoFormValues) => Promise<void> | void;
  onCancel: () => void;
}

interface ItemDraft {
  productoId: string;
  cantidad: number;
  sabor?: string;
}

export default function CreatePedidoForm({ pedido, onSubmit, onCancel }: CreatePedidoFormProps) {
  const { clientes, fetchClientes, addCliente } = useClientesStore();
  const { productos, fetchProductos } = useProductosStore();

  const [clienteId, setClienteId] = useState<string | null>(pedido?.clienteId ?? null);
  const [mostrarNuevoCliente, setMostrarNuevoCliente] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>(
    pedido?.items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad, sabor: i.sabor })) ?? [
      { productoId: '', cantidad: 1 },
    ],
  );
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>(pedido?.tipoEntrega ?? 'Domicilio');
  const [usarOtraDireccion, setUsarOtraDireccion] = useState(!!pedido?.direccionAlternativa);
  const [direccionAlternativa, setDireccionAlternativa] = useState(pedido?.direccionAlternativa ?? '');
  const [nombreAlternativo, setNombreAlternativo] = useState(pedido?.nombreAlternativo ?? '');
  const [fechaEntrega, setFechaEntrega] = useState(
    pedido ? toDatetimeLocalValue(pedido.fechaEntrega) : '',
  );
  const [llevaTarjeta, setLlevaTarjeta] = useState(pedido?.llevaTarjeta ?? false);
  const [textoTarjeta, setTextoTarjeta] = useState(pedido?.textoTarjeta ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, [fetchClientes, fetchProductos]);

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId);

  const handleAgregarItem = () => setItems([...items, { productoId: '', cantidad: 1 }]);
  const handleQuitarItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const handleItemChange = (index: number, field: keyof ItemDraft, value: string | number) => {
    setItems(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };

  const handleCrearClienteInline = async (data: Omit<Cliente, 'id'>) => {
    const nuevo = await addCliente(data);
    setClienteId(nuevo.id);
    setMostrarNuevoCliente(false);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!clienteId || !clienteSeleccionado) {
      setError('Selecciona o crea un cliente');
      return;
    }
    const itemsValidos = items.filter((it) => it.productoId && it.cantidad > 0);
    if (itemsValidos.length === 0) {
      setError('Agrega al menos un item');
      return;
    }
    if (!fechaEntrega) {
      setError('Selecciona la fecha de entrega');
      return;
    }

    const itemsCompletos: ItemPedido[] = itemsValidos.map((it) => {
      const producto = productos.find((p) => p.id === it.productoId);
      return {
        productoId: it.productoId,
        cantidad: it.cantidad,
        nombre: producto ? formatProducto(producto) : '',
        sabor: producto?.requiereSabor ? it.sabor?.trim() || undefined : undefined,
        precioUnitario: producto?.precio ?? 0,
      };
    });

    setSaving(true);
    try {
      await onSubmit({
        clienteId,
        clienteNombre: clienteSeleccionado.nombre,
        items: itemsCompletos,
        tipoEntrega,
        direccion: clienteSeleccionado.direccion,
        direccionAlternativa: usarOtraDireccion ? direccionAlternativa : undefined,
        nombreAlternativo: usarOtraDireccion ? nombreAlternativo : undefined,
        fechaEntrega: new Date(fechaEntrega).toISOString(),
        llevaTarjeta,
        textoTarjeta: llevaTarjeta ? textoTarjeta.trim() || undefined : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 text-sm font-semibold text-gray-700">Cliente</p>
        <ClienteSelect
          clientes={clientes}
          value={clienteId}
          onChange={setClienteId}
          onCrearNuevo={() => setMostrarNuevoCliente(true)}
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold text-gray-700">Items</p>
        <div className="space-y-2">
          {items.map((item, index) => {
            const productoSeleccionado = productos.find((p) => p.id === item.productoId);
            return (
              <div key={index} className="space-y-2 rounded-lg border border-gray-200 p-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-500">Producto</label>
                    <select
                      value={item.productoId}
                      onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                    >
                      <option value="">Selecciona...</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>{formatProducto(p)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="mb-1 block text-xs text-gray-500">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={(e) => handleItemChange(index, 'cantidad', Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuitarItem(index)}
                    className="pb-1.5 text-sm text-gray-400 hover:text-red-600"
                  >
                    ✕ Quitar
                  </button>
                </div>
                {productoSeleccionado?.requiereSabor && (
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Sabor</label>
                    <input
                      type="text"
                      value={item.sabor ?? ''}
                      onChange={(e) => handleItemChange(index, 'sabor', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Button type="button" variant="secondary" className="mt-2" onClick={handleAgregarItem}>
          + Agregar Item
        </Button>
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold text-gray-700">Tipo de Entrega</p>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={tipoEntrega === 'Domicilio'}
              onChange={() => setTipoEntrega('Domicilio')}
            />
            Domicilio
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={tipoEntrega === 'Local'} onChange={() => setTipoEntrega('Local')} />
            Recoger en Local
          </label>
        </div>
      </div>

      {tipoEntrega === 'Domicilio' && (
        <div>
          <p className="mb-1 text-sm font-semibold text-gray-700">Dirección</p>
          <p className="mb-2 text-sm text-gray-500">
            {clienteSeleccionado?.direccion || 'Selecciona un cliente para ver su dirección'}
          </p>
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={usarOtraDireccion} onChange={(e) => setUsarOtraDireccion(e.target.checked)} />
            Enviar a otra dirección
          </label>
          {usarOtraDireccion && (
            <div className="mt-2 space-y-2">
              <input
                placeholder="Dirección alternativa"
                value={direccionAlternativa}
                onChange={(e) => setDireccionAlternativa(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Nombre a quien entrega"
                value={nombreAlternativo}
                onChange={(e) => setNombreAlternativo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <p className="mb-1 text-sm font-semibold text-gray-700">Fecha de Entrega</p>
        <input
          type="datetime-local"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <input type="checkbox" checked={llevaTarjeta} onChange={(e) => setLlevaTarjeta(e.target.checked)} />
        ¿Lleva Tarjeta?
      </label>

      {llevaTarjeta && (
        <div>
          <p className="mb-1 text-sm font-semibold text-gray-700">Texto de la Tarjeta</p>
          <textarea
            value={textoTarjeta}
            onChange={(e) => setTextoTarjeta(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2 pb-2">
        <Button type="button" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : pedido ? 'GUARDAR CAMBIOS' : 'CREAR PEDIDO'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          CANCELAR
        </Button>
      </div>

      {mostrarNuevoCliente && (
        <Modal title="Crear Cliente" onClose={() => setMostrarNuevoCliente(false)}>
          <ClienteForm onSubmit={handleCrearClienteInline} onCancel={() => setMostrarNuevoCliente(false)} />
        </Modal>
      )}
    </div>
  );
}
