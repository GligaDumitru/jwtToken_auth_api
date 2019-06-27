const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const PORT = process.env.PORT || 5000;
const db = require("./database/connection");
const userRouter = require("./routes/user");

mongoose
  .connect(db.connection, { useNewUrlParser: true })
  .then(
    _ => console.log("Connection established"),
    err => console.log("err", err)
  );

const server = express();

server.use(passport.initialize());
require("./passport")(passport);

// Body Parser for json from request
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Routes
server.use("/api/v1/users", userRouter);

server.listen(PORT, _ => console.log(`Server is running on port: ${PORT}`));
