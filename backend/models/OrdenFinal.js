import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrdenFinal = sequelize.define('OrdenFinal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productos: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'ordenes_final',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'delete_at'
});

export default OrdenFinal;
