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

const newBookButton = document.querySelector(".js-new-book-button");
const popup = document.querySelector(".js-popup");
const overlay = document.querySelector(".js-overlay");
const form = document.querySelector(".js-popup-form");

window.addEventListener("keydown", checkInput);
newBookButton.addEventListener("click", openPopup);
overlay.addEventListener("click", closePopup);
form.addEventListener("submit", addBook);

function checkInput(e) {
  if (e.key === "Escape") closePopup();
}

function openPopup() {
  form.reset();
  popup.classList.add("popup--active");
  overlay.classList.add("overlay--active");
}

function closePopup() {
  popup.classList.remove("popup--active");
  overlay.classList.remove("overlay--active");
}

function addBook(e) {
  e.preventDefault();
  const title = `"${document.querySelector("#title").value}"`;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const isRead = document.querySelector("#is-read").checked;
  addBookToLibrary(new Book(title, author, pages, isRead));
  updateBooksGrid();
  closePopup();
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function updateBooksGrid() {
  for (element of myLibrary) {
    createBookCard(element);
  }
}

function createBookCard(book) {
  const booksGrid = document.querySelector(".js-books-grid");
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
  if (book.read) {
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
