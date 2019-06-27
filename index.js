const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const PORT = process.env.PORT || 5000;
const db = require("./database/connection");
const userRouter = require("./routes/user");
const cors = require("cors");


mongoose
  .connect(process.env.MONGODB_URI || db.connection, { useNewUrlParser: true })
  .then(
    _ => console.log("Connection established"),
    err => console.log("err", err)
  );

const server = express();
server.use(cors());
server.use(passport.initialize());
require("./passport")(passport);

// Body Parser for json from request
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Routes
server.use("/api/v1/users", userRouter);
server.get("/", (req, res) => {
  res.status(200).json({
    msg: "Welcome"
  });
});

server.listen(PORT, _ => console.log(`Server is running on port: ${PORT}`));
