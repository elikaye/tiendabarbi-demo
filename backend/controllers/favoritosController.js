import Favorito from '../models/favorito.js';

// 🔹 Función para asegurar que siempre trabajamos con un array
const parseArray = (data) => {
  if (!data) return [];
  try {
    return Array.isArray(data) ? data : JSON.parse(data);
  } catch {
    return [];
  }
};

// 📦 Obtener favoritos
export const getFavoritos = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const favorito = await Favorito.findOne({ where: { user_id: userId } });
    if (!favorito) return res.json({ productos: [] });

    res.json({ productos: parseArray(favorito.productos) });
  } catch (error) {
    console.error("❌ Error en getFavoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
};

// ❤️ Agregar producto a favoritos (SIN reemplazar los anteriores)
export const addFavorito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const { producto } = req.body;
    if (!producto || !producto.id)
      return res.status(400).json({ error: "Producto inválido" });

    // Buscar registro existente
    let favorito = await Favorito.findOne({ where: { user_id: userId } });

    if (!favorito) {
      // Si NO existe → crear array nuevo
      favorito = await Favorito.create({
        user_id: userId,
        productos: [producto],
      });
    } else {
      // Si existe → agregar SIN borrar nada
      const productosActuales = parseArray(favorito.productos);

      // Evitar duplicados
      const existe = productosActuales.some(
        (p) => p.id.toString() === producto.id.toString()
      );

      if (!existe) {
        productosActuales.push(producto);
      }

      favorito.productos = productosActuales;
      await favorito.save();
    }

    res.json({ productos: parseArray(favorito.productos) });
  } catch (error) {
    console.error("❌ Error en addFavorito:", error);
    res.status(500).json({ error: "Error al agregar favorito" });
  }
};

// 💔 Eliminar producto de favoritos
export const removeFavorito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const { productoId } = req.body;
    if (!productoId) return res.status(400).json({ error: "productoId requerido" });

    const favorito = await Favorito.findOne({ where: { user_id: userId } });
    if (!favorito) return res.json({ productos: [] });

    const productosActuales = parseArray(favorito.productos);

    favorito.productos = productosActuales.filter(
      (p) => p.id.toString() !== productoId.toString()
    );

    await favorito.save();
    res.json({ productos: parseArray(favorito.productos) });
  } catch (error) {
    console.error("❌ Error en removeFavorito:", error);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
};

// 🗑️ Vaciar todos los favoritos
export const clearFavoritos = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const favorito = await Favorito.findOne({ where: { user_id: userId } });

    if (favorito) {
      favorito.productos = [];
      await favorito.save();
    }

    res.json({ productos: [] });
  } catch (error) {
    console.error("❌ Error en clearFavoritos:", error);
    res.status(500).json({ error: "Error al vaciar favoritos" });
  }
};
