import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePedidosStore } from '../store/pedidosStore';
import Navbar from '../components/Layout/Navbar';
import BottomNav from '../components/Layout/BottomNav';
import PedidoList from '../components/Pedidos/PedidoList';
import PedidoDetail from '../components/Pedidos/PedidoDetail';
import CreatePedidoForm, { type PedidoFormValues } from '../components/Pedidos/CreatePedidoForm';
import VentasDashboard from '../components/Dashboard/VentasDashboard';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import type { Pedido } from '../types';

type Vista = 'pedidos' | 'dashboard';
type Tab = 'pendientes' | 'historial';

export default function AdminPage() {
  const { pedidos, loading, fetchPedidos, addPedido, editPedido, setEstado } = usePedidosStore();
  const [vista, setVista] = useState<Vista>('pedidos');
  const [tab, setTab] = useState<Tab>('pendientes');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);
  const [pedidoCancelando, setPedidoCancelando] = useState<Pedido | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const pendientes = pedidos.filter((p) => p.estado === 'Pendiente' || p.estado === 'Listo');
  const historial = pedidos;

  const handleCrear = async (values: PedidoFormValues) => {
    await addPedido(values);
    setMostrarForm(false);
  };

  const handleEditar = async (values: PedidoFormValues) => {
    if (!pedidoEditando) return;
    await editPedido(pedidoEditando.id, values);
    setPedidoEditando(null);
  };

  const handleConfirmarCancelar = async () => {
    if (!pedidoCancelando) return;
    await setEstado(pedidoCancelando.id, 'Cancelado');
    setPedidoCancelando(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <Navbar />

      <div className="space-y-2 p-4">
        <Button className="w-full" onClick={() => setMostrarForm(true)}>
          CREAR PEDIDO
        </Button>
        <div className="flex gap-2">
          <Link to="/clientes" className="flex-1">
            <Button variant="secondary" className="w-full">CLIENTES</Button>
          </Link>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setVista(vista === 'dashboard' ? 'pedidos' : 'dashboard')}
          >
            DASHBOARD
          </Button>
        </div>
      </div>

      {vista === 'dashboard' ? (
        <VentasDashboard pedidos={pedidos} />
      ) : (
        <>
          <BottomNav
            tabs={[
              { key: 'pendientes', label: 'Pendientes' },
              { key: 'historial', label: 'Historial' },
            ]}
            active={tab}
            onChange={(key) => setTab(key as Tab)}
          />

          {loading ? (
            <Loading />
          ) : (
            <PedidoList
              pedidos={tab === 'pendientes' ? pendientes : historial}
              variant="admin"
              emptyMessage="No hay pedidos pendientes"
              onVerMas={setPedidoDetalle}
              onEditar={setPedidoEditando}
              onCancelar={setPedidoCancelando}
            />
          )}
        </>
      )}

      {mostrarForm && (
        <Modal title="Crear Pedido" onClose={() => setMostrarForm(false)}>
          <CreatePedidoForm onSubmit={handleCrear} onCancel={() => setMostrarForm(false)} />
        </Modal>
      )}

      {pedidoEditando && (
        <Modal title="Editar Pedido" onClose={() => setPedidoEditando(null)}>
          <CreatePedidoForm pedido={pedidoEditando} onSubmit={handleEditar} onCancel={() => setPedidoEditando(null)} />
        </Modal>
      )}

      {pedidoDetalle && (
        <PedidoDetail
          pedido={pedidoDetalle}
          onClose={() => setPedidoDetalle(null)}
          onEditar={() => {
            setPedidoEditando(pedidoDetalle);
            setPedidoDetalle(null);
          }}
          onCancelar={() => {
            setPedidoCancelando(pedidoDetalle);
            setPedidoDetalle(null);
          }}
        />
      )}

      {pedidoCancelando && (
        <Modal title="Cancelar Pedido" onClose={() => setPedidoCancelando(null)}>
          <p className="mb-4 text-sm text-gray-700">
            ¿Seguro que quieres cancelar el pedido de <strong>{pedidoCancelando.clienteNombre}</strong>?
          </p>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleConfirmarCancelar}>Sí, cancelar</Button>
            <Button variant="secondary" onClick={() => setPedidoCancelando(null)}>Volver</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
