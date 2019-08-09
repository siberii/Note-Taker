//jshint esversion:6

const buttonTab = document.querySelector(".btn-tab-add");
buttonTab.addEventListener("click", () => {
  createTab();
});

const buttonNote = document.querySelector(".btn-note-add");
buttonNote.addEventListener("click", () => {
  createNoteGenerator();
});


const tabs = document.getElementsByClassName("tab");
for (const tab of tabs) {
  tab.addEventListener("click", () => {
    document.querySelector(".form-tab").submit();
  });
}

const groups = document.getElementsByClassName("group");
for (const group of groups) {
  group.addEventListener("click", () => {
    toggleSelectedGroup(group);
  });
}

const cardNotes = document.querySelectorAll(".card");
const closeNotes = document.querySelectorAll(".btn-close");
listenCardEvents(cardNotes, closeNotes);

const hamburger = document.querySelector("#hamburger");
let isShrunk = false;
hamburger.addEventListener("click", () => {
  toogleSidebar();
});



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

function listenCardEvents(cardNotes, closeNotes) {
  for (const cardNote of cardNotes) {
    cardNote.addEventListener("click", (e) => {
      createNoteEditor(e);
    });
    cardNote.addEventListener("mouseover", (e) => {

      if (e.target.querySelector(".btn-close"))
        e.target.querySelector(".btn-close").classList.add("appear");
      else
        e.target.parentElement.querySelector(".btn-close").classList.add("appear");

    });
    cardNote.addEventListener("mouseout", (e) => {
      if (e.target.querySelector(".btn-close"))
        e.target.querySelector(".btn-close").classList.remove("appear");
      else
        e.target.parentElement.querySelector(".btn-close").classList.remove("appear");
    });
  }

  for (const closeNote of closeNotes) {
    closeNote.addEventListener("click", (e) => {
      e.stopPropagation();
      createCaution(e.target.parentElement.parentElement);
    });
  }
}

function createCaution(card) {
  const caution = document.createElement("div");
  caution.classList.add("caution");

  const cautionMsg = document.createElement("div");
  cautionMsg.classList.add("caution-msg");
  cautionMsg.innerHTML = "Are you sure you want to <b>delete</b> this note?";

  const form = document.createElement("form");
  form.classList.add("form-delete-note");
  const currentCategory = document.querySelector(".tab-selected").value;
  form.action = "/category/:" + currentCategory + "/delete";
  form.method = "post";

  const buttonCaution = document.createElement("div");
  buttonCaution.classList.add("btn-caution");

  const buttonYes = document.createElement("button");
  buttonYes.classList.add("btn-caution-yes");
  buttonYes.innerText = "Yes";
  buttonYes.type = "submit";
  buttonYes.name = "buttonYes";
  buttonYes.value = "deleteNote";
  buttonYes.addEventListener("click", (e) => {
    console.log(e.target.parentElement.parentElement);
    
    e.target.parentElement.parentElement.querySelector(".form-delete-note").submit();
    card.remove();
    caution.remove();
    removeBgBlur();
  });

  const buttonNo = document.createElement("button");
  buttonNo.classList.add("btn-caution-no");
  buttonNo.innerText = "No";
  buttonNo.type = "submit";
  buttonNo.addEventListener("click", () => {
    caution.remove();
    removeBgBlur();
  });

  buttonCaution.appendChild(buttonYes);
  buttonCaution.appendChild(buttonNo);

  form.appendChild(cautionMsg);
  form.appendChild(buttonCaution);
  caution.appendChild(form);

  addBgBlur();

  document.querySelector("body").appendChild(caution);
}


/**
 * Represents a pop-up window able to edit note cards
 * @param {event} e 
 */
function createNoteEditor(e) {
  const target = e.currentTarget || e.srcElement;

  // Create note editor elements
  const form = document.createElement("form");
  form.action = "";
  form.method = "post";

  const noteTitle = document.createElement("input");
  noteTitle.classList.add("note-title");
  noteTitle.value = target.querySelector(".card-title").innerText;
  noteTitle.name = "noteTitle";
  noteTitle.placeholder = "Title";
  noteTitle.autocomplete = "off";

  const noteContent = document.createElement("textarea");
  noteContent.classList.add("note-content");
  noteContent.value = target.querySelector(".card-content").innerText;
  noteContent.name = "noteContent";
  noteContent.placeholder = "Take a note...";
  noteContent.autocomplete = "off";

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
  buttonCreatorNote.name = "buttonSaveNote";
  buttonCreatorNote.type = "submit";
  buttonCreatorNote.addEventListener("click", () => {
    form.submit();
    target.querySelector(".card-title").innerText = noteTitle.value;
    target.querySelector(".card-content").innerText = noteContent.value;
    document.querySelector(".overlay-note-creator").remove();
    removeBgBlur();
    target.scrollIntoView();
  });

  const buttonCancel = document.createElement("button");
  buttonCancel.classList.add("btn-creator-cancel");
  buttonCancel.innerText = "Cancel";
  buttonCancel.type = "button";
  buttonCancel.addEventListener("click", () => {
    document.querySelector(".overlay-note-creator").remove();
    removeBgBlur();
    target.scrollIntoView();
  });

  buttons.appendChild(buttonCreatorNote);
  buttons.appendChild(buttonCancel);


  const overlayNoteCreator = document.createElement("div");
  overlayNoteCreator.classList.add("overlay-note-creator");
  form.appendChild(noteTitle);
  form.appendChild(noteContent);
  form.appendChild(buttons);
  overlayNoteCreator.appendChild(form);

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

/**
 * Represents a pop-up window able to create note cards 
 */
function createNoteGenerator() {
  // Create note generator elements
  const form = document.createElement("form");
  form.classList.add("form-note-add");
  form.action = "";
  form.method = "post";

  const noteTitle = document.createElement("input");
  noteTitle.classList.add("note-title");
  noteTitle.placeholder = "Title";
  noteTitle.name = "noteTitle";
  noteTitle.autocomplete = "off";

  const noteContent = document.createElement("textarea");
  noteContent.classList.add("note-content");
  noteContent.placeholder = "Take a note...";
  noteContent.name = "noteContent";
  noteContent.autocomplete = "off";


  // Focus note content when the thread becomes idle
  window.setTimeout(function () {
    noteContent.focus();
  }, 0);

  noteContent.addEventListener("keydown", () => {
    autoGrow(noteContent);
  });

  const buttons = document.createElement("div");
  buttons.classList.add("overlay-buttons");

  const inputAddNote = document.createElement("input");
  inputAddNote.type = "hidden";
  inputAddNote.name = "inputAddNote";
  inputAddNote.value = "AddNote";

  const buttonCreatorNote = document.createElement("button");
  buttonCreatorNote.classList.add("btn-creator-add-note");
  buttonCreatorNote.innerText = "Add note";
  buttonCreatorNote.type = "submit";
  buttonCreatorNote.name = "buttonAddNote";
  buttonCreatorNote.value = "AddNote";
  // Form submit post when adding a node card
  buttonCreatorNote.addEventListener("click", () => {
    document.querySelector(".form-note-add").submit();
  });

  const buttonCancel = document.createElement("button");
  buttonCancel.classList.add("btn-creator-cancel");
  buttonCancel.innerText = "Cancel";
  buttonCancel.type = "button";

  listenAddCancelButton(buttonCreatorNote, buttonCancel);

  buttons.appendChild(buttonCreatorNote);
  buttons.appendChild(buttonCancel);


  const overlayNoteCreator = document.createElement("div");
  overlayNoteCreator.classList.add("overlay-note-creator");
  form.appendChild(noteTitle);
  form.appendChild(noteContent);
  form.appendChild(buttons);
  form.appendChild(inputAddNote);
  overlayNoteCreator.appendChild(form);

  addBgBlur();

  const body = document.querySelector("body");
  body.appendChild(overlayNoteCreator);
}

function listenAddCancelButton(buttonCreatorNote, buttonCancel) {
  buttonCreatorNote.addEventListener("click", () => {
    generateNoteCard();
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

/**
 * Generate note card
 */
function generateNoteCard() {
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
  date.innerHTML = "July 26, 2019";
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

// Dynamically size textarea
function autoGrow(noteContent) {
  noteContent.style.height = "1px";
  noteContent.style.height = (25 + noteContent.scrollHeight) + "px";
}