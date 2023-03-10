var express = require("express");
var router = express.Router();

const ShoppingList = require("../models/ShoppingList.model");
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/new-shopping-list", isAuthenticated, (req, res, next) => {
  ShoppingList.create({ ingredients: req.body.ingredients })
    .then((newList) => {
      console.log("This is the created list", newList);
      return User.findByIdAndUpdate(req.user._id, {
        $push: { shopping_list_created: newList._id },
      }, {new: true});
    })
    .then((updatedUser) => {
      return updatedUser.populate("recipes");
    })
    .then((populated) => {
      return populated.populate("shopping_list_created");
    })
    .then((finalUser) => {
      console.log("User with new list", finalUser);
      res.json(finalUser);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/delete/:id', isAuthenticated, (req, res, next) => {
    ShoppingList.findByIdAndDelete(req.params.id)
        .then((deletedList) => {
            console.log(deletedList)
            return User.findByIdAndUpdate(req.user._id,
                {
                    $pull: {shopping_list_created: req.params.id}
                },
                {new: true})
        })
        .then((updatedUser) => {
            return updatedUser.populate("recipes");
          })
          .then((populated) => {
            return populated.populate("shopping_list_created");
          })
          .then((finalUser) => {
            res.json(finalUser)
          })
          .catch((err) => {
            console.log(err)
          })
})

module.exports = router;
