//order_service appt.ts
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
//rabbit helper
import { connectRabbit } from "./rabbit.js";
//for now it is a memory store
import { orders } from "./store.js";
//routes
import indexRouter from "./routes/index.js";

const PORT = process.env.PORT || 3006;

//express app
const app = express();

const server = createServer(app);
app.use(express.json());
app.use(cors());

//route apply
app.use("/", indexRouter);
//start rabit publisher
async function start() {
  const channel = await connectRabbit();
  //create exchange and queue
  const exchange = "order_exchange";
  await channel.assertExchange(exchange, "fanout", { durable: true });
  //queue
  const queue = "order_status_queue";
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, "");

  //listen for confirm or rejection
  channel.consume(queue, (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());
    //debug
    console.log("order service received", event);

    //check if it is confirmed or reject and send message

    //first confirmed
    if (event.type === "order.confirmed") {
      const { orderId } = event.data;
      orders.set(orderId, "CONFIRMED");
      console.log(` Order ${orderId} confirmed`);
    }

    //reject
    if (event.type === "order.rejected") {
      const { orderId } = event.data;
      //set
      orders.set(orderId, "REJECTED");
      console.log(`Order ${orderId} rejected`);
    }

    //remove from queue
    channel.ack(msg);
  });

  //listen here since it is asnyc
  app.listen(PORT, () => {
    console.log(`order service at : ${PORT}`);
  });
}

await start();
export default app;
