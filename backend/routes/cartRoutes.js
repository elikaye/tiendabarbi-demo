
// routes/cartRoutes.js
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getCarrito, addCarrito, removeCarrito, clearCarrito } from "../controllers/carritoController.js";

const router = express.Router();

router.get("/", authenticate, getCarrito);
router.post("/add", authenticate, addCarrito);
router.put("/remove", authenticate, removeCarrito);
router.put("/clear", authenticate, clearCarrito);

export default router;
