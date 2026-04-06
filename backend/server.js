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

// ✅ CORS dinámico
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// 🧠 Ruta test
app.get('/', (req, res) => {
  res.send('✅ API funcionando 🚀');
});

// ❤️ Healthcheck (para Railway)
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
  console.error('🔴 Error global:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ✅ Puerto
const PORT = process.env.PORT || 5000;
if (!PORT) {
  console.error('❌ PORT no definido');
  process.exit(1);
}

// 🔗 Conectar DB y levantar servidor solo si DB conecta
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
      console.log('🔌 FRONTEND_URL:', process.env.FRONTEND_URL);
    });
  } catch (error) {
    console.error('❌ Error al conectar con Sequelize:', error.message);
    process.exit(1); // detiene la app si no se conecta a DB
  }
})();