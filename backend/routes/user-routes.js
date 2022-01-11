const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

// User Model
const userSchema = require("../models/user");

/**
 * This is secret key for jwt token creation and token decode
 */
const jwt_secret_key = "book@store#152";

/**
 * this register code
 */
router.route("/register").post(async (req, res, next) => {
  const user = req.body;

  const exitingusername = await userSchema.findOne({ username: user.username });

  if (exitingusername) {
    res.json({ message: "Username Already been Taken" });
  } else {
    const name = user.name;
    const username = user.username;
    const hashpwd = await bcrypt.hash(user.password, 10);

    const data = {
      name: name,
      username: username,
      password: hashpwd,
      role: "AUTHOR",
      level: "ACTIVE",
    };

    userSchema.create(data, (error, data) => {
      if (error) {
        return next(error);
      } else {
        console.log(data);
        res.json({ message: "Successfully Registered" });
      }
    });
  }
});

/**
 * This router use for login
 * JWT token gerented in below code
 */

router.route("/login").post((req, res) => {
  const user = req.body;

  userSchema.findOne({ username: user.username }).then((dbuser) => {
    if (!dbuser) {
      return res.json({ message: "Invalid Username" });
    }
    bcrypt.compare(user.password, dbuser.password).then((isCorrect) => {
      if (isCorrect) {
        const payload = {
          id: dbuser._id,
          username: dbuser.username,
          role: dbuser.role,
          name: dbuser.name,
        };
        //jwt token generate
        jwt.sign(
          payload,
          jwt_secret_key,
          //time limit set to the 15 minutes. It means 900seconds
          { expiresIn: 900 },
          // { expiresIn: 86400 },
          (err, token) => {
            if (err) return res.json({ message: err });
            return res.json({
              message: "Success",
              token: "Bearer " + token,
              id: dbuser._id,
              name: dbuser.name,
              role: dbuser.role,
            });
          }
        );
        // return res.json(payload);
      } else {
        return res.json({ message: "Invalid Password" });
      }
    });
  });
});

/**
 * This is used to verify the JWT token
 * if valid token given you can access recourse
 * otherwise he can't access
 */
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(" ")[1];
  console.log(token);

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decode) => {
      if (err)
        return res.json({
          isLogginIn: false,
          message: "Session Expired!!",
        });
      req.user = {};
      req.user.id = decode.id;
      req.user.username = decode.username;
      req.user.role = decode.role;
      next();
    });
  } else {
    res.json({ message: "Incorrect token given", isLogginIn: false });
  }
};

/**
 * This is return id an tole using jwt token
 */
router.route("/getIdAndRole").get(verifyJWT, (req, res) => {
  res.json({
    isLogginIn: true,
    id: req.user.id,
    role: req.user.role,
  });
});

/**
 * this is return users array
 */
router.route("/getByRole/:role").get(verifyJWT, (req, res) => {
  req.user.role === "ADMIN"
    ? userSchema.find(
        { role: req.params.role },
        { password: 0, __v: 0 },
        (error, data) => {
          if (error) return next(error);
          else res.json(data);
        }
      )
    : res.json({ message: "Unauthorized Access" });
});

/**
 * This is used to update status of the author
 * ids is an array with multiple _ids
 * level should be ACTIVE or INACIVE
 */
router.route("/status-update").put(verifyJWT, (req, res) => {
  req.user.role === "ADMIN"
    ? userSchema.updateMany(
        { _id: req.body.ids },
        { $set: { level: req.body.level } },
        (error, data) => {
          if (error) return console.log(error);
          else res.json({ ...data, message: "Successfully Updated!!" });
        }
      )
    : res.json({ message: "Unauthorized Access" });
});

module.exports = router;
