import { useEffect, useState } from 'react';
import { usePedidosStore } from '../store/pedidosStore';
import Navbar from '../components/Layout/Navbar';
import BottomNav from '../components/Layout/BottomNav';
import PedidoList from '../components/Pedidos/PedidoList';
import PedidoDetail from '../components/Pedidos/PedidoDetail';
import Loading from '../components/common/Loading';
import type { Pedido } from '../types';

type Tab = 'listos' | 'entregados';

function abrirEnMaps(direccion: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
  window.open(url, '_blank');
}

export default function DomiciliarioPage() {
  const { pedidos, loading, fetchPedidos, setEstado } = usePedidosStore();
  const [tab, setTab] = useState<Tab>('listos');
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const esDomicilio = (p: Pedido) => p.tipoEntrega === 'Domicilio';
  const listos = pedidos.filter((p) => p.estado === 'Listo' && esDomicilio(p));
  const entregados = pedidos.filter((p) => p.estado === 'Entregado' && esDomicilio(p));

  const handleAbrirMaps = (p: Pedido) => abrirEnMaps(p.direccionAlternativa || p.direccion);

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <Navbar />

      <BottomNav
        tabs={[
          { key: 'listos', label: 'Mis Entregas' },
          { key: 'entregados', label: 'Entregados' },
        ]}
        active={tab}
        onChange={(key) => setTab(key as Tab)}
      />

      {loading ? (
        <Loading />
      ) : (
        <PedidoList
          pedidos={tab === 'listos' ? listos : entregados}
          variant="domiciliario"
          emptyMessage={tab === 'listos' ? 'No hay entregas pendientes' : 'No hay entregas realizadas'}
          onVerMas={setPedidoDetalle}
          onAbrirMaps={handleAbrirMaps}
          onEntregado={(p) => setEstado(p.id, 'Entregado')}
        />
      )}

      {pedidoDetalle && (
        <PedidoDetail
          pedido={pedidoDetalle}
          onClose={() => setPedidoDetalle(null)}
          onAbrirMaps={() => handleAbrirMaps(pedidoDetalle)}
          onEntregado={
            pedidoDetalle.estado === 'Listo'
              ? () => {
                  setEstado(pedidoDetalle.id, 'Entregado');
                  setPedidoDetalle(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
