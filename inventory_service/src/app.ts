//app.ts

import * as dotenv from "dotenv";
dotenv.config();

import * as path from "path";
import { fileURLToPath } from "url";

// resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını proje kökünden yükle
//dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import { createServer } from "node:http";
import indexRouter from "./routes/index.js";
import db from "./models/index.js"; // 👈 aggregator import

const PORT = process.env.PORT || 3001;

// Debug
console.log("PORT:", process.env.PORT);
console.log("DB_USER:", process.env.ADMIN_USERNAME);
console.log("DB_PASS:", process.env.ADMIN_PASSWORD);
console.log("DB_NAME:", process.env.DATABASE_NAME);

// Express app
const app = express();
const server = createServer(app);
console.log("MODELS REGISTERED:", db.sequelize.models);
// DB sync (tüm modeller index.ts içinde toplandı)
db.sequelize.sync({ force: true }).then(() => {
  console.log("Database and tables created!");
});

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`listening at ${PORT}`);
});

export default app;
