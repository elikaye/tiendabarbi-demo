import express from 'express';
import { Carrito, OrdenFinal, User } from '../models/index.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Obtener todas las órdenes de un usuario ---
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const ordenes = await OrdenFinal.findAll({
      where: { user_id: req.params.userId },
      include: [{ model: User, as: 'ordenFinalUsuario', attributes: ['id', 'nombre', 'email'] }],
      order: [['updated_at', 'DESC']],
    });
    res.json(ordenes);
  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// --- Crear orden desde el carrito ---
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const carrito = await Carrito.findOne({ where: { user_id: userId } });

    if (!carrito || !carrito.productos || carrito.productos.length === 0)
      return res.status(400).json({ message: 'Carrito vacío' });

    const total = carrito.productos.reduce(
      (acc, item) => acc + (Number(item.precio) || 0) * (Number(item.cantidad) || 1),
      0
    );

    const nuevaOrden = await OrdenFinal.create({
      user_id: userId,
      productos: carrito.productos,
      total,
      estado: 'pendiente',
      metodoPago: req.body.metodoPago || 'manual',
    });

    // Vaciar carrito
    await Carrito.update({ productos: [], total: 0 }, { where: { user_id: userId } });

    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error('❌ Error al crear la orden:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// --- Obtener detalle de una orden ---
router.get('/detalle/:id', authenticate, async (req, res) => {
  try {
    const orden = await OrdenFinal.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: User, as: 'ordenFinalUsuario', attributes: ['id', 'nombre', 'email'] }],
    });

    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });

    res.json(orden);
  } catch (error) {
    console.error('❌ Error al obtener detalle de la orden:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
