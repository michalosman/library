import Book from './Book.js'

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

const JSONToBook = (book) => {
  return new Book(book.title, book.author, book.pages, book.isRead)
}

const bookToDoc = (book) => {
  return {
    ownerId: auth.currentUser.uid,
    title: book.title,
    author: book.author,
    pages: book.pages,
    isRead: book.isRead,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }
}

export { docsToBooks, JSONToBook, bookToDoc }
