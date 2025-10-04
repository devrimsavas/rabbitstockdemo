//rabbitmq helper "rabbit.ts"
//Publisher 
import amqp from "amqplib";
import type {Connection,Channel} from "amqplib";

//create channel 
let channel:Channel;

export async function connectRabbit() {
    const connection=await amqp.connect("amqp://localhost");
    //assign channel
    channel=await connection.createChannel();
    //debug for connection 
    console.log("order-service connected to rabbitmq");
    return channel;
}

export function getChannel():Channel {
    if (!channel) throw new Error("RabbitMQ channel not initialized");
    return channel;
}
