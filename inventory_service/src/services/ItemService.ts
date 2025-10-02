import fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import db from "../models/index.js";

interface IItem {
  name: string;
  amount: number;
}

class ItemService {
  private Item = db.Item;

  async getAllItems() {
    return this.Item.findAll({ where: {} });
  }

  async addNewItem(item: IItem) {
    const existedItem = await this.Item.findOne({ where: { name: item.name } });

    if (existedItem) {
      throw new Error("this item already exists");
    }
    return await this.Item.create({
      name: item.name,
      amount: item.amount,
    });
  }

  async sellItem(item: IItem) {
    const existedItem = await this.Item.findOne({ where: { name: item.name } });
    if (!existedItem) {
      throw new Error("This item does not exist");
    }
    if (item.amount > existedItem.amount) {
      throw new Error(
        `Demanded Item amount: ${item.amount} is more than existed Item in Stock: ${existedItem.amount}`
      );
    }
    existedItem.amount -= item.amount;
    await existedItem.save();
    return existedItem;
  }
  async updateItem(newItem: IItem) {
    const existedItem = await this.Item.findOne({
      where: { name: newItem.name },
    });

    if (existedItem) {
      throw new Error("this item already exists you can only update it");
    }
  }
}

export default ItemService;
