import { restoreLocal } from './Storage.js'
import { updateBooksGrid, setupAccountModal, setupNavbar } from './index.js'

const db = firebase.firestore()
let unsubscribe

// Auth
const auth = firebase.auth()
const logInBtn = document.getElementById('logInBtn')
const logOutBtn = document.getElementById('logOutBtn')

auth.onAuthStateChanged(async (user) => {
  if (user) {
    setupRealTimeListener()
  } else {
    if (unsubscribe) unsubscribe()
    restoreLocal()
    updateBooksGrid()
  }
  setupAccountModal(user)
  setupNavbar(user)
})

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  auth.signInWithPopup(provider)
}

const signOut = () => {
  auth.signOut()
}

logInBtn.onclick = signIn
logOutBtn.onclick = signOut

const setupRealTimeListener = () => {
  unsubscribe = db
    .collection('books')
    .where('ownerId', '==', auth.currentUser.uid)
    .orderBy('createdAt')
    .onSnapshot((snapshot) => {
      library.books = docsToBooks(snapshot.docs)
      updateBooksGrid()
    })
}

const addBookDB = (newBook) => {
  db.collection('books').add(bookToDoc(newBook))
}

const removeBookDB = async (title) => {
  db.collection('books')
    .doc(await getBookIdDB(title))
    .delete()
}

const toggleBookIsReadDB = async (book) => {
  db.collection('books')
    .doc(await getBookIdDB(book.title))
    .update({ isRead: !book.isRead })
}

const getBookIdDB = async (title) => {
  const snapshot = await db
    .collection('books')
    .where('ownerId', '==', auth.currentUser.uid)
    .where('title', '==', title)
    .get()
  const bookId = snapshot.docs.map((doc) => doc.id).join('')
  return bookId
}

export {
  setupRealTimeListener,
  addBookDB,
  removeBookDB,
  toggleBookIsReadDB,
  unsubscribe,
  auth
}
