//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

mongoose.set("useFindAndModify", false);

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("frontend/public"));

mongoose.connect("mongodb://localhost:27017/notetakerDB", {
  useNewUrlParser: true
});

app.get("/", (req, res) => {
  const path = require("path");
  res.sendFile(path.resolve("__dirname + /../frontend/index.html"));
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});