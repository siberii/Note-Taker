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

app.use(express.static(path.resolve("frontend")));
app.use("/category", express.static(path.resolve("frontend")));

const day = date.getDate();

mongoose.connect("mongodb+srv://admin-siberi:BigCluster95-@cluster0-8w1vs.mongodb.net/notetakerDB", {
  useNewUrlParser: true
});


// Note card schema
const noteSchema = new mongoose.Schema({
  date: String,
  title: String,
  content: String
});

// Collection of note cards (model)
const Note = mongoose.model("Item", noteSchema);

const initialNote = new Note({
  date: day,
  title: "Getting Started",
  content: "Capture ideas, add images to notes, check tasks off your to-do list, and much more. With Note Taker, you can create, share, and collaborate with people on notes and lists."
});


// List of initial notes
const notes = [initialNote];

// Tabs schema
const tabSchema = mongoose.Schema({
  name: String,
  items: [noteSchema]
});

// Collection of tabs (model)
const Tab = mongoose.model("Tab", tabSchema);

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

const archivesTab = new Tab({
  name: "Archives",
  items: []
});

// List of initial tabs
const tabs = [allTab, businessTab, projectTab];


// Tabs schema
const categorySchema = mongoose.Schema({
  name: String,
  tabs: [tabSchema],
  currentTab: tabSchema
});

// Collection of tabs (model)
const Category = mongoose.model("Category", categorySchema);

const overviewCategory = new Category({
  name: "Overview",
  tabs: [allTab],
  currentTab: allTab
});

const notesCategory = new Category({
  name: "Notes",
  tabs: tabs,
  currentTab: allTab
});

const tasksCategory = new Category({
  name: "Tasks",
  tabs: [projectTab],
  currentTab: allTab
});

const archivesCategory = new Category({
  name: "Archives",
  tabs: [archivesTab],
  currentTab: archivesTab
});

// List of initial tabs
const categories = [overviewCategory, notesCategory, tasksCategory, archivesCategory];

Category.find({}, (err, foundCategories) => {
  // Add category to its collection if empty
  if (foundCategories.length === 0) {
    Category.insertMany(categories, err => {
      if (err)
        console.log(err + ": Cannot insert categories" + foundCategories);
      else
        console.log("Categories succesfully inserted! " + foundCategories);
    });
  }
});

let currentCategory = notesCategory;

app.get("/", (req, res) => {
  res.render(path.resolve(__dirname + "/frontend/views/landing.ejs"));
});

app.post("/", (req, res) => {
  if (req.body.buttonGetStarted || req.body.buttonGetStarted2)
    res.redirect("/category/notes");
});

app.get("/category/:categoryName", (req, res) => {
  const categoryName = _.capitalize(req.params.categoryName);

  Category.findOne({
    name: categoryName
  }, (err, foundCategory) => {
    if (!err && foundCategory) {
      // Sets the working category
      currentCategory = foundCategory;
      res.render(path.resolve(__dirname + "/frontend/views/list"), {
        currentCategory: currentCategory.name,
        tabs: foundCategory.tabs,
        currentTab: foundCategory.currentTab
      });
    } else {
      console.log("Error status: " + err + "\nFound Category is " + foundCategory);
    }
  });
});

// Change tab and add note
app.post("/category/:categoryName", (req, res) => {

  currentTabName = req.body.buttonTab;
  const categoryName = _.capitalize(req.params.categoryName);

  // Change tab post
  if (currentTabName) {
    Category.findOne({
      name: categoryName
    }, (err, foundCategory) => {
      if (!err) {
        category = foundCategory;
        foundCategory.tabs.forEach(tab => {
          if (tab.name === currentTabName) {
            // Query Category collection : find a category and update its current tab
            Category.findOneAndUpdate({
                name: categoryName
              }, {
                $set: {
                  currentTab: tab
                }
              },
              (err) => {
                if (!err)
                  console.log("Successfully found category and updated its current tab!");
                else
                  console.log(err + ": Failed to find category and update its current tab!");
              }
            );
          }
        });
      } else
        console.log(err + ": Failed to find category");
    });
  }

  // Add note card to currentTab
  if (req.body.inputAddNote) {

    const newItem = new Note({
      date: day,
      title: req.body.noteTitle,
      content: req.body.noteContent
    });

    // Query Category to find current category by name and push new note card
    Category.findOne({
      _id: currentCategory
    }, (err, foundCategory) => {
      if (!err && foundCategory) {
        const currentTab = foundCategory.tabs.find(tab => {
          return foundCategory.currentTab.name === tab.name;
        });

        currentTab.items.push(newItem);
        foundCategory.currentTab = currentTab;
        currentCategory = foundCategory;
        foundCategory.save();

        console.log("Succesfully added new note!");
      } else {
        console.log(err);
      }
    });
  }
  setTimeout(() => {
    res.redirect("/category/" + req.params.categoryName);
  }, 250);
});

let itemID;
app.post("/category/:categoryName/update", (req, res) => {
  // Retrieve targeted item's ID
  if (req.body.itemID) {
    itemID = req.body.itemID;
    return;
  }

  // Delete note when "deleteNote" post request is sent
  else if (req.body.buttonYes === "deleteNote") {
    Category.findOne({
      _id: currentCategory
    }, (err, foundCategory) => {
      if (!err) {
        const currentTab = foundCategory.tabs.find(tab => {
          return foundCategory.currentTab.name === tab.name;
        });
        // Remove targeted item
        const itemIndex = currentTab.items.findIndex(item => {
          return item._id.toString() === itemID;
        });

        if (itemIndex > -1) {
          currentTab.items.splice(itemIndex, 1);
          //Update currentTab
          foundCategory.currentTab = currentTab;
          foundCategory.save();
          console.log("Succesfully removed note _id: " + itemID + " from " + foundCategory.name + "!");
        }
        console.log("Failed to splice item. itemIndex: " + itemIndex);
      } else {
        console.log(err + " Failed to remove note _id: " + itemID);
      }
    });
  } else if (req.body.buttonSaveNote === "saveChanges") {
    Category.findOne({
      _id: currentCategory
    }, (err, foundCategory) => {
      if (!err) {
        const currentTab = foundCategory.tabs.find(tab => {
          return foundCategory.currentTab.name === tab.name;
        });
        // Update targeted item
        const itemIndex = currentTab.items.findIndex(item => {
          console.log(req.body.itemID);
          console.log(item._id.toString());

          return item._id.toString() === itemID;
        });

        if (itemIndex > -1) {
          currentTab.items[itemIndex].title = req.body.noteTitle;
          currentTab.items[itemIndex].content = req.body.noteContent;
          //Update currentTab
          foundCategory.currentTab = currentTab;
          foundCategory.save();
          console.log("Succesfully removed note _id: " + itemID + " from " + foundCategory.name + "!");
        }
        console.log("Failed to update item. itemIndex: " + itemIndex);
      } else {
        console.log(err + " Failed to remove note _id: " + itemID);
      }
    });
  }
  setTimeout(() => {
    res.redirect("/category/" + currentCategory.name);
  }, 250);
});

app.post("/", (req, res) => {
  res.send(req.body);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully.");
});