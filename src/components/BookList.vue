<template>
  <div class="row mt-5">
    <div class="col-12">
      <div
        class="d-flex justify-content-between align-items-center mb-3"
      >
        <h2 class="mb-0">
          Manage Books
        </h2>

        <button
          type="button"
          class="btn btn-outline-primary"
          :disabled="loading"
          @click="loadBooks"
        >
          {{ loading ? 'Loading...' : 'Refresh Books' }}
        </button>
      </div>

      <div class="alert alert-info">
        Showing a maximum of 5 books where ISBN is greater
        than 1000, ordered by ISBN from smallest to largest.
      </div>

      <div
        v-if="successMessage"
        class="alert alert-success"
      >
        {{ successMessage }}
      </div>

      <div
        v-if="errorMessage"
        class="alert alert-danger"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="loading"
        class="text-center py-4"
      >
        Loading books...
      </div>

      <div
        v-else-if="books.length"
        class="table-responsive"
      >
        <table
          class="table table-bordered table-striped align-middle"
        >
          <thead class="table-dark">
            <tr>
              <th>ISBN</th>
              <th>Book Name</th>
              <th>Document ID</th>
              <th class="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="book in books"
              :key="book.id"
            >
              <td>
                <input
                  v-if="editingId === book.id"
                  v-model.number="editIsbn"
                  type="number"
                  class="form-control"
                  min="1001"
                />

                <span v-else>
                  {{ book.isbn }}
                </span>
              </td>

              <td>
                <input
                  v-if="editingId === book.id"
                  v-model="editName"
                  type="text"
                  class="form-control"
                />

                <span v-else>
                  {{ book.name }}
                </span>
              </td>

              <td class="document-id">
                {{ book.id }}
              </td>

              <td class="text-center action-column">
                <template v-if="editingId === book.id">
                  <button
                    type="button"
                    class="btn btn-success btn-sm me-2"
                    :disabled="isSaving"
                    @click="saveBook(book.id)"
                  >
                    {{ isSaving ? 'Saving...' : 'Save' }}
                  </button>

                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    :disabled="isSaving"
                    @click="cancelEdit"
                  >
                    Cancel
                  </button>
                </template>

                <template v-else>
                  <button
                    type="button"
                    class="btn btn-warning btn-sm me-2"
                    @click="startEdit(book)"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    :disabled="deletingId === book.id"
                    @click="removeBook(book)"
                  >
                    {{
                      deletingId === book.id
                        ? 'Deleting...'
                        : 'Delete'
                    }}
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="alert alert-secondary"
      >
        No books matched the query.
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref
} from 'vue'

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'

import { db } from '../firebase.js'

const books = ref([])

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const editingId = ref(null)
const editIsbn = ref('')
const editName = ref('')
const isSaving = ref(false)
const deletingId = ref(null)

const loadBooks = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!db) {
    errorMessage.value =
      'Firebase has not been configured.'
    return
  }

  try {
    loading.value = true

    
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(5)
    )

    const querySnapshot =
      await getDocs(booksQuery)

    books.value = querySnapshot.docs.map(
      (bookDocument) => ({
        id: bookDocument.id,
        ...bookDocument.data()
      })
    )
  } catch (error) {
    console.error(
      'Error retrieving books:',
      error
    )

    errorMessage.value =
      'Books could not be retrieved. Make sure you are signed in.'
  } finally {
    loading.value = false
  }
}

const startEdit = (book) => {
  successMessage.value = ''
  errorMessage.value = ''

  editingId.value = book.id
  editIsbn.value = book.isbn
  editName.value = book.name
}

const cancelEdit = () => {
  editingId.value = null
  editIsbn.value = ''
  editName.value = ''
}

const saveBook = async (bookId) => {
  successMessage.value = ''
  errorMessage.value = ''

  const numericIsbn = Number(editIsbn.value)
  const bookName = editName.value.trim()

  if (
    !Number.isFinite(numericIsbn) ||
    numericIsbn <= 1000
  ) {
    errorMessage.value =
      'For this query, ISBN must be greater than 1000.'
    return
  }

  if (!bookName) {
    errorMessage.value =
      'Please enter a book name.'
    return
  }

  if (!db) {
    errorMessage.value =
      'Firebase has not been configured.'
    return
  }

  try {
    isSaving.value = true

    const bookReference = doc(
      db,
      'books',
      bookId
    )

    await updateDoc(bookReference, {
      isbn: numericIsbn,
      name: bookName
    })

    cancelEdit()
    await loadBooks()

    successMessage.value =
      'Book updated successfully.'
  } catch (error) {
    console.error(
      'Error updating book:',
      error
    )

    errorMessage.value =
      'The book could not be updated.'
  } finally {
    isSaving.value = false
  }
}

const removeBook = async (book) => {
  successMessage.value = ''
  errorMessage.value = ''

  const confirmed = window.confirm(
    `Are you sure you want to delete "${book.name}"?`
  )

  if (!confirmed) {
    return
  }

  if (!db) {
    errorMessage.value =
      'Firebase has not been configured.'
    return
  }

  try {
    deletingId.value = book.id

    await deleteDoc(
      doc(db, 'books', book.id)
    )

    await loadBooks()

    successMessage.value =
      'Book deleted successfully.'
  } catch (error) {
    console.error(
      'Error deleting book:',
      error
    )

    errorMessage.value =
      'The book could not be deleted.'
  } finally {
    deletingId.value = null
  }
}

// Load the books when the component opens
onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.document-id {
  max-width: 230px;
  overflow-wrap: anywhere;
}

.action-column {
  min-width: 180px;
}
</style>