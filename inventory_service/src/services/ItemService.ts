import fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import db from "../models/index.js";

export interface IItem {
  name?: string;
  amount: number;
  id?: number;
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
      name: item.name!,
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
  async sellItemById(item: IItem) {
    const existedItem = await this.Item.findOne({ where: { id: item.id! } });
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

  async addStock(itemName: string, amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0 to add stock");
    }

    const existedItem = await this.Item.findOne({ where: { name: itemName } });
    if (!existedItem) {
      throw new Error("This item does not exist, create it first");
    }

    existedItem.amount += amount;
    await existedItem.save();
    return existedItem;
  }

  async addStockById(itemId: number, amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0 to add stock");
    }
    const existedItem = await this.Item.findOne({ where: { id: itemId } });
    if (!existedItem) {
      throw new Error("This item does not exist, create it first");
    }
    existedItem.amount += amount;
    await existedItem.save();
    return existedItem;
  }

  async removeStock(itemName: string, amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0 to remove stock");
    }

    const existedItem = await this.Item.findOne({ where: { name: itemName } });
    if (!existedItem) {
      throw new Error("This item does not exist");
    }

    if (existedItem.amount < amount) {
      throw new Error(
        `Not enough stock. Available: ${existedItem.amount}, Requested: ${amount}`
      );
    }

    existedItem.amount -= amount;
    await existedItem.save();
    return existedItem;
  }
}

export default ItemService;
