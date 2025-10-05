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
//item services
import ItemService from "./services/ItemService.js";
const itemService = new ItemService();

const PORT = process.env.PORT || 3001;

//import rabbitmq
import { connectRabbit } from "./rabbit.js";

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

async function start() {
  //create channel
  const channel = await connectRabbit();
  //we need to be sure the exchange exists
  //same label as publisher
  const exchange = "order_exchange";
  //be sure it exists or create
  await channel.assertExchange(exchange, "fanout", { durable: true });
  // 2. Create a dedicated queue for this service
  const queue = "inventory_order_queue";
  await channel.assertQueue(queue, { durable: true });

  // 3. Bind the queue to the exchange
  await channel.bindQueue(queue, exchange, "");

  // consome message
  channel.consume(queue, async (msg) => {
    if (!msg) return;

    //msg is event
    const event = JSON.parse(msg.content.toString());
    console.log(
      "📥 Inventory-service received:",
      JSON.stringify(event, null, 2)
    );

    //check event type
    if (event.type === "order.created") {
      //create order body
      const { orderId, items } = event.data;
      try {
        //need to explain
        let allAvailable = true;
        //iterate items
        for (const item of items) {
          const found = await db.Item.findOne({ where: { id: item.id } });
          //item and amount check
          if (!found || found.amount < item.qty) {
            allAvailable = false;
            break;
          }
        }
        //if order satisfy
        if (allAvailable) {
          //if avaible create order and deduct stock
          for (const item of items) {
            //satisfied make order use sellitem
            await itemService.sellItemById({ id: item.id, amount: item.qty });
          }
          //publish now confirmation and change pending status to order confirmed
          const confirmedEvent = {
            type: "order.confirmed",
            data: { orderId },
          };
          //publish confirmation
          channel.publish(
            "order_exchange",
            "",
            Buffer.from(JSON.stringify(confirmedEvent)) // here send confirmation
          );
          //get a debug msg
          console.log("Published event", confirmedEvent);
        } else {
          //publish rejection
          const rejectedEvent = {
            type: "order.rejected",
            data: { orderId },
          };
          //also publish if it is rejected
          channel.publish(
            "order_exchange",
            "",
            Buffer.from(JSON.stringify(rejectedEvent))
          );
          //debug for rejected event
          console.log("Published event", rejectedEvent);
        }
        channel.ack(msg);
      } catch (err) {
        console.error("Error handling request", err);
        //nack for retry
        channel.nack(msg, false, false);
      }
    }
  });

  //LISTEN
  app.listen(PORT, () => {
    console.log(`inventory service at: ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
}
await start();

export default app;
