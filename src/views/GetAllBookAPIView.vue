<template>
  <main class="api-page">
    <section class="api-card">
      <h1>GetAllBookAPI</h1>

      <p>
        This page displays all books in JSON format.
      </p>

      <button
        type="button"
        :disabled="loading"
        @click="getAllBooks"
      >
        {{ loading ? 'Loading...' : 'Get All Books' }}
      </button>

      <p
        v-if="error"
        class="error"
      >
        {{ error }}
      </p>

      <pre v-if="hasLoaded">{{ formattedBooks }}</pre>
    </section>
  </main>
</template>

<script setup>
import axios from 'axios'
import {
  computed,
  onMounted,
  ref
} from 'vue'

const books = ref([])
const loading = ref(false)
const error = ref('')
const hasLoaded = ref(false)

const formattedBooks = computed(() => {
  return JSON.stringify(
    books.value,
    null,
    2
  )
})

const getAllBooks = async () => {
  const apiUrl =
    import.meta.env
      .VITE_GET_ALL_BOOKS_API_URL
      ?.trim()

  if (!apiUrl) {
    error.value =
      'The Get All Books API URL is not configured.'
    return
  }

  try {
    loading.value = true
    error.value = ''

    const response =
      await axios.get(apiUrl)

    books.value = response.data
    hasLoaded.value = true
  } catch (requestError) {
    console.error(
      'Error getting all books:',
      requestError
    )

    error.value =
      'Unable to get all books.'
  } finally {
    loading.value = false
  }
}

onMounted(getAllBooks)
</script>

<style scoped>
.api-page {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

.api-card {
  width: min(100%, 900px);
  padding: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background: white;
}

button {
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 6px;
  background: #0d6efd;
  color: white;
}

pre {
  margin-top: 1.5rem;
  padding: 1rem;
  overflow-x: auto;
  border-radius: 8px;
  background: #212529;
  color: #f8f9fa;
  text-align: left;
  white-space: pre-wrap;
}

.error {
  color: #842029;
}
</style>