// BOOK

class Book {
  constructor(
    title = 'Unknown',
    author = 'Unknown',
    pages = '0',
    isRead = 'false'
  ) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
  }
}

// LIBRARY

let library = []

function addToLibrary(newBook) {
  if (library.some((book) => book.title === newBook.title)) return false
  library.push(newBook)
  save()
  return true
}

function removeFromLibrary(bookTitle) {
  library = library.filter((book) => book.title !== bookTitle)
  save()
}

function getBook(bookTitle) {
  return library.find((book) => book.title === bookTitle)
}

// ADD BOOK POPUP

const addBookBtn = document.getElementById('addBookBtn')
const addBookPopup = document.getElementById('addBookPopup')
const overlay = document.getElementById('overlay')

addBookBtn.onclick = openAddBookPopup
overlay.onclick = closeAddBookPopup
window.onkeydown = (e) => {
  if (e.key === 'Escape') closeAddBookPopup()
}

function openAddBookPopup() {
  form.reset()
  addBookPopup.classList.add('popup--active')
  overlay.classList.add('overlay--active')
}

function closeAddBookPopup() {
  addBookPopup.classList.remove('popup--active')
  overlay.classList.remove('overlay--active')
}

// FORM

const form = document.getElementById('popupForm')
form.onsubmit = addBook

function addBook(e) {
  e.preventDefault()
  if (addToLibrary(getBookFromInput())) {
    updateBooksGrid()
    closeAddBookPopup()
  } else {
    alert('This book already exists in your library')
  }
}

function getBookFromInput() {
  const title = `"${document.getElementById('title').value}"`
  const author = document.getElementById('author').value
  const pages = document.getElementById('pages').value
  const isRead = document.getElementById('is-read').checked
  return new Book(title, author, pages, isRead)
}

// BOOKS GRID

const booksGrid = document.getElementById('booksGrid')

function removeBook(e) {
  removeFromLibrary(e.target.parentNode.firstChild.innerHTML)
  e.target.parentNode.parentNode.removeChild(e.target.parentNode)
}

function toggleRead(e) {
  if (e.target.innerHTML === 'Read') {
    getBook(e.target.parentNode.firstChild.innerHTML).isRead = false
    e.target.innerHTML = 'Not read'
    e.target.classList.remove('btn--light-green')
    e.target.classList.add('btn--light-red')
    save()
  } else {
    getBook(e.target.parentNode.firstChild.innerHTML).isRead = true
    e.target.innerHTML = 'Read'
    e.target.classList.remove('btn--light-red')
    e.target.classList.add('btn--light-green')
    save()
  }
}

function updateBooksGrid() {
  resetGrid()
  for (let element of library) {
    createBookCard(element)
  }
}

function resetGrid() {
  booksGrid.innerHTML = ''
}

function createBookCard(book) {
  const bookCard = document.createElement('div')
  const title = document.createElement('h3')
  const author = document.createElement('h3')
  const pages = document.createElement('h3')
  const readBtn = document.createElement('button')
  const removeBtn = document.createElement('button')

  bookCard.classList.add('books-grid__book-card')
  title.classList.add('book-card__text')
  author.classList.add('book-card__text')
  pages.classList.add('book-card__text')
  readBtn.classList.add('btn')
  removeBtn.classList.add('btn')
  removeBtn.classList.add('btn--red')
  readBtn.onclick = toggleRead
  removeBtn.onclick = removeBook

  title.textContent = book.title
  author.textContent = book.author
  pages.textContent = `${book.pages} pages`
  removeBtn.textContent = 'Remove'
  readBtn.style.width = '120px'
  if (book.isRead) {
    readBtn.textContent = 'Read'
    readBtn.classList.add('btn--light-green')
  } else {
    readBtn.textContent = 'Not read'
    readBtn.classList.add('btn--light-red')
  }

  bookCard.appendChild(title)
  bookCard.appendChild(author)
  bookCard.appendChild(pages)
  bookCard.appendChild(readBtn)
  bookCard.appendChild(removeBtn)
  booksGrid.appendChild(bookCard)
}

// AUTH

const auth = firebase.auth()
const whenSignedIn = document.getElementById('whenSignedIn')
const whenSignedOut = document.getElementById('whenSignedOut')
const loadingRing = document.getElementById('loadingRing')
const signInBtn = document.getElementById('signInBtn')
const signOutBtn = document.getElementById('signOutBtn')

signInBtn.onclick = signIn
signOutBtn.onclick = signOut

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider()
  auth.signInWithPopup(provider)
}

function signOut() {
  auth.signOut()
}

auth.onAuthStateChanged((user) => {
  if (user) {
    loadingRing.classList.add('disable')
    whenSignedOut.classList.remove('active')
    whenSignedIn.classList.add('active')
  } else {
    loadingRing.classList.add('disable')
    whenSignedIn.classList.remove('active')
    whenSignedOut.classList.add('active')
  }
  restore()
})

// STORAGE

function save() {
  if (auth.currentUser) {
    saveFirebase()
  } else {
    saveLocal()
  }
}

function restore() {
  if (auth.currentUser) {
    restoreFirebase()
  } else {
    restoreLocal()
  }
}

// FIRESTORE

const db = firebase.firestore()

function saveFirebase() {}

function restoreFirebase() {}

// LOCAL STORAGE

function saveLocal() {
  localStorage.setItem('myLibrary', JSON.stringify(library))
}

function restoreLocal() {
  library = JSON.parse(localStorage.getItem('myLibrary'))
  if (library === null) library = []
  updateBooksGrid()
}
