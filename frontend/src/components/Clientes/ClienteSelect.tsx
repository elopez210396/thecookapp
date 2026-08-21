import { useMemo, useState } from 'react';
import type { Cliente } from '../../types';

interface ClienteSelectProps {
  clientes: Cliente[];
  value: string | null;
  onChange: (clienteId: string | null) => void;
  onCrearNuevo: () => void;
}

export default function ClienteSelect({ clientes, value, onChange, onCrearNuevo }: ClienteSelectProps) {
  const [busqueda, setBusqueda] = useState('');

  const ordenados = useMemo(
    () =>
      [...clientes]
        .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [clientes, busqueda],
  );

  const seleccionado = clientes.find((c) => c.id === value);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onCrearNuevo}
        className="w-full rounded-lg border border-dashed border-red-400 px-3 py-2 text-left text-sm font-semibold text-red-600"
      >
        + Crear Cliente Nuevo
      </button>

      <input
        placeholder="🔍 Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
      />

      <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200">
        {ordenados.length === 0 && <p className="p-3 text-sm text-gray-400">Sin resultados</p>}
        {ordenados.map((cliente) => (
          <button
            key={cliente.id}
            type="button"
            onClick={() => onChange(cliente.id)}
            className={`block w-full px-3 py-2 text-left text-sm ${
              cliente.id === value ? 'bg-red-50 font-semibold text-red-600' : 'hover:bg-gray-50'
            }`}
          >
            {cliente.nombre}
          </button>
        ))}
      </div>

      {seleccionado && (
        <p className="text-xs text-gray-500">Seleccionado: {seleccionado.nombre} — {seleccionado.telefono}</p>
      )}
    </div>
  );
}
