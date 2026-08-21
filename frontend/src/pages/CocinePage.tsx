import { useEffect, useState } from 'react';
import { usePedidosStore } from '../store/pedidosStore';
import Navbar from '../components/Layout/Navbar';
import BottomNav from '../components/Layout/BottomNav';
import PedidoList from '../components/Pedidos/PedidoList';
import PedidoDetail from '../components/Pedidos/PedidoDetail';
import Loading from '../components/common/Loading';
import type { Pedido } from '../types';

type Tab = 'pendientes' | 'listos';

export default function CocinePage() {
  const { pedidos, loading, fetchPedidos, setEstado } = usePedidosStore();
  const [tab, setTab] = useState<Tab>('pendientes');
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const pendientes = pedidos.filter((p) => p.estado === 'Pendiente');
  const listos = pedidos.filter((p) => p.estado === 'Listo');

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <Navbar />

      <BottomNav
        tabs={[
          { key: 'pendientes', label: 'Pendientes' },
          { key: 'listos', label: 'Listos para Entregar' },
        ]}
        active={tab}
        onChange={(key) => setTab(key as Tab)}
      />

      {loading ? (
        <Loading />
      ) : (
        <PedidoList
          pedidos={tab === 'pendientes' ? pendientes : listos}
          variant="cocina"
          emptyMessage={tab === 'pendientes' ? 'No hay pedidos pendientes' : 'No hay pedidos listos'}
          onVerMas={setPedidoDetalle}
          onMarcarListo={(p) => setEstado(p.id, 'Listo')}
          onQuitarListo={(p) => setEstado(p.id, 'Pendiente')}
        />
      )}

      {pedidoDetalle && <PedidoDetail pedido={pedidoDetalle} onClose={() => setPedidoDetalle(null)} />}
    </div>
  );
}
