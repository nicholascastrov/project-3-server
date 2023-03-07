var express = require('express');
var router = express.Router();

const User = require('../models/User.model');

router.get('/profile/:userId', (req, res, next) => {

  User.findById(req.params.userId)
    .populate('recipes')

    .then((foundUser) => {
      res.json(foundUser)
    })
    .catch((err) => {
      console.log(err)
    })
  
});

router.post('/profile-edit/:userId', (req, res, next) => {

  User.findByIdAndUpdate(req.params.userId, 
    {

      name: req.body.name,
      profile_image: req.body.profile_image,
      age: req.body.age

    },
    {new: true}
    )
    .then((updatedUser) => {
      res.json(updatedUser)
    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router;
