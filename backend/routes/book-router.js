const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// User Model
const bookSchema = require("../models/book");

const jwt_secret_key = "book@store#152";

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
 * Create new Book
 */
router.route("/create-book").post(verifyJWT, (req, res, next) => {
  console.log(req.user);
  req.user.role === "AUTHOR"
    ? bookSchema.create(req.body, (error, data) => {
        if (error) {
          return next(error);
        } else {
          console.log(data);
          res.json({ ...data, message: "Successfully Created" });
        }
      })
    : res.json({ message: "Unauthorized Access" });
});

/**
 * Not Working - get by inactive value
 */

// router.route("/a").get((req, res) => {
//   bookSchema.aggregate(
//     [
//       {
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "author",
//           as: "Authors",
//         },
//       },
//       {
//         $unwind: "$Author",
//       },
//       {
//           $addFields:{
//               "author_name": "$Author.name",
//             //   "author_id":"$Author._id"
//           }
//       },
//       {
//           $project:{
//               author:1
//           }
//       }
//     ],
//     (error, data) => {
//       if (error) console.log(error);
//       else res.json(data);
//     }
//   );
// });

/**
 * get all books
 */

router.route("/").get((req, res) => {
  bookSchema.find((error, data) => {
    if (error) return next(error);
    else res.json(data);
  });
});

module.exports = router;
