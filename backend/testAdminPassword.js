// testAdminPassword.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database'); // ajustá la ruta si hace falta
const User = require('./models/user'); // ajustá la ruta si hace falta

async function testAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos');

    const email = 'barbytienda30@gmail.com';
    const passwordPlain = 'InduBarbie#2025';

    // Buscar usuario sin importar deletedAt
    const admin = await User.scope('withPassword').findOne({
      where: { email },
      paranoid: false // esto permite ignorar deletedAt
    });

    if (!admin) {
      console.log('❌ No se encontró el usuario admin');
      return;
    }

    const coincide = await bcrypt.compare(passwordPlain, admin.password);

    if (coincide) {
      console.log('✔ La contraseña coincide con el hash guardado en DB');
    } else {
      console.log('❌ La contraseña NO coincide con el hash guardado en DB');
    }

  } catch (error) {
    console.error('❌ Error testeando contraseña admin:', error);
  } finally {
    process.exit(0);
  }
}

testAdminPassword();
