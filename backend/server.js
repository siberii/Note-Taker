//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const path = require("path");

mongoose.set("useFindAndModify", false);

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static(path.resolve("../frontend")));

mongoose.connect("mongodb://localhost:27017/notetakerDB", {
  useNewUrlParser: true
});

app.get("/", (req, res) => {
  res.render(path.resolve(__dirname + "/../frontend/views/list.ejs"));
});

const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});