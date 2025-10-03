//app.ts

import * as dotenv from "dotenv";
dotenv.config();

import * as path from "path";
import { fileURLToPath } from "url";

// resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import { createServer } from "node:http";
import indexRouter from "./routes/index.js";
import db from "./models/index.js"; //  aggregator import

//import populatedatabase
import populateDataBase from "./services/PopulateDB.js";

const PORT = process.env.PORT || 3001;

//SWAGGER
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "./configuration/swaggerOptions.js";

//CORS
import cors from "cors";

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Debug
/*
console.log("PORT:", process.env.PORT);
console.log("DB_USER:", process.env.ADMIN_USERNAME);
console.log("DB_PASS:", process.env.ADMIN_PASSWORD);
console.log("DB_NAME:", process.env.DATABASE_NAME);
*/

// Express app
const app = express();
const server = createServer(app);
//console.log("MODELS REGISTERED:", db.sequelize.models);
// DB sync
db.sequelize.sync({ force: false }).then(async () => {
  console.log("Database synced");
  await populateDataBase();
});

const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

//swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`listening at ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

export default app;
