// src/configuration/swaggerOptions.ts
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  // swaggerDefinition yerine definition (swagger-jsdoc v6)
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Service API",
      version: "1.0.0",
      description: "API documentation for Inventory Service API application",
    },
    servers: [{ url: "http://localhost:3005" }],
  },
  // scan  dist/js and src/ts
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../routes/*.ts"),
  ],
};

export default swaggerOptions;
