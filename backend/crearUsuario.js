import bcrypt from 'bcryptjs';
import sequelize from './config/database.js';
import User from './models/user.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos.');

    const passwordPlain = 'test1234'; // Contraseña para el usuario inicial
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    const nuevoUsuario = await User.create({
      nombre: 'Admin Inicial',
      email: 'admin@tuapp.com',
      password: passwordHash,
      rol: 'admin', // puede ser 'cliente' o 'admin'
    });

    console.log('✅ Usuario creado correctamente:');
    console.log({
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      passwordOriginal: passwordPlain, // solo para verificar
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    process.exit(1);
  }
})();
