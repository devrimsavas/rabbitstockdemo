//order_service appt.ts
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "node:http";

//routes 
import indexRouter from "./routes/index.js";

const PORT = process.env.PORT || 3006;

//express app
const app = express();
const server = createServer(app);
app.use(express.json());


//route apply 
app.use("/",indexRouter);

app.listen(PORT, () => {
  console.log(`inventory service at: ${PORT}`);
});


export default app;
