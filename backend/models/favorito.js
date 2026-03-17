import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Favorito extends Model {}

Favorito.init(
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
      type: DataTypes.JSON,       // Guarda directamente como JSON
      allowNull: false,
      defaultValue: [],           // default vacío
    }
  },
  {
    sequelize,
    modelName: "Favorito",
    tableName: "favoritos",
    timestamps: true,   // created_at y updated_at automáticos
    underscored: true,  // usa snake_case
    paranoid: false
  }
);

export default Favorito;
