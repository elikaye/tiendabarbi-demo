import express from "express";
import {
  getFrontendSettings,
  updateFrontendSettings,
} from "../controllers/frontendSettingsController.js";

const router = express.Router();

// Obtener configuración del frontend
router.get("/", getFrontendSettings);

// Actualizar configuración del frontend
router.put("/", updateFrontendSettings);

export default router;
