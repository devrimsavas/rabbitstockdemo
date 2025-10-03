import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import db from "../models/index.js";
import ItemService from "../services/ItemService.js";
const itemService = new ItemService();

//main page test
/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello Page
 *     responses:
 *       200:
 *         description: nothing
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "it is test server" });
});

/**
 * @swagger
 * /allitems:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: Returns a list of all items in stock
 */

router.get("/allitems", async (req: Request, res: Response) => {
  const allItems = await itemService.getAllItems();
  res.status(200).json({ items: allItems });
});

/**
 * @swagger
 * /sellitem:
 *   post:
 *     summary: Sell item by name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemToSell:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   amount:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Item sold successfully
 *       400:
 *         description: Error while selling item
 */
router.post("/sellitem", async (req: Request, res: Response) => {
  try {
    const itemToSell = req.body.itemToSell;
    const updated = await itemService.sellItem(itemToSell);

    res.status(200).json({
      message: `Item ${itemToSell.name} sold ${itemToSell.amount}, new stock ${updated.amount}`,
    });
  } catch (err: any) {
    console.error(`error ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /sellitembyid:
 *   post:
 *     summary: Sell item by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemToSellById:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   amount:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Item sold successfully by ID
 *       400:
 *         description: Error while selling item
 */
router.post("/sellitembyid", async (req: Request, res: Response) => {
  try {
    const itemToSellById = req.body.itemToSellById;
    const updated = await itemService.sellItemById(itemToSellById);
    res.status(200).json({
      message: `Item ID  ${itemToSellById.id} sold ${itemToSellById.amount}, new stock ${updated.amount}`,
    });
  } catch (err: any) {
    console.error(`error ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /additem:
 *   put:
 *     summary: Add stock by name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock successfully added by name
 *       400:
 *         description: Error adding stock
 */
router.put("/additem", async (req: Request, res: Response) => {
  try {
    const { name, amount } = req.body;
    const updated = await itemService.addStock(name, amount);
    res.status(200).json({
      message: `Item ${name} increased by ${amount}, new stock ${updated.amount}`,
    });
  } catch (err: any) {
    console.error(`error ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /additembyid:
 *   put:
 *     summary: Add stock by item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock successfully added by ID
 *       400:
 *         description: Error adding stock
 */
router.put("/additembyid", async (req: Request, res: Response) => {
  try {
    const { id, amount } = req.body;
    const updated = await itemService.addStockById(id, amount);
    res.status(200).json({
      message: `Item ID ${id} increased by ${amount}, new stock ${updated.amount}`,
    });
  } catch (err: any) {
    console.error(`error ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});



export default router;
