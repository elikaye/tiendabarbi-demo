import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("👉 NODE_ENV:", process.env.NODE_ENV);
console.log("👉 DATABASE_URL:", process.env.DATABASE_URL);
console.log("👉 DB_HOST:", process.env.DB_HOST);

const isProd = process.env.NODE_ENV === "production";

let sequelize;

if (isProd) {
  console.log("🟣 USANDO DATABASE_URL");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
  });
} else {
  console.log("🟢 USANDO DB_HOST");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql",
      logging: console.log,
    }
  );
}

export default sequelize;