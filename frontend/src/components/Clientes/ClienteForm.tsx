import { useState, type FormEvent } from 'react';
import type { Cliente } from '../../types';
import Button from '../common/Button';

interface ClienteFormProps {
  initial?: Partial<Cliente>;
  onSubmit: (data: Omit<Cliente, 'id'>) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ClienteForm({ initial, onSubmit, onCancel, submitLabel = 'CREAR' }: ClienteFormProps) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '');
  const [telefono, setTelefono] = useState(initial?.telefono ?? '');
  const [direccion, setDireccion] = useState(initial?.direccion ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      setError('Nombre y teléfono son requeridos');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ nombre: nombre.trim(), telefono: telefono.trim(), direccion: direccion.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Dirección (default)</label>
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>CANCELAR</Button>
      </div>
    </form>
  );
}
