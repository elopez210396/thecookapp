import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { readSheet, appendRow, updateRowById } from '../services/sheets.js';
import { requireAuth, requireRol } from '../middleware/auth.js';
import type { Cliente } from '../types/index.js';

const router = Router();
const SHEET_NAME = 'Clientes';
const HEADERS = ['id', 'nombre', 'telefono', 'direccion'];

router.get('/', requireAuth, async (_req, res) => {
  try {
    const rows = await readSheet(SHEET_NAME);
    const clientes: Cliente[] = rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      telefono: r.telefono,
      direccion: r.direccion,
    }));
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: 'Error al leer clientes' });
  }
});

router.post('/', requireAuth, requireRol('Admin'), async (req, res) => {
  const { nombre, telefono, direccion } = req.body;
  if (!nombre || !telefono) {
    return res.status(400).json({ message: 'Nombre y teléfono son requeridos' });
  }

  const cliente: Cliente = { id: uuid(), nombre, telefono, direccion: direccion || '' };

  try {
    await appendRow(SHEET_NAME, HEADERS, { ...cliente });
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear cliente' });
  }
});

router.put('/:id', requireAuth, requireRol('Admin'), async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, direccion } = req.body;

  try {
    const rows = await readSheet(SHEET_NAME);
    const existente = rows.find((r) => r.id === id);
    if (!existente) return res.status(404).json({ message: 'Cliente no encontrado' });

    const actualizado: Cliente = {
      id,
      nombre: nombre ?? existente.nombre,
      telefono: telefono ?? existente.telefono,
      direccion: direccion ?? existente.direccion,
    };

    await updateRowById(SHEET_NAME, HEADERS, id, { ...actualizado });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
});

export default router;
