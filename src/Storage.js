import { JSONToBook } from './Utils.js'
import { library } from './index.js'

const saveLocal = () => {
  localStorage.setItem('library', JSON.stringify(library.books))
}

const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem('library'))
  if (books) {
    library.books = books.map((book) => JSONToBook(book))
  } else {
    library.books = []
  }
}

export { saveLocal, restoreLocal }
