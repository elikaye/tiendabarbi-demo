const sequelize = require('../config/database');
require('dotenv').config();

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente con Sequelize.');
    await sequelize.close(); // Opcional: cerrar conexión si es sólo test
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos con Sequelize:', error.message);
    process.exit(1);
  }
};

testConnection();
