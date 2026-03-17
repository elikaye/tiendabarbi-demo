
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import User from './models/user.js';

dotenv.config();

async function hacerAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos');

    const email = 'barbytienda30@gmail.com';

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('❌ No se encontró el usuario');
      process.exit(1);
    }

    await user.update({ rol: 'admin' });

    console.log('✔ Usuario actualizado a ADMIN');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

hacerAdmin();
