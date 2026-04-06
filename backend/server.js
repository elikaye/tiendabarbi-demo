import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './models/index.js';

// 📦 Importar rutas
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import favoritoRoutes from './routes/favoritoRoutes.js';
import frontendSettingsRoutes from './routes/frontendSettingsRoutes.js';

dotenv.config();
const app = express();

// ✅ CORS dinámico para dev + prod
const allowedOrigins = [
  process.env.FRONTEND_URL,  // producción
  'http://localhost:5173'    // desarrollo local
];

app.use(
  cors({
    origin: function(origin, callback) {
      // Si no hay origen (ej: Postman) o está permitido
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// 🧠 Ruta test
app.get('/', (req, res) => {
  res.send('✅ API funcionando 🚀');
});

// ❤️ Healthcheck (importante para Railway)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 📦 Rutas
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carrito', cartRoutes);
app.use('/api/v1/ordenes', orderRoutes);
app.use('/api/v1/favoritos', favoritoRoutes);
app.use('/api/v1/frontend-settings', frontendSettingsRoutes);

// 🚧 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ⚠️ Error global
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.message || err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ✅ Puerto dinámico
const PORT = process.env.PORT || 5000;

// 🚀 Levantar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔌 FRONTEND_URL:', process.env.FRONTEND_URL);
});

// 🔗 Conectar DB SIN BLOQUEAR SERVER
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');
  } catch (error) {
    console.error('❌ Error al conectar con Sequelize:', error.message);
  }
})();