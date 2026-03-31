import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  descripcion: {
    type: DataTypes.TEXT
  },

  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  imageUrl: DataTypes.STRING,
  imagePublicId: DataTypes.STRING,

  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'agotado'),
    defaultValue: 'activo'
  },

  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },

  subcategoria: DataTypes.STRING,

  destacados: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  talles: DataTypes.TEXT,
  colores: DataTypes.TEXT,
  medidas: DataTypes.TEXT,


  // 🔥 ESTE ES EL FIX REAL
  temporada_coleccion: {
    type: DataTypes.STRING,
    field: 'temporada_coleccion'
  }

}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true
});

export default Product;