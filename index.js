const buttonTab = document.querySelector(".btn-tab-add");
buttonTab.addEventListener("click", () => {
  createTab();
});


const buttonNote = document.querySelector(".btn-note-add");
buttonNote.addEventListener("click", () => {
  createNoteCard();
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

function createNoteCard() {
  const card = document.createElement("div");
  card.classList.add("card");
  const date = document.createElement("div");
  date.classList.add("card-date");
  date.innerText = "July 26, 2019";
  const title = document.createElement("div");
  title.classList.add("card-title");
  title.innerText = "Untitled";
  const content = document.createElement("div");
  content.classList.add("card-content");
  content.innerText = "...";
  card.appendChild(date);
  card.appendChild(title);
  card.appendChild(content);
  const main = document.querySelector("main");
  main.appendChild(card);
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