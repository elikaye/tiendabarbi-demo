const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // ajusta ruta si hace falta
const sequelize = require('./config/database');

const app = express();
app.use(express.json());

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.scope('withPassword').findOne({ where: { email } });

    if (!usuario) {
      console.log("Usuario no encontrado con email:", email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log("Usuario encontrado:", usuario.email);
    console.log("Hash guardado en DB:", usuario.password);
    console.log("Contraseña recibida (texto plano):", password);

    const valido = await bcrypt.compare(password, usuario.password);
    console.log("Resultado de bcrypt.compare:", valido);

    if (!valido) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET || 'secreto123', { expiresIn: '4h' });

    res.json({ message: 'Login OK', user: usuario.email, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error servidor', error: error.message });
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');

    app.listen(3001, () => {
      console.log('Test login corriendo en http://localhost:3001');
    });
  } catch (error) {
    console.error('Error DB:', error);
  }
})();
