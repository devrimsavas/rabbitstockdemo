//db.ts

import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/*
console.log("DEBUG ENV from db.ts:");
console.log("USER:", process.env.ADMIN_USERNAME);
console.log("PASS:", process.env.ADMIN_PASSWORD);
console.log("DB:", process.env.DATABASE_NAME);
console.log("HOST:", process.env.HOST);
*/

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || "inventorydb",
  process.env.ADMIN_USERNAME || "root",
  process.env.ADMIN_PASSWORD || "",
  {
    host: process.env.HOST || "localhost",
    dialect: (process.env.DIALECT as any) || "mysql",
    logging: false,
  }
);

export default sequelize;
