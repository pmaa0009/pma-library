<template>
  <main class="weather-page">
    <section class="weather-card">
      <h1>Get Weather</h1>
      <p class="intro">Enter a city to view its current weather.</p>

      <form class="search-form" @submit.prevent="searchByCity">
        <label for="city">City</label>
        <div class="search-row">
          <input
            id="city"
            v-model.trim="city"
            type="text"
            placeholder="For example, Melbourne"
            autocomplete="off"
          />
          <button type="submit" :disabled="loading">
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="error" role="alert">
        {{ errorMessage }}
      </p>

      <section v-if="weatherData" class="weather-result">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <img :src="iconUrl" :alt="weatherDescription" />
        <p class="temperature">{{ temperature }} °C</p>
        <p class="description">{{ weatherDescription }}</p>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
const city = ref('')
const weatherData = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const temperature = computed(() => {
  return weatherData.value
    ? Math.round(weatherData.value.main.temp)
    : null
})

const weatherDescription = computed(() => {
  const description = weatherData.value?.weather?.[0]?.description ?? ''
  return description
    ? description.charAt(0).toUpperCase() + description.slice(1)
    : ''
})

const iconUrl = computed(() => {
  const icon = weatherData.value?.weather?.[0]?.icon
  return icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : ''
})

const fetchWeatherData = async (params) => {
  if (!apiKey) {
    errorMessage.value = 'OpenWeather API key is not configured.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          ...params,
          appid: apiKey,
          units: 'metric'
        }
      }
    )
    weatherData.value = response.data
  } catch (error) {
    weatherData.value = null

    if (error.response?.status === 404) {
      errorMessage.value = 'City not found. Please check the city name.'
    } else if (error.response?.status === 401) {
      errorMessage.value = 'The OpenWeather API key is invalid or not active yet.'
    } else {
      errorMessage.value = 'Unable to load the weather. Please try again.'
    }

    console.error('Error fetching weather data:', error)
  } finally {
    loading.value = false
  }
}

const searchByCity = async () => {
  if (!city.value) {
    errorMessage.value = 'Please enter a city.'
    weatherData.value = null
    return
  }

  await fetchWeatherData({ q: city.value })
}

const fetchCurrentLocationWeather = () => {
  if (!navigator.geolocation || !apiKey) {
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      fetchWeatherData({
        lat: coords.latitude,
        lon: coords.longitude
      })
    },
    () => {
      // City search remains available when location permission is denied.
    }
  )
}

onMounted(fetchCurrentLocationWeather)
</script>

<style scoped>
.weather-page {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

.weather-card {
  width: min(100%, 680px);
  padding: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
}

h1,
h2,
.intro,
.weather-result {
  text-align: center;
}

.intro {
  color: #6c757d;
}

.search-form {
  margin-top: 1.5rem;
}

.search-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.search-row {
  display: flex;
  gap: 0.75rem;
}

.search-row input {
  flex: 1;
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
}

.search-row button {
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 6px;
  background: #0d6efd;
  color: #fff;
}

.search-row button:disabled {
  opacity: 0.65;
}

.error {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: #f8d7da;
  color: #842029;
}

.weather-result {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.weather-result img {
  width: 100px;
  height: 100px;
}

.temperature {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.description {
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

@media (max-width: 540px) {
  .search-row {
    flex-direction: column;
  }
}
</style>
