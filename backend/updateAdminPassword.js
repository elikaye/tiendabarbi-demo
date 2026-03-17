require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const User = require('./models/user');

async function actualizarPasswordAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos');

    const email = 'barbytienda30@gmail.com';
    const nuevaPassword = 'InduBarbie#2025';

    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      console.log('❌ No se encontró el admin');
      return process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nuevaPassword, salt);

    await user.update({ password: hash });
    console.log('✔ Contraseña del admin actualizada correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

actualizarPasswordAdmin();
