const buttonTab = document.querySelector(".btn-tab-add");
buttonTab.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("tab");
  div.innerText = "New Tab";
  const sections = document.querySelector(".sections");
  sections.appendChild(div);
});


const buttonNote = document.querySelector(".btn-note-add");
buttonNote.addEventListener("click", () => {
  console.log(buttonNote + "clicked!");
  
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

});