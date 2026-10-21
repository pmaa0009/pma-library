<template>
  <main class="book-counter-page">
    <section class="book-counter-card">
      <h1>Book Counter</h1>
      <p class="intro">
        Click the button to get the number of books in Firestore.
      </p>

      <button
        type="button"
        class="count-button"
        :disabled="loading"
        @click="getBookCount"
      >
        {{ loading ? 'Loading...' : 'Get Book Count' }}
      </button>

      <p
        v-if="count !== null"
        class="count-result"
      >
        Total number of books: {{ count }}
      </p>

      <p
        v-if="error"
        class="error"
        role="alert"
      >
        {{ error }}
      </p>
    </section>
  </main>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const count = ref(null)
const error = ref('')
const loading = ref(false)

const getBookCount = async () => {
  count.value = null
  error.value = ''

  const functionUrl = import.meta.env.VITE_BOOK_COUNT_FUNCTION_URL?.trim()

  if (!functionUrl) {
    error.value =
      'The Cloud Function URL has not been configured yet.'
    return
  }

  try {
    loading.value = true

    const response = await axios.get(functionUrl)
    count.value = response.data.count
  } catch (requestError) {
    console.error(
      'Error fetching book count:',
      requestError
    )

    error.value = 'Error fetching book count.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.book-counter-page {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

.book-counter-card {
  width: min(100%, 620px);
  padding: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background: #fff;
  text-align: center;
  box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
}

.intro {
  color: #6c757d;
}

.count-button {
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 6px;
  background: #0d6efd;
  color: #fff;
}

.count-button:disabled {
  opacity: 0.65;
}

.count-result,
.error {
  margin: 1.5rem 0 0;
  padding: 0.9rem;
  border-radius: 6px;
}

.count-result {
  background: #d1e7dd;
  color: #0f5132;
  font-weight: 600;
}

.error {
  background: #f8d7da;
  color: #842029;
}
</style>
