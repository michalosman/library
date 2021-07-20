// TODO - account modal, removing books, updating read

class Book {
  constructor(
    title = 'Unknown',
    author = 'Unknown',
    pages = '0',
    isRead = false
  ) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
  }
}

class Library {
  constructor() {
    this.books = []
  }

  addBook(newBook) {
    if (this.books.some((book) => book.title === newBook.title)) return false
    this.books.push(newBook)
    return true
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title)
  }

  getBook(title) {
    return this.books.find((book) => book.title === title)
  }
}

const library = new Library()

//* UI

const addBookBtn = document.getElementById('addBookBtn')
const addBookPopup = document.getElementById('addBookPopup')
const overlay = document.getElementById('overlay')
const addBookForm = document.getElementById('addBookForm')
const booksGrid = document.getElementById('booksGrid')

const openAddBookPopup = () => {
  addBookForm.reset()
  addBookPopup.classList.add('active')
  overlay.classList.add('active')
}

const closeAddBookPopup = () => {
  addBookPopup.classList.remove('active')
  overlay.classList.remove('active')
}

const getBookFromInput = () => {
  const title = `"${document.getElementById('title').value}"`
  const author = document.getElementById('author').value
  const pages = document.getElementById('pages').value
  const isRead = document.getElementById('isRead').checked
  return new Book(title, author, pages, isRead)
}

const addBook = (e) => {
  e.preventDefault()
  const newBook = getBookFromInput()

  if (library.addBook(newBook)) {
    if (auth.currentUser) {
      db.collection('books').add(bookToJSON(newBook))
    } else {
      saveLocal()
    }
    updateBooksGrid()
    closeAddBookPopup()
  } else {
    alert('This book already exists in your library')
  }
}

const removeBook = (e) => {
  removeFromLibrary(e.target.parentNode.firstChild.innerHTML)
  e.target.parentNode.parentNode.removeChild(e.target.parentNode)
}

const toggleRead = (e) => {
  book = library.getBook(e.target.parentNode.firstChild.innerHTML)
  if (book.isRead) {
    book.isRead = false
    e.target.innerHTML = 'Not read'
    e.target.classList.remove('btn-light-green')
    e.target.classList.add('btn-light-red')
    saveLocal()
  } else {
    book.isRead = true
    e.target.innerHTML = 'Read'
    e.target.classList.remove('btn-light-red')
    e.target.classList.add('btn-light-green')
    saveLocal()
  }
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
  title.classList.add('text')
  author.classList.add('text')
  pages.classList.add('text')
  readBtn.classList.add('btn')
  removeBtn.classList.add('btn')
  removeBtn.classList.add('btn-red')
  readBtn.onclick = toggleRead
  removeBtn.onclick = removeBook

  title.textContent = book.title
  author.textContent = book.author
  pages.textContent = `${book.pages} pages`
  removeBtn.textContent = 'Remove'
  readBtn.style.width = '120px'
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

addBookBtn.onclick = openAddBookPopup
overlay.onclick = closeAddBookPopup
addBookForm.onsubmit = addBook
window.onkeydown = (e) => {
  if (e.key === 'Escape') closeAddBookPopup()
}

//* LOCAL STORAGE

const saveLocal = () => {
  localStorage.setItem('library', JSON.stringify(library.books))
}

const restoreLocal = () => {
  library.books = JSON.parse(localStorage.getItem('library'))
  console.log()
  if (library.books === null) library.books = []
}

//* FIREBASE

const auth = firebase.auth()
const db = firebase.firestore()
const logInBtn = document.getElementById('logInBtn')
const logOutBtn = document.getElementById('logOutBtn')
const loggedIn = document.getElementById('loggedIn')
const loggedOut = document.getElementById('loggedOut')
const loadingRing = document.getElementById('loadingRing')

auth.onAuthStateChanged(async (user) => {
  if (user) {
    await db.collection('books').onSnapshot((snapshot) => {
      library.books = docsToBooks(snapshot.docs)
      updateBooksGrid()
    })
  } else {
    restoreLocal()
    updateBooksGrid()
  }
  setupNavbar(user)
})

logInBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  auth.signInWithPopup(provider)
}

logOutBtn.onclick = () => {
  auth.signOut()
}

const setupNavbar = (user) => {
  if (user) {
    loggedIn.classList.add('active')
    loggedOut.classList.remove('active')
    loadingRing.classList.remove('active')
  } else {
    loggedIn.classList.remove('active')
    loggedOut.classList.add('active')
    loadingRing.classList.remove('active')
  }
}

// * UTILS

const docsToBooks = (docs) => {
  return docs.map((doc) => {
    return new Book(
      doc.data().title,
      doc.data().author,
      doc.data().pages,
      doc.data().isRead
    )
  })
}

const JSONToBooks = (booksJSON) => {
  return booksJSON.map(
    (book) => new Book(book.title, book.author, book.pages, book.isRead)
  )
}

const booksToJSON = (books) => {
  return books.map((book) => bookToJSON(book))
}

const bookToJSON = (book) => {
  return {
    title: book.title,
    author: book.author,
    pages: book.pages,
    isRead: book.isRead,
  }
}
