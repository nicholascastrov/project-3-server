const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
    type: String,
    required: true,
    unique: true
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    profile_image: String,
    recipes: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
    shopping_list_created: [{type: Schema.Types.ObjectId, ref: 'ShoppingList'}],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;