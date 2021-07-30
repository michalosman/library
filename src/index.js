import Book from './Book.js'
import Library from './Library.js'
import {
  addBookDB,
  removeBookDB,
  toggleBookIsReadDB,
  auth
} from './Firebase.js'
import { saveLocal } from './Storage.js'
import {
  accountBtn,
  accountModal,
  addBookBtn,
  addBookModal,
  errorMsg,
  overlay,
  addBookForm,
  booksGrid,
  loggedIn,
  loggedOut,
  loadingRing
} from './Elements.js'

const library = new Library()

const setupNavbar = (user) => {
  if (user) {
    loggedIn.classList.add('active')
    loggedOut.classList.remove('active')
  } else {
    loggedIn.classList.remove('active')
    loggedOut.classList.add('active')
  }
  loadingRing.classList.remove('active')
}

const setupAccountModal = (user) => {
  if (user) {
    accountModal.innerHTML = `
      <p>Logged in as</p>
      <p><strong>${user.email.split('@')[0]}</strong></p>`
  } else {
    accountModal.innerHTML = ''
  }
}

const openAddBookModal = () => {
  addBookForm.reset()
  addBookModal.classList.add('active')
  overlay.classList.add('active')
}

const closeAddBookModal = () => {
  addBookModal.classList.remove('active')
  overlay.classList.remove('active')
  errorMsg.classList.remove('active')
  errorMsg.textContent = ''
}

const openAccountModal = () => {
  accountModal.classList.add('active')
  overlay.classList.add('active')
}

const closeAccountModal = () => {
  accountModal.classList.remove('active')
  overlay.classList.remove('active')
}

const closeAllModals = () => {
  closeAddBookModal()
  closeAccountModal()
}

const handleKeyboardInput = (e) => {
  if (e.key === 'Escape') closeAllModals()
}

const updateBooksGrid = () => {
  resetBooksGrid()
  for (let book of library.books) {
    createBookCard(book)
  }
}

const resetBooksGrid = () => {
  booksGrid.innerHTML = ''
}

const createBookCard = (book) => {
  const bookCard = document.createElement('div')
  const title = document.createElement('h3')
  const author = document.createElement('h3')
  const pages = document.createElement('h3')
  const readBtn = document.createElement('button')
  const removeBtn = document.createElement('button')

  bookCard.classList.add('book-card')
  readBtn.classList.add('btn')
  removeBtn.classList.add('btn')
  removeBtn.classList.add('btn-red')
  readBtn.onclick = toggleRead
  removeBtn.onclick = removeBook

  title.textContent = `"${book.title}"`
  author.textContent = book.author
  pages.textContent = `${book.pages} pages`
  removeBtn.textContent = 'Remove'

  if (book.isRead) {
    readBtn.textContent = 'Read'
    readBtn.classList.add('btn-light-green')
  } else {
    readBtn.textContent = 'Not read'
    readBtn.classList.add('btn-light-red')
  }

  bookCard.appendChild(title)
  bookCard.appendChild(author)
  bookCard.appendChild(pages)
  bookCard.appendChild(readBtn)
  bookCard.appendChild(removeBtn)
  booksGrid.appendChild(bookCard)
}

const getBookFromInput = () => {
  const title = document.getElementById('title').value
  const author = document.getElementById('author').value
  const pages = document.getElementById('pages').value
  const isRead = document.getElementById('isRead').checked
  return new Book(title, author, pages, isRead)
}

const addBook = (e) => {
  e.preventDefault()
  const newBook = getBookFromInput()

  if (library.isInLibrary(newBook)) {
    errorMsg.textContent = 'This book already exists in your library'
    errorMsg.classList.add('active')
  }

  if (auth.currentUser) {
    addBookDB(newBook)
  } else {
    library.addBook(newBook)
    saveLocal()
    updateBooksGrid()
  }

  closeAddBookModal()
}

const removeBook = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll('"', '')

  if (auth.currentUser) {
    removeBookDB(title)
  } else {
    library.removeBook(title)
    saveLocal()
    updateBooksGrid()
  }
}

const toggleRead = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll('"', '')
  const book = library.getBook(title)

  if (auth.currentUser) {
    toggleBookIsReadDB(book)
  } else {
    book.isRead = !book.isRead
    saveLocal()
    updateBooksGrid()
  }
}

accountBtn.onclick = openAccountModal
addBookBtn.onclick = openAddBookModal
overlay.onclick = closeAllModals
addBookForm.onsubmit = addBook
window.onkeydown = handleKeyboardInput

export { library, updateBooksGrid, setupAccountModal, setupNavbar }
