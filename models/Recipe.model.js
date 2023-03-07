const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {

    title: String,
    description: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    image: String,
    prep_time: Number,
    servings: Number,
    ingredients: [String],
    directions: [String]

  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;