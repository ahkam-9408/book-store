const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let cors = require("cors");

const userRoute = require("./routes/user-routes");
const bookRoute = require("./routes/book-router");

const app = express();
app.use(cors());

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json(), urlencodedParser);

//Mongodb connection url
const mongoURI = "mongodb://localhost:27017/book-store";

//connect with mongodb using mongoose
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(process.env.PORT, () => console.log("DB is live"));
  })
  .catch((err) => console.log(err));

//user and book routes
app.use("/user", userRoute);
app.use("/book", bookRoute);

app.listen(4000, () => console.log("Server run on ", 4000));
