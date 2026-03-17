import FrontendSettings from "../models/FrontendSettings.js";

// GET — obtener configuración
export const getFrontendSettings = async (req, res) => {
  try {
    const settings = await FrontendSettings.findOne();

    // Si no existe aún, devolvemos valores por defecto
    if (!settings) {
      return res.json({
        bannerUrl: null,
        bannerBlur: false,
        cintaTexto: "",
        cintaVisible: true,
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error obteniendo frontend settings:", error);
    res.status(500).json({ message: "Error al obtener configuración" });
  }
};

// UPDATE — guardar configuración
export const updateFrontendSettings = async (req, res) => {
  try {
    const data = req.body;

    let settings = await FrontendSettings.findOne();

    if (!settings) {
      settings = await FrontendSettings.create(data);
    } else {
      await settings.update(data);
    }

    res.json(settings);
  } catch (error) {
    console.error("Error actualizando frontend settings:", error);
    res.status(500).json({ message: "Error al actualizar configuración" });
  }
};
