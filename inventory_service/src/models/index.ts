//index.ts

import sequelize from "./db.js";
import Item from "./item.js";

const db = {
  sequelize,
  Item,
};

export default db;
