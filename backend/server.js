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

// -----------------------------
// ✅ CORS definitivo (Railway + Local)
// -----------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'https://tiendainfantil.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-to-server
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('⛔ CORS bloqueado para:', origin);
    return callback(null, false); // Bloquea pero no tira error
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// -----------------------------
app.use(express.json());

// -----------------------------
// Healthcheck
// -----------------------------
app.get('/', (req, res) => res.send('✅ API funcionando 🚀'));
app.get('/health', (req, res) => res.status(200).send('OK'));

// -----------------------------
// Rutas API
// -----------------------------
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carrito', cartRoutes);
app.use('/api/v1/ordenes', orderRoutes);
app.use('/api/v1/favoritos', favoritoRoutes);
app.use('/api/v1/frontend-settings', frontendSettingsRoutes);

// -----------------------------
// 404
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// -----------------------------
// Error global
// -----------------------------
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// -----------------------------
// 🚀 ARRANQUE
// -----------------------------
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Solo autenticar DB al inicio
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');

    // Escuchar en todas las interfaces para Railway/Vercel
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
      console.log('🔌 FRONTEND_URL:', process.env.FRONTEND_URL);
    });

  } catch (error) {
    console.error('❌ Error DB:', error.message);
    process.exit(1); // Detener si DB falla
  }
})();