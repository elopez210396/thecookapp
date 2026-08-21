import { Router } from 'express';
import * as pedidosService from '../services/pedidos.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  try {
    const pedidos = await pedidosService.getAllPedidos();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ message: 'Error al leer pedidos' });
  }
});

router.post('/', requireAuth, requireRol('Admin'), async (req, res) => {
  const { clienteId, clienteNombre, items, tipoEntrega, direccion, fechaEntrega } = req.body;

  if (!clienteId || !items?.length || !tipoEntrega || !fechaEntrega) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const pedido = await pedidosService.createPedido(req.body);
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear pedido' });
  }
});

router.put('/:id', requireAuth, requireRol('Admin'), async (req, res) => {
  try {
    const pedido = await pedidosService.updatePedido(req.params.id, req.body);
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar pedido' });
  }
});

router.patch('/:id/estado', requireAuth, async (req, res) => {
  const { estado } = req.body;
  const estadosValidos = ['Pendiente', 'Listo', 'Entregado', 'Cancelado'];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    const pedido = await pedidosService.setEstadoPedido(req.params.id, estado);
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ message: 'Error al cambiar estado' });
  }
});

export default router;
