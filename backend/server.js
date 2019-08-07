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
app.use("/category", express.static(path.resolve("../frontend")));

const day = date.getDate();

mongoose.connect("mongodb://localhost:27017/notetakerDB", {
  useNewUrlParser: true
});


// Note card schema
const notesSchema = new mongoose.Schema({
  date: String,
  title: String,
  content: String
});

// Collection of note cards (model)
const Note = mongoose.model("Item", notesSchema);

const initialNote = new Note({
  date: day,
  title: "Getting Started",
  content: "Capture ideas, add images to notes, check tasks off your to-do list, and much more. With Note Taker, you can create, share, and collaborate with people on notes and lists."
});


// List of initial notes
const notes = [initialNote];

// Tabs schema
const tabsSchema = mongoose.Schema({
  name: String,
  items: [notesSchema]
});

// Collection of tabs (model)
const Tab = mongoose.model("Tab", tabsSchema);

const allTab = new Tab({
  name: "All",
  items: notes
});

const businessTab = new Tab({
  name: "Business",
  items: []
});

const projectTab = new Tab({
  name: "Project",
  items: []
});

// List of initial tabs
const tabs = [allTab, businessTab, projectTab];


// Tabs schema
const categoriesSchema = mongoose.Schema({
  name: String,
  tabs: [tabsSchema]
});

// Collection of tabs (model)
const Category = mongoose.model("Category", categoriesSchema);

const overviewCategory = new Category({
  name: "Overview",
  tabs: [allTab]
});

const notesCategory = new Category({
  name: "Notes",
  tabs: tabs
});

const tasksCategory = new Category({
  name: "Tasks",
  tabs: [projectTab]
});

const archivesCategory = new Category({
  name: "Archives",
  tabs: []
});

// List of initial tabs
const categories = [overviewCategory, notesCategory, tasksCategory, archivesCategory];


// TODO: DO THE INITIAL SETUP (EMPTY COLLECTIONS)

app.get("/", (req, res) => {
  
  Category.find({}, (err, foundCategories) => {
    // Add defaut tabs to its collection if empty
    if (foundCategories.length === 0) {
        Category.insertMany(categories, err => {
          if (err) console.log(err + ": Cannot insert categories" + foundCategories);
          else console.log("Categories succesfully inserted! " + foundCategories);
        });
    } else {
      res.render(path.resolve(__dirname + "/../frontend/views/list"), {
        day: day,
        foundCategories: foundCategories
      });
    }
  });
});

app.get("/category/:categoryName", (req, res) => {
  res.render(path.resolve(__dirname + "/../frontend/views/list"), {
    day: day
  });
});

app.post("/category/:categoryName", (req, res) => {
  res.send(req.body);
});

app.post("/", (req, res) => {
  res.send(req.body);
});

const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});