const express = require("express");
const router = express.Router();
//Load User Model
const user = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//test
// @route GET /api/users/test
// @desc Tests users routes
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users are working" }));

router.get("/swapnil", (req, res) =>
  res.json({ msg: "Just a custom message" })
);

// @route GET /api/users/register
// @desc Tests users routes
// @access Public
router.post("/register", (req, res) => {
  //User.findOne({ email: req.body.email });
  //req.body is accessible here because we've added body parser to server.js
  user.findOne({ email: req.body.email }).then(user => {
    //if user exists in mongodatabase
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET /api/users/login
// @desc Login user/ return user's JWT (json web token)token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user my email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User email not found" });
    }
    //chekc password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create JWT payload

        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});
module.exports = router;
