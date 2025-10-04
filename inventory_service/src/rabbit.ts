//rabbit.ts Consumer 
import amqp from "amqplib";
import type {Connection,Channel} from "amqplib";

let channel:Channel;
export async function connectRabbit() {
    const connection=await amqp.connect("amqp://localhost");
    //assign
    channel=await connection.createChannel();
    console.log("inventory-service connected to rabbitmq")
    return channel;
}

export function getChannel():Channel {
    if (!channel) throw new Error("RabbitMQ channel not initialized");
    return channel;


}