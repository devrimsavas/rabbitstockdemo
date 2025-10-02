import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import db from "../models/index.js";
import  ItemService  from "../services/ItemService.js";
const itemService = new ItemService();

//main page test
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "it is test server" });
});

router.get("/allitems", async (req: Request, res: Response) => {
  const allItems = await itemService.getAllItems();
  res.status(200).json({ items: allItems });
});

export default router;
