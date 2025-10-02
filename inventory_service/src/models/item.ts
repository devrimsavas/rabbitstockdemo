//item.ts

import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db.js"; // aynı instance

interface ItemModel
  extends Model<
    InferAttributes<ItemModel>,
    InferCreationAttributes<ItemModel>
  > {
  id: CreationOptional<number>;
  name: string;
  amount: number;
}

const Item = sequelize.define<ItemModel>("Item", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
});

export default Item;
