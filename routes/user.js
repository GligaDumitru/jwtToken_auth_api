const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require("../models/User");

// Register Route
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(isValid);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password, avatar } = req.body;
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({
        error: "email already exists"
      });
    } else {
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name,
        email,
        password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log("There was an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log("err", err);
            else {
              newUser.password = hash;
              newUser.save().then(user => {
                res.status(201).json(user);
              });
            }
          });
        }
      });
    }
  });
  //   return res.status(201).json(req.body);
});

// Login Route
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };

          jwt.sign(
            payload,
            "secret",
            {
              expiresIn: 3600
            },
            (err, token) => {
              if (err) console.log("err", err);
              else {
                res.json({ success: true, token: `Bearer ${token}` });
              }
            }
          );
        } else {
          errors.password = "Incorrect Password";
          return res.status(400).json(errors);
        }
      });
    }
  });
});

// Me Route
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
