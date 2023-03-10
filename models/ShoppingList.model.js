const { Schema, model } = require("mongoose");

const shoppingListSchema = new Schema(
  {
    ingredients: [Object],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const ShoppingList = model("ShoppingList", shoppingListSchema);

module.exports = ShoppingList;