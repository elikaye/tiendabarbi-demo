
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Detecta si estamos en producción
const isProd = process.env.NODE_ENV === "production";

// Configuración de Sequelize
const sequelize = isProd
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      logging: false, // Desactiva logs en producción
    })
  : new Sequelize(
      process.env.DB_NAME,      // database
      process.env.DB_USER,      // root
      process.env.DB_PASSWORD,  // contraseña del proxy
      {
        host: process.env.DB_HOST, // tramway.proxy.rlwy.net
        port: process.env.DB_PORT, // 53155
        dialect: "mysql",
        logging: console.log,      // Logs en desarrollo
        dialectOptions: {
          connectTimeout: 10000,   // Evita ETIMEDOUT
        },
      }
    );

export default sequelize;