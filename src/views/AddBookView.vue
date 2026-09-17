<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">
          Add Book
        </h1>

        <form
          class="card p-4 shadow-sm"
          @submit.prevent="addBook"
        >
          <div class="mb-3">
            <label
              for="isbn"
              class="form-label"
            >
              ISBN
            </label>

            <input
              id="isbn"
              v-model.number="isbn"
              type="number"
              class="form-control"
              placeholder="Enter ISBN"
              min="1"
              required
            />
          </div>

          <div class="mb-3">
            <label
              for="name"
              class="form-label"
            >
              Book Name
            </label>

            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Enter book name"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Adding...' : 'Add Book' }}
          </button>

          <div
            v-if="successMessage"
            class="alert alert-success mt-3 mb-0"
          >
            {{ successMessage }}
          </div>

          <div
            v-if="errorMessage"
            class="alert alert-danger mt-3 mb-0"
          >
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
    <BookList />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  addDoc,
  collection
} from 'firebase/firestore'
import { db } from '../firebase.js'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')

// Page messages
const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const addBook = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!db) {
    errorMessage.value =
      'Firebase is not configured. Please check your environment variables.'
    return
  }

  const bookName = name.value.trim()
  const numericIsbn = Number(isbn.value)

  if (!bookName) {
    errorMessage.value =
      'Please enter a book name.'
    return
  }

  if (
    !Number.isFinite(numericIsbn) ||
    numericIsbn <= 0
  ) {
    errorMessage.value =
      'Please enter a valid ISBN.'
    return
  }

  try {
    isSubmitting.value = true

    const documentReference = await addDoc(
      collection(db, 'books'),
      {
        isbn: numericIsbn,
        name: bookName
      }
    )

    successMessage.value =
      `Book added successfully. Document ID: ${documentReference.id}`

    isbn.value = ''
    name.value = ''
  } catch (error) {
    console.error(
      'Error adding book:',
      error
    )

    errorMessage.value =
      'The book could not be added. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>