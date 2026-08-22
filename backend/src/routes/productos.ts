import { Router } from 'express';
import { readSheet } from '../services/sheets.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  try {
    const rows = await readSheet('Productos');
    res.json(
      rows.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        cantidad: r.cantidad,
        unidad: r.unidad,
        precio: Number(r.precio) || 0,
        requiereSabor: r.requiereSabor === 'TRUE' || r.requiereSabor === 'true',
      })),
    );
  } catch (err) {
    res.status(500).json({ message: 'Error al leer productos' });
  }
});

export default router;
