//order_service appt.ts
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
//rabbit helper 
import { connectRabbit } from "./rabbit.js";
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
    await connectRabbit();
    //listen here since it is asnyc 
    app.listen(PORT,()=> {
        console.log(`order service at : ${PORT}`)
    })
}

await start();
export default app;
