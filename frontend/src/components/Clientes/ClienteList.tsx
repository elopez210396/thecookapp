import { useMemo, useState } from 'react';
import type { Cliente, Pedido } from '../../types';
import { tiempoRelativo } from '../../utils/dates';
import Button from '../common/Button';

interface ClienteListProps {
  clientes: Cliente[];
  pedidos: Pedido[];
  onVerMas: (cliente: Cliente) => void;
}

export default function ClienteList({ clientes, pedidos, onVerMas }: ClienteListProps) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(
    () => clientes.filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase())),
    [clientes, busqueda],
  );

  const statsPorCliente = (clienteId: string) => {
    const propios = pedidos.filter((p) => p.clienteId === clienteId);
    const ultima = propios
      .slice()
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())[0];
    return { total: propios.length, ultima };
  };

  return (
    <div className="space-y-3 p-4">
      <input
        placeholder="🔍 Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
      />

      {filtrados.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Sin clientes</p>}

      {filtrados.map((cliente) => {
        const { total, ultima } = statsPorCliente(cliente.id);
        return (
          <div key={cliente.id} className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-bold">{cliente.nombre}</h3>
            <p className="text-sm text-gray-600">Tel: {cliente.telefono}</p>
            <p className="text-sm text-gray-600">{total} pedidos totales</p>
            {ultima && <p className="text-sm text-gray-500">Última compra: {tiempoRelativo(ultima.fechaCreacion)}</p>}
            <Button variant="secondary" className="mt-3" onClick={() => onVerMas(cliente)}>
              VER MÁS
            </Button>
          </div>
        );
      })}
    </div>
  );
}
