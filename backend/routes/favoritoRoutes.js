
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import Favorito from "../models/favorito.js";

const router = express.Router();

// GET favoritos
router.get("/", authenticate, async (req, res) => {
  try {
    const fav = await Favorito.findOne({ where: { user_id: req.user.id } });

    // 🚨 Proteger si productos viene null
    const productos = fav?.productos || [];

    res.json({ productos });
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo favoritos" });
  }
});

// POST agregar favorito
router.post("/", authenticate, async (req, res) => {
  const { producto } = req.body;

  try {
    let fav = await Favorito.findOne({ where: { user_id: req.user.id } });

    if (!fav) {
      fav = await Favorito.create({
        user_id: req.user.id,
        productos: [producto],
      });
    } else {
      // 🚨 Proteger si productos es null
      const actual = Array.isArray(fav.productos) ? fav.productos : [];
      fav.productos = [...actual, producto];
      await fav.save();
    }

    res.json(fav);
  } catch (err) {
    res.status(500).json({ error: "Error agregando favorito" });
  }
});

// DELETE eliminar uno
router.delete("/", authenticate, async (req, res) => {
  const { productoId } = req.body;

  try {
    let fav = await Favorito.findOne({ where: { user_id: req.user.id } });

    if (!fav) return res.json({ productos: [] });

    // 🚨 Proteger si productos es null
    const actual = Array.isArray(fav.productos) ? fav.productos : [];

    fav.productos = actual.filter((p) => p?.id !== productoId);
    await fav.save();

    res.json(fav);
  } catch (err) {
    res.status(500).json({ error: "Error eliminando favorito" });
  }
});

// DELETE vaciar
router.delete("/all", authenticate, async (req, res) => {
  try {
    let fav = await Favorito.findOne({ where: { user_id: req.user.id } });
    if (fav) {
      fav.productos = [];
      await fav.save();
    }

    res.json({ productos: [] });
  } catch (err) {
    res.status(500).json({ error: "Error vaciando favoritos" });
  }
});

export default router;
