// backend/models/index.js
import sequelize from '../config/database.js';

import Carrito from './carrito.js';           // carritos
import OrdenFinal from './OrdenFinal.js'; // ordenes_final
import User from './user.js';           // users
import Product from './product.js';     // products
import Favorito from './favorito.js';   // favoritos

// ---- Relaciones Carrito ----
User.hasOne(Carrito, { foreignKey: 'user_id', as: 'usuarioCarrito' });
Carrito.belongsTo(User, { foreignKey: 'user_id', as: 'carritoUsuario' });

// ---- Relaciones OrdenFinal ----
User.hasMany(OrdenFinal, { foreignKey: 'user_id', as: 'usuarioOrdenesFinal' });
OrdenFinal.belongsTo(User, { foreignKey: 'user_id', as: 'ordenFinalUsuario' });

// ---- Relaciones Favorito ----
User.hasMany(Favorito, { foreignKey: 'user_id', as: 'usuarioFavoritos' });
Favorito.belongsTo(User, { foreignKey: 'user_id', as: 'favoritoUsuario' });

// ---- Relaciones Product (opcional) ----
// Si querés relacionar Favorito con Product:
// Favorito.belongsTo(Product, { foreignKey: 'product_id', as: 'productoFavorito' });

export {
  sequelize,
  Carrito,
  OrdenFinal,
  User,
  Product,
  Favorito,
};
