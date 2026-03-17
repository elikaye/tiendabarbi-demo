import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  precio: { type: DataTypes.INTEGER, allowNull: false }, // 🔹 entero, sin decimales
  imageUrl: { type: DataTypes.STRING(500), allowNull: true },
  imagePublicId: { type: DataTypes.STRING, allowNull: true },
  estado: { type: DataTypes.STRING(50), defaultValue: 'activo' },
  categoria: { type: DataTypes.STRING(100) },
  subcategoria: { type: DataTypes.STRING(100) },
  destacados: { type: DataTypes.BOOLEAN, defaultValue: false },
  talles: { type: DataTypes.STRING },
  colores: { type: DataTypes.STRING },
  medidas: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  deletedAt: { type: DataTypes.DATE },
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true,
  deletedAt: 'deletedAt'
});

export default Product;
