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

// 🌐 ORÍGENES PERMITIDOS (LOCAL + VERCEL)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://tiendainfantil.vercel.app',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

// ✅ CORS CORREGIDO (COMPLETO)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('🚫 Bloqueado por CORS:', origin);
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 🔥 CLAVE: habilita preflight (ARREGLA CORS + 502)
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

// 🔥 PUERTO (correcto para Railway)
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
console.log('👉 PORT:', process.env.PORT);

// 🔗 DB + start
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');

    // 🚫 NO usar en producción
    // await sequelize.sync();

    console.log('✅ DB lista (sin sync)');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con Sequelize:', error.message);
    process.exit(1);
  }
})();