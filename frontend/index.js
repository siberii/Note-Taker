//jshint esversion:6

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
const closeNote = document.querySelector(".btn-close");
listenCardEvents(cardNote, closeNote);


const hamburger = document.querySelector("#hamburger");
let isShrunk = false;
hamburger.addEventListener("click", () => {
  toogleSidebar();
});

//TODO AUTOFOCUS WHEN OPENING/CREATING NOTE

function toogleSidebar() {
  if (!isShrunk) {
    skrinkSidebar();
    isShrunk = true;
  } else {
    expandSidebar();
    isShrunk = false;
  }

  function skrinkSidebar() {
    const main = document.querySelector("main");
    main.classList.add("increase-columns");

    const background = document.querySelector(".bg");
    const tabs = document.querySelector(".tabs");
    const header = document.querySelector("header");


    main.style.width = "1820px";
    tabs.style.width = "1729px";
    header.style.width = "1820px";

    const gap = -286;
    main.style.transform = "translateX(" + gap + "px)";
    tabs.style.transform = "translateX(" + gap + "px)";
    const headerOffset = gap + 2;
    header.style.transform = "translateX(" + headerOffset + "px)";

    const initialX = -37.5;
    const bgY = -50;
    background.style.transform = `translate( calc(${initialX}% + ${gap}px),${bgY}%)`;

  }

  function expandSidebar() {
    const main = document.querySelector("main");
    main.classList.remove("increase-columns");

    document.querySelector(".left-wrapper").style.width = "auto";
    const background = document.querySelector(".bg");
    const tabs = document.querySelector(".tabs");
    const header = document.querySelector("header");


    main.style.width = "1532px";
    tabs.style.width = "1443px";
    header.style.width = "1820px";

    // TODO FIX SIDE SCROLL AND AWK JERK AND RESIZING
    main.style.transform = "translateX(" + (0) + "px)";
    tabs.style.transform = "translateX(" + (0) + "px)";
    header.style.transform = "translateX(" + (0) + "px)";
    const initialX = -37.5;
    const bgY = -50;

    background.style.transform = `translate( calc(${initialX}%),${bgY}%)`;
  }
}

function listenCardEvents(cardNote, closeNote) {
  cardNote.addEventListener("click", (e) => {
    createNoteEditor(e);
  });
  cardNote.addEventListener("mouseover", () => {
    closeNote.classList.add("appear");
  });
  cardNote.addEventListener("mouseout", () => {
    closeNote.classList.remove("appear");
  });
  closeNote.addEventListener("click", (e) => {
    e.stopPropagation();
    createCaution(e.target.parentElement.parentElement);
  });
}

function createCaution(card) {
  const caution = document.createElement("div");
  caution.classList.add("caution");

  const cautionMsg = document.createElement("div");
  cautionMsg.classList.add("caution-msg");
  cautionMsg.innerHTML = "Are you sure you want to <b>delete</b> this note?";

  const buttonCaution = document.createElement("div");
  buttonCaution.classList.add("btn-caution");

  const buttonYes = document.createElement("button");
  buttonYes.classList.add("btn-caution-yes");
  buttonYes.innerText = "Yes";
  buttonYes.addEventListener("click", () => {
    card.remove();
    caution.remove();
    removeBgBlur();
  });

  const buttonNo = document.createElement("button");
  buttonNo.classList.add("btn-caution-no");
  buttonNo.innerText = "No";
  buttonNo.addEventListener("click", () => {
    caution.remove();
    removeBgBlur();
  });

  buttonCaution.appendChild(buttonYes);
  buttonCaution.appendChild(buttonNo);

  caution.appendChild(cautionMsg);
  caution.appendChild(buttonCaution);

  addBgBlur();

  document.querySelector("body").appendChild(caution);
}


/**
 * Represents a pop-up window able to create note cards
 * @param {event} e 
 */
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

  // Focus note content when the thread becomes idle
  window.setTimeout(function () {
    noteContent.focus();
  }, 0);

  noteContent.addEventListener("keydown", () => {
    autoGrow(noteContent);
  });

  const buttons = document.createElement("div");
  buttons.classList.add("overlay-buttons");

  const buttonCreatorNote = document.createElement("button");
  buttonCreatorNote.classList.add("btn-creator-add-note");
  buttonCreatorNote.innerText = "Save";
  buttonCreatorNote.addEventListener("click", () => {
    target.querySelector(".card-title").innerText = noteTitle.value;
    target.querySelector(".card-content").innerText = noteContent.value;
    document.querySelector(".overlay-note-creator").remove();
    removeBgBlur();
    target.scrollIntoView();
  });

  const buttonCancel = document.createElement("button");
  buttonCancel.classList.add("btn-creator-cancel");
  buttonCancel.innerText = "Cancel";
  buttonCancel.addEventListener("click", () => {
    document.querySelector(".overlay-note-creator").remove();
    removeBgBlur();
    target.scrollIntoView();
  });

  buttons.appendChild(buttonCreatorNote);
  buttons.appendChild(buttonCancel);


  const overlayNoteCreator = document.createElement("div");
  overlayNoteCreator.classList.add("overlay-note-creator");
  overlayNoteCreator.appendChild(noteTitle);
  overlayNoteCreator.appendChild(noteContent);
  overlayNoteCreator.appendChild(buttons);

  addBgBlur();

  const body = document.querySelector("body");
  body.appendChild(overlayNoteCreator);

  autoGrow(noteContent);
}

function removeBgBlur() {
  document.querySelector(".bg-blur").classList.add("bg-blur-gone");
  setTimeout(() => {
    document.querySelector(".bg-blur").classList.remove("bg-blur-front");
  }, 200);
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

  // Focus note content when the thread becomes idle
  window.setTimeout(function () {
    noteContent.focus();
  }, 0);

  noteContent.addEventListener("keydown", () => {
    autoGrow(noteContent);
  });

  const buttons = document.createElement("div");
  buttons.classList.add("overlay-buttons");


  const buttonCreatorNote = document.createElement("button");
  buttonCreatorNote.classList.add("btn-creator-add-note");
  buttonCreatorNote.innerText = "Add note";


  const buttonCancel = document.createElement("button");
  buttonCancel.classList.add("btn-creator-cancel");
  buttonCancel.innerText = "Cancel";

  listenAddCancelButton(buttonCreatorNote, buttonCancel);

  buttons.appendChild(buttonCreatorNote);
  buttons.appendChild(buttonCancel);


  const overlayNoteCreator = document.createElement("div");
  overlayNoteCreator.classList.add("overlay-note-creator");
  overlayNoteCreator.appendChild(noteTitle);
  overlayNoteCreator.appendChild(noteContent);
  overlayNoteCreator.appendChild(buttons);

  addBgBlur();

  const body = document.querySelector("body");
  body.appendChild(overlayNoteCreator);
}

function listenAddCancelButton(buttonCreatorNote, buttonCancel) {
  buttonCreatorNote.addEventListener("click", () => {
    createNoteCard();
    removeBgBlur();
  });
  buttonCancel.addEventListener("click", () => {
    document.querySelector(".overlay-note-creator").remove();
    removeBgBlur();
  });
}

function addBgBlur() {
  const bgBlur = document.querySelector(".bg-blur");
  bgBlur.classList.remove("bg-blur-gone");
  bgBlur.classList.add("bg-blur-front");
}

function createNoteCard() {
  const card = document.createElement("div");
  card.classList.add("card");

  const buttonClose = document.createElement("div");
  buttonClose.classList.add("card-close");
  const closeImage = document.createElement("img");
  closeImage.classList.add("btn-close");
  closeImage.src = "public/images/close-btn.svg";
  closeImage.alt = "close button";
  buttonClose.appendChild(closeImage);

  const date = document.createElement("div");
  date.classList.add("card-date");
  date.innerText = "July 26, 2019";
  const title = document.createElement("div");
  title.classList.add("card-title");
  const noteTitle = document.querySelector(".note-title");
  title.innerText = noteTitle.value;
  const content = document.createElement("div");
  content.classList.add("card-content");
  const noteContent = document.querySelector(".note-content");
  content.innerText = noteContent.value;

  listenCardEvents(card, closeImage);

  card.appendChild(buttonClose);
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
  element.style.height = "1px";
  element.style.height = (25 + element.scrollHeight) + "px";
}