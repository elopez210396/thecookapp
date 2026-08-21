import { useMemo } from 'react';
import type { Pedido } from '../../types';

interface VentasDashboardProps {
  pedidos: Pedido[];
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-extrabold text-red-600">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default function VentasDashboard({ pedidos }: VentasDashboardProps) {
  const stats = useMemo(() => {
    const hoy = new Date().toDateString();
    const activos = pedidos.filter((p) => p.estado !== 'Cancelado');
    const hoyPedidos = activos.filter((p) => new Date(p.fechaCreacion).toDateString() === hoy);
    const entregados = activos.filter((p) => p.estado === 'Entregado');
    const pendientes = activos.filter((p) => p.estado === 'Pendiente');
    const totalItems = activos.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.cantidad, 0), 0);

    return {
      totalPedidos: activos.length,
      pedidosHoy: hoyPedidos.length,
      entregados: entregados.length,
      pendientes: pendientes.length,
      totalItems,
    };
  }, [pedidos]);

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
      <StatCard label="Pedidos hoy" value={stats.pedidosHoy} />
      <StatCard label="Total pedidos" value={stats.totalPedidos} />
      <StatCard label="Pendientes" value={stats.pendientes} />
      <StatCard label="Entregados" value={stats.entregados} />
      <StatCard label="Items vendidos" value={stats.totalItems} />
    </div>
  );
}
