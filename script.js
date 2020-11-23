"use strict";

// BOOKS ARRAY

class Book {
  constructor(
    title = "Unknown",
    author = "Unknown",
    pages = "0",
    isRead = "false"
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

let myLibrary = [];

function addToLibrary(newBook) {
  if (myLibrary.some((book) => book.title === newBook.title)) return false;
  myLibrary.push(newBook);
  return true;
}

function removeFromLibrary(bookTitle) {
  myLibrary = myLibrary.filter((book) => book.title !== bookTitle);
}

// POPUP

const newBookButton = document.querySelector(".js-new-book-button");
const popup = document.querySelector(".js-popup");
const overlay = document.querySelector(".js-overlay");

newBookButton.addEventListener("click", openPopup);
overlay.addEventListener("click", closePopup);

function openPopup() {
  form.reset();
  popup.classList.add("popup--active");
  overlay.classList.add("overlay--active");
}

function closePopup() {
  popup.classList.remove("popup--active");
  overlay.classList.remove("overlay--active");
}

// FORM

const form = document.querySelector(".js-popup-form");
form.addEventListener("submit", addBook);

function addBook(e) {
  e.preventDefault();
  if (addToLibrary(getBookFromInput())) {
    updateBooksGrid();
    closePopup();
  } else {
    alert("This book already exists in your library");
    return;
  }
}

function getBookFromInput() {
  const title = `"${document.querySelector("#title").value}"`;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const isRead = document.querySelector("#is-read").checked;
  return new Book(title, author, pages, isRead);
}

// BOOKS GRID

const booksGrid = document.querySelector(".js-books-grid");
booksGrid.addEventListener("click", checkBooksGridInput);

function updateBooksGrid() {
  resetGrid();
  for (let element of myLibrary) {
    createBookCard(element);
  }
}

function resetGrid() {
  booksGrid.innerHTML = "";
}

function createBookCard(book) {
  const bookCard = document.createElement("div");
  const title = document.createElement("h3");
  const author = document.createElement("h3");
  const pages = document.createElement("h3");
  const read = document.createElement("h3");
  const removeButton = document.createElement("button");

  bookCard.classList.add("books-grid__book-card");
  title.classList.add("books-grid__book-text");
  author.classList.add("books-grid__book-text");
  pages.classList.add("books-grid__book-text");
  read.classList.add("books-grid__book-text");
  removeButton.classList.add("button");
  removeButton.classList.add("button--red");
  removeButton.classList.add("js-remove-button");

  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = book.pages;
  removeButton.textContent = "Remove";
  if (book.isRead) {
    read.textContent = "Read";
  } else {
    read.textContent = "Not read";
  }

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCard.appendChild(read);
  bookCard.appendChild(removeButton);
  booksGrid.appendChild(bookCard);
}

function checkBooksGridInput(e) {
  if (e.target.classList.contains("js-remove-button")) {
    removeFromLibrary(e.target.parentNode.firstChild.innerHTML);
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
  }
}
