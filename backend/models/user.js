const mongoose = require("mongoose");

//User Schema for mongoose
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  {
    timesStamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
