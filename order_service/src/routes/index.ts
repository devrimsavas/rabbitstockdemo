//app

import express from "express";
import type { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { orders } from "../store.js";
//import rabbit 
import { getChannel } from "../rabbit.js";



type OrderItem = { id:number; qty: number };
type PostOrderBody = { items: OrderItem[] };

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Order-Service Main" });
});

//since we will send this request to rabbit 
router.post("/orders", async (req: Request, res: Response) => {
  //get body
  const body = req.body as PostOrderBody;
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: "items[] required" });
  }
  for (const it of body.items) {
    if (
      typeof it?.id !== "number" ||
      typeof it?.qty !== "number" ||
      it.qty <= 0
    ) {
      return res
        .status(400)
        .json({ error: "each item needs sku:string and qty>0" });
    }
  }
  const orderId = uuid();
  orders.set(orderId, "PENDING");
  // TODO  RabbitMQ'ya publish("order.created", { orderId, items: body.items })

  //publish event 
  //this creates and publish even vioa channel we created in app.ts 
  const channel=getChannel();
  //exchange ? explain

  const exchange="order_exchange"
  await channel.assertExchange(exchange,"fanout",{durable:true});
  //is is event to publish? 
  const event={
    type:"order.created",
    data:{orderId,items:body.items}
  }
  channel.publish(
    exchange,
    "",
    Buffer.from(JSON.stringify(event))
  );
  console.log("publish", event);

  return res.status(200).json({ orderId, status: "Pending" });
});
//satisfy id . guarantee id exists 
router.get("/orders/:id", (req: Request<{id:string}>, res: Response) => {
    const orderId=req.params.id;

  const status = orders.get(orderId);
  if (!status) return res.status(404).json({ error: "order not found" });
  return res.json({ orderId: req.params.id, status });
});

export default router;
