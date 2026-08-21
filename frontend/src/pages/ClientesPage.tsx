import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientesStore } from '../store/clientesStore';
import { usePedidosStore } from '../store/pedidosStore';
import Navbar from '../components/Layout/Navbar';
import ClienteList from '../components/Clientes/ClienteList';
import ClienteForm from '../components/Clientes/ClienteForm';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { formatItemPedido } from '../utils/formatting';
import { formatFechaEntrega } from '../utils/dates';
import type { Cliente } from '../types';

export default function ClientesPage() {
  const { clientes, loading, fetchClientes, addCliente } = useClientesStore();
  const { pedidos, fetchPedidos } = usePedidosStore();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [clienteDetalle, setClienteDetalle] = useState<Cliente | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
    fetchPedidos();
  }, [fetchClientes, fetchPedidos]);

  const historialCliente = clienteDetalle
    ? pedidos
        .filter((p) => p.clienteId === clienteDetalle.id)
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    : [];

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <Navbar />

      <div className="flex items-center justify-between p-4 pb-0">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500">&larr; Volver</button>
        <Button onClick={() => setMostrarForm(true)}>+ CREAR</Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <ClienteList clientes={clientes} pedidos={pedidos} onVerMas={setClienteDetalle} />
      )}

      {mostrarForm && (
        <Modal title="Crear Cliente" onClose={() => setMostrarForm(false)}>
          <ClienteForm
            onSubmit={async (data) => {
              await addCliente(data);
              setMostrarForm(false);
            }}
            onCancel={() => setMostrarForm(false)}
          />
        </Modal>
      )}

      {clienteDetalle && (
        <Modal title={clienteDetalle.nombre} onClose={() => setClienteDetalle(null)}>
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold text-gray-500">Teléfono:</span> {clienteDetalle.telefono}</p>
            <p><span className="font-semibold text-gray-500">Dirección:</span> {clienteDetalle.direccion || '—'}</p>

            <div>
              <p className="mb-1 font-semibold text-gray-500">Historial de pedidos</p>
              {historialCliente.length === 0 && <p className="text-gray-400">Sin pedidos aún</p>}
              <div className="space-y-2">
                {historialCliente.map((p) => (
                  <div key={p.id} className="rounded-lg border border-gray-200 p-2">
                    <p className="text-xs text-gray-500">{formatFechaEntrega(p.fechaEntrega)} · {p.estado}</p>
                    <ul>
                      {p.items.map((item, i) => (
                        <li key={i}>{formatItemPedido(item)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
