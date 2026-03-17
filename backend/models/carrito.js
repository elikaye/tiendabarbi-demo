
// models/carrito.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Carrito extends Model {}

Carrito.init(
  {
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
      type: DataTypes.JSON,       // Guarda productos con cantidad
      allowNull: false,
      defaultValue: [],           // default vacío
    }
  },
  {
    sequelize,
    modelName: "Carrito",
    tableName: "carritos",
    timestamps: true,   // created_at y updated_at automáticos
    underscored: true,  // usa snake_case
    paranoid: false
  }
);

export default Carrito;
