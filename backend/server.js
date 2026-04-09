import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './models/index.js';

// 📦 Rutas
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import favoritoRoutes from './routes/favoritoRoutes.js';
import frontendSettingsRoutes from './routes/frontendSettingsRoutes.js';

dotenv.config();
const app = express();

console.log("🔥 INICIANDO SERVER...");

// 🌐 ORÍGENES PERMITIDOS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://tiendainfantil.vercel.app',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

// ✅ CORS COMPLETO
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('🚫 Bloqueado por CORS:', origin);
        callback(null, false); // 🔥 IMPORTANTE: NO romper el server
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 🔥 PRE-FLIGHT (CLAVE)
app.options('*', cors());

app.use(express.json());

// 📦 Rutas
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carrito', cartRoutes);
app.use('/api/v1/ordenes', orderRoutes);
app.use('/api/v1/favoritos', favoritoRoutes);
app.use('/api/v1/frontend-settings', frontendSettingsRoutes);

// 🧠 Test
app.get('/', (req, res) => {
  res.send('✅ API funcionando 🚀');
});

// 🚧 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ⚠️ Error global
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// 🔥 PUERTO
const PORT = process.env.PORT || 5000;

// 🚀 ARRANQUE ROBUSTO (ANTI-502)
(async () => {
  try {
    console.log("👉 Intentando conectar DB...");
    
    await sequelize.authenticate();
    
    console.log('✅ DB conectada correctamente');

  } catch (error) {
    console.error('❌ ERROR DB:', error.message);
    console.log('⚠️ CONTINUANDO SIN DB (para evitar 502)');
  }

  // 🔥 EL SERVER SIEMPRE ARRANCA (aunque falle la DB)
  app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
})();