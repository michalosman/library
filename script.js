let myLibrary = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.isRead ? "read" : "not read yet"
  }`;
};

function addBookToLibrary(book) {
  myLibrary.push(book);
}

let book = new Book("LOTR", "J. R. R. Tolkien", 500, false);
console.log(book.info());
