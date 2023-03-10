var express = require("express");
var router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/signup", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out all fields" });
  }

  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "You've already registered" });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);

        User.create({
          password: hashedPass,
          email: req.body.email,
          name: req.body.name,
        })
          .then((createdUser) => {
            const payload = {
              _id: createdUser._id,
              email: createdUser.email,
              name: createdUser.name,
            };

            const token = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "24hr",
            });
            res.json({
              token: token,
              id: createdUser._id,
              message: `Welcome ${createdUser.name}`,
            });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out both fields" });
  }

  User.findOne({ email: req.body.email })
    .populate('shopping_list_created')
    .populate('recipes')
    .then((foundUser) => {
      if (!foundUser) {
        return res
          .status(401)
          .json({ message: "Email or Password is incorrect!!!" });
      }

      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );

      if (doesMatch) {
        const payload = {
          _id: foundUser._id,
          email: foundUser.email,
          name: foundUser.name,
          profile_image: foundUser.profile_image,
          recipes: foundUser.recipes,
          shopping_list_created: foundUser.shopping_list_created,
        };

        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr",
        });
        res.json({
          token: token,
          id: foundUser._id,
          message: `Welcome ${foundUser.email}`,
        });
      } else {
        return res
          .status(402)
          .json({ message: "Email or Password is incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/verify", isAuthenticated, (req, res) => {
  User.findById(req.user._id)
  .populate('shopping_list_created')
  .populate('recipes')
  .then((foundUser) => {
    res.status(201).json(foundUser)
  })
  .catch((err) => {
    console.log(err)
  })

});

module.exports = router;
