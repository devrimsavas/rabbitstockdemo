import axios from "axios";
import ItemService, { type IItem } from "../services/ItemService.js";

const itemService = new ItemService();

const populateDataBase = async () => {
  const existing = await itemService.getAllItems();
  if (existing.length > 0) {
    console.log("Database already Populated skipping...");
    return;
  }
  const url = "https://api.escuelajs.co/api/v1/products";
  const allProducts = await axios.get(url);
  const data = allProducts.data;
  const products = Array.isArray(data) ? data : data.data;

  for (const item of products) {
    const newItem: IItem = {
      name: item.title,
      amount: Math.floor(Math.random() * (50 - 20 + 1)) + 20, // 20–50 arası random
    };

    try {
      await itemService.addNewItem(newItem);
      console.log(`Added: ${newItem.name} (${newItem.amount})`);
    } catch (err: any) {
      console.log(`Skipped: ${newItem.name} (${err.message})`);
    }
  }
};

export default populateDataBase;
