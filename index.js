const buttonTab = document.querySelector(".btn-tab-add");
buttonTab.addEventListener("click", () => {
  createTab();
});


const buttonNote = document.querySelector(".btn-note-add");
buttonNote.addEventListener("click", () => {
  createNoteCreator();
});


const tabs = document.getElementsByClassName("tab");
for (const tab of tabs) {
  tab.addEventListener("click", () => {
    toggleSelectedTab(tab);
  });
}


const groups = document.getElementsByClassName("group");
for (const group of groups) {
  group.addEventListener("click", () => {
    toggleSelectedGroup(group);
  });
}


const cardNote = document.querySelector(".card");
cardNote.addEventListener("click", (e) => {
  createNoteEditor(e);
});


function createNoteEditor(e) {
  const target = e.currentTarget || e.srcElement;
  // Create note elements
  const noteTitle = document.createElement("input");
  noteTitle.classList.add("note-title");
  noteTitle.value = target.querySelector(".card-title").innerText;
  noteTitle.placeholder = "Title";
  const noteContent = document.createElement("textarea");
  noteContent.classList.add("note-content");
  noteContent.value = target.querySelector(".card-content").innerText;
  noteContent.placeholder = "Take a note...";
  noteContent.autofocus = true;
  
  noteContent.addEventListener("keydown", () => {
    autoGrow(noteContent);
  });

  const buttonCreatorNote = document.createElement("button");
  buttonCreatorNote.classList.add("btn-creator-add-note");
  buttonCreatorNote.innerText = "Save";
  buttonCreatorNote.addEventListener("click", () => {
    target.querySelector(".card-title").innerText = noteTitle.value;
    target.querySelector(".card-content").innerText = noteContent.value;
    document.querySelector(".overlay-note-creator").remove();
    target.scrollIntoView();
  });
  const overlayNoteCreator = document.createElement("div");
  overlayNoteCreator.classList.add("overlay-note-creator");
  overlayNoteCreator.appendChild(noteTitle);
  overlayNoteCreator.appendChild(noteContent);
  overlayNoteCreator.appendChild(buttonCreatorNote);
  const body = document.querySelector("body");
  body.appendChild(overlayNoteCreator);

  autoGrow(noteContent);
}

function createTab() {
  const div = document.createElement("div");
  div.classList.add("tab");
  div.innerText = "New Tab";
  div.addEventListener("click", () => {
    toggleSelectedTab(div);
  });
  const sections = document.querySelector(".sections");
  sections.appendChild(div);
}

function createNoteCreator() {
  // Create note elements
  const noteTitle = document.createElement("input");
  noteTitle.classList.add("note-title");
  noteTitle.placeholder = "Title";

  const noteContent = document.createElement("textarea");
  noteContent.classList.add("note-content");
  noteContent.placeholder = "Take a note...";
  noteContent.autofocus = true;
  noteContent

  const buttonCreatorNote = document.createElement("button");
  buttonCreatorNote.classList.add("btn-creator-add-note");
  buttonCreatorNote.innerText = "Add new note";
  buttonCreatorNote.addEventListener("click", () => {
    createNoteCard();
  });

  const overlayNoteCreator = document.createElement("div");
  overlayNoteCreator.classList.add("overlay-note-creator");
  overlayNoteCreator.appendChild(noteTitle);
  overlayNoteCreator.appendChild(noteContent);
  overlayNoteCreator.appendChild(buttonCreatorNote);

  const body = document.querySelector("body");
  body.appendChild(overlayNoteCreator);
}

function createNoteCard() {
  const card = document.createElement("div");
  card.classList.add("card");
  const date = document.createElement("div");
  date.classList.add("card-date");
  date.innerText = "July 26, 2019";
  const title = document.createElement("div");
  title.classList.add("card-title");
  const noteTitle = document.querySelector(".note-title");
  title.innerText = noteTitle.value;
  const content = document.createElement("div");
  content.classList.add("card-content");
  const noteContent = document.querySelector(".note-content")
  content.innerText = noteContent.value;

  card.addEventListener("click", (e) => {
    createNoteEditor(e);
  });

  card.appendChild(date);
  card.appendChild(title);
  card.appendChild(content);
  const main = document.querySelector("main");
  main.appendChild(card);

  document.querySelector(".overlay-note-creator").remove();
  card.scrollIntoView();
}

function toggleSelectedTab(tab) {
  const selectedTab = document.querySelector(".tab-selected");
  selectedTab.classList.toggle("tab-selected");
  tab.classList.toggle("tab-selected");
}

function toggleSelectedGroup(section) {
  const selectedGroup = document.querySelector(".group-selected");
  selectedGroup.classList.toggle("group-selected");
  section.classList.toggle("group-selected");
}

// Dynamically size textarea
function autoGrow(element) {
  console.log(element + " auto_grow activated!");
  
  element.style.height = "1px";
  element.style.height = (25+element.scrollHeight)+"px";
}