var express = require("express");
var router = express.Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

router.get("/profile/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .populate('recipes')
    .then((user) => {
      res.json(user.recipes);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error finding user');
    });
});

router.post("/profile-edit/:userId", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.userId,
    {
      name: req.body.name,
      profile_image: req.body.profile_image,
      age: req.body.age,
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
