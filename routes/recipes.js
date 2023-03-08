var express = require("express");
var router = express.Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

router.get("/user-recipes", (req, res, next) => {
  Recipe.find()
    .then((foundRecipes) => {
      console.log("Found Recipes", foundRecipes);
      res.json(foundRecipes);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/user-recipe-details/:recipeId", (req, res, next) => {
  Recipe.findById(req.params.recipeId)
    .then((foundRecipe) => {
      console.log("HHHHHEEELLLOOO", req.params.recipeId);
      res.json(foundRecipe);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/add-recipe/:userId", (req, res, next) => {
  const {
    title,
    description,
    image,
    prep_time,
    servings,
    ingredients,
    directions,
  } = req.body;

  const { userId } = req.params;

  const newArray = ingredients.split(",");
  console.log(newArray);
  const newest = newArray.map((item) => {
    return item.trim("");
  });

  const newDirectionsArray = directions.split(",");
  const newestDirections = newDirectionsArray.map((item) => {
    return item.trim("");
  });

  let newRecipe = {
    title,
    description,
    author: userId,
    image,
    prep_time,
    servings,
    ingredients: newest,
    directions: newestDirections,
  };

  Recipe.create(newRecipe).then((createdRecipe) => {
    User.findByIdAndUpdate(
      req.params.userId,
      {
        $push: { recipes: createdRecipe._id },
      },
      { new: true }
    )
      .then((updatedUser) => {
        console.log(updatedUser);
        res.json(createdRecipe);
      })
      .catch((err) => {
        console.log(err);
      });
    return createdRecipe;
  });
});

router.post("/edit-recipe/:recipeId/:userId", (req, res, next) => {
  const {
    title,
    description,
    image,
    prep_time,
    servings,
    ingredients,
    directions,
  } = req.body;

  const { userId, recipeId } = req.params;

  let newest = ingredients;

  if (typeof ingredients === "string") {
    let newArray = ingredients.split(",");
    console.log(newArray);
    newest = newArray.map((item) => {
      return item.trim("");
    });
  }

  let newestDirections = directions;

  if (typeof directions === "string") {
    let newestDirectionsArray = directions.split(",");
    newestDirections = newestDirectionsArray.map((item) => {
      return item.trim("");
    });
  }

  Recipe.findByIdAndUpdate(
    req.params.recipeId,
    {
      title,
      description,
      author: userId,
      image,
      prep_time,
      servings,
      ingredients: newest,
      directions: newestDirections,
    },
    { new: true }
  )
    .then((updatedRecipe) => {
      res.json(updatedRecipe);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/delete-recipe/:recipeId/:userId", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { $pull: { recipes: req.params.recipeId } },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      Recipe.findById(req.params.recipeId)
      .then((results) => {
        console.log("FOUND USER => DELETE ROUTE", updatedUser);
        if (String(results.author) === req.params.userId) {
          Recipe.findByIdAndDelete(req.params.recipeId)
            .then((deletedRecipe) => {
              res.json(deletedRecipe);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send("Error deleting recipe");
            });
        } else {
          res.json({ message: "You can't delete this post" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error finding user");
    });
});

module.exports = router;
