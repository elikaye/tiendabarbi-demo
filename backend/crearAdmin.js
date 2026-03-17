

import dotenv from 'dotenv';
import sequelize from './config/database.js';
import User from './models/user.js';

dotenv.config();

async function crearUsuarioAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos');

    const nombre = 'Nombre Cliente';
    const email = 'barbytienda30@gmail.com';
    const passwordPlain = 'InduBarbie#2025';
    const rol = 'admin';

    // Busco cualquier usuario con ese email, incluyendo los eliminados (soft delete)
    const existente = await User.findOne({ 
      where: { email }, 
      paranoid: false
    });

    if (existente) {
      console.log(`> Admin existente encontrado (${email}), eliminando completamente...`);
      await existente.destroy({ force: true }); // elimina completamente
    }

    // Crear admin de cero (el hook del modelo hace el hash)
    const user = await User.create({
      nombre,
      email,
      password: passwordPlain,
      rol,
    });

    console.log(`✔ Admin creado correctamente: ${user.email}`);
    console.log(`   Contraseña original (para login): ${passwordPlain}`);
    console.log(`   Rol: ${user.rol}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
    process.exit(1);
  }
}

crearUsuarioAdmin();
