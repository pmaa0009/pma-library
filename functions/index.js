const {
  onDocumentCreated
} = require('firebase-functions/v2/firestore')

const {
  onRequest
} = require('firebase-functions/v2/https')

const {
  initializeApp
} = require('firebase-admin/app')

const {
  getFirestore
} = require('firebase-admin/firestore')

initializeApp()

const db = getFirestore()

exports.countBooks = onRequest(
  {
    cors: true
  },
  async (request, response) => {
    if (request.method !== 'GET') {
      response.status(405).json({
        error: 'Method not allowed'
      })
      return
    }

    try {
      const snapshot = await db
        .collection('books')
        .get()

      response.status(200).json({
        count: snapshot.size
      })
    } catch (error) {
      console.error(
        'Error counting books:',
        error
      )

      response.status(500).json({
        error: 'Unable to count books'
      })
    }
  }
)

exports.capitaliseBookData = onDocumentCreated(
  'books/{bookId}',
  async (event) => {
    const snapshot = event.data

    if (!snapshot) {
      console.log('No book data found.')
      return
    }

    const bookData = snapshot.data()
    const capitalisedData = {}

    Object.entries(bookData).forEach(
      ([field, value]) => {
        capitalisedData[field] =
          typeof value === 'string'
            ? value.toUpperCase()
            : value
      }
    )

    await snapshot.ref.update(
      capitalisedData
    )

    console.log(
      'Book data capitalised:',
      event.params.bookId
    )
  }
)

exports.getAllBooksAPI = onRequest(
  {
    cors: true
  },
  async (request, response) => {
    if (request.method !== 'GET') {
      response.status(405).json({
        error: 'Method not allowed'
      })
      return
    }

    try {
      const snapshot = await db
        .collection('books')
        .get()

      const books = snapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data()
        })
      )

      response.status(200).json(books)
    } catch (error) {
      console.error(
        'Error getting books:',
        error
      )

      response.status(500).json({
        error: 'Unable to get books'
      })
    }
  }
)