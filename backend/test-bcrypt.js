const bcrypt = require('bcryptjs');

const passwordPlain = '3639';
const passwordHash = '$2b$10$1PyBtBx79EcKWSzRUSRzo.vLcolw7vzThz/xSPQDi9LSlGsCMInh2';

bcrypt.compare(passwordPlain, passwordHash, (err, res) => {
  if (err) {
    console.error('Error comparando:', err);
  } else {
    console.log('¿La contraseña coincide con el hash?', res);
  }
});
