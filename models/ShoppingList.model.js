const { Schema, model } = require("mongoose");

const shoppingListSchema = new Schema(
  {
    title: String,
    author: String,
    image: String,
    ingredients: [String],

  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const ShoppingList = model("ShoppingList", shoppingListSchema);

module.exports = ShoppingList;