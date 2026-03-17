// routes/userRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { 
  registrarUsuario, 
  loginUsuario, 
  forgotPassword, 
  resetPassword 
} from '../controllers/userController.js';

const router = express.Router();

/* ==================== AUTH ==================== */
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

/* ==================== RECUPERAR CONTRASEÑA ==================== */
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

/* ==================== TOKEN TEST ==================== */
router.get('/token-test', (req, res) => {
  const payload = { id: 1, rol: 'admin' };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secreto123',
    { expiresIn: '1h' }
  );
  res.json({ token });
});

export default router;
