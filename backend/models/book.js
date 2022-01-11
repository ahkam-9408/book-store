const mongoose = require("mongoose");

//Book Schema for mongoose
const bookSchema = mongoose.Schema(
  {
    book_name: {
      type: String,
      required: true,
    },
    isbn_number: {
      type: String,
    },
    amount: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    author_name: {
      type: String,
      required: true,
    },
  },
  {
    timesStamps: true,
    collection: "books",
  }
);

module.exports = mongoose.model("Book", bookSchema);
