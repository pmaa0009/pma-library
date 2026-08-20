<template>
  <div class="container mt-5">
    <!-- User Information Form -->
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center mb-4">
          User Information Form / Credentials
        </h1>

        <form @submit.prevent="submitForm">
          <!-- Username and Password -->
          <div class="row mb-3">
            <!-- Username -->
            <div class="col-sm-6">
              <label
                for="username"
                class="form-label"
              >
                Username
              </label>

              <input
                id="username"
                v-model="formData.username"
                type="text"
                name="username"
                class="form-control"
                @blur="validateName(true)"
                @input="validateName(false)"
              />

              <div
                v-if="errors.username"
                class="text-danger"
              >
                {{ errors.username }}
              </div>
            </div>

            <!-- Password -->
            <div class="col-sm-6">
              <label
                for="password"
                class="form-label"
              >
                Password
              </label>

              <input
                id="password"
                v-model="formData.password"
                type="password"
                name="password"
                class="form-control"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
              />

              <div
                v-if="errors.password"
                class="text-danger"
              >
                {{ errors.password }}
              </div>
            </div>
          </div>

          <!-- Australian Resident and Gender -->
          <div class="row mb-3">
            <!-- Australian Resident -->
            <div class="col-sm-6">
              <div class="form-check">
                <input
                  id="isAustralian"
                  v-model="formData.isAustralian"
                  type="checkbox"
                  name="isAustralian"
                  class="form-check-input"
                  @change="validateResident"
                />

                <label
                  for="isAustralian"
                  class="form-check-label"
                >
                  Australian Resident?
                </label>
              </div>

              <div
                v-if="errors.resident"
                class="text-danger"
              >
                {{ errors.resident }}
              </div>
            </div>

            <!-- Gender -->
            <div class="col-sm-6">
              <label
                for="gender"
                class="form-label"
              >
                Gender
              </label>

              <select
                id="gender"
                v-model="formData.gender"
                name="gender"
                class="form-select"
                @change="validateGender"
              >
                <option
                  value=""
                  disabled
                >
                  Please select a gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>

              <div
                v-if="errors.gender"
                class="text-danger"
              >
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <!-- Reason for joining -->
          <div class="mb-3">
            <label
              for="reason"
              class="form-label"
            >
              Reason for joining
            </label>

            <textarea
              id="reason"
              v-model="formData.reason"
              name="reason"
              class="form-control"
              rows="3"
              @blur="validateReason(true)"
              @input="validateReason(false)"
            ></textarea>

            <div
              v-if="errors.reason"
              class="text-danger"
            >
              {{ errors.reason }}
            </div>
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button
              type="submit"
              class="btn btn-primary me-2"
            >
              Submit
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- PrimeVue DataTable -->
    <div
      v-if="submittedCards.length"
      class="row mt-5"
    >
      <div class="col-12">
        <h2 class="text-center mb-3">
          Submitted User Information
        </h2>

        <div class="datatable-wrapper">
          <DataTable
            :value="submittedCards"
            stripedRows
            showGridlines
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20]"
            tableStyle="min-width: 50rem"
          >
            <Column
              field="username"
              header="Username"
              sortable
            />

            <Column
              field="password"
              header="Password"
            />

            <Column header="Australian Resident">
              <template #body="{ data }">
                {{ data.isAustralian ? 'Yes' : 'No' }}
              </template>
            </Column>

            <Column
              field="gender"
              header="Gender"
              sortable
            />

            <Column
              field="reason"
              header="Reason"
            />
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Store the current form data
const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  gender: '',
  reason: ''
})

// Store all successfully submitted users
const submittedCards = ref([])

// Store validation error messages
const errors = ref({
  username: null,
  password: null,
  resident: null,
  gender: null,
  reason: null
})

// Validate Username
const validateName = (blur) => {
  if (formData.value.username.trim().length < 3) {
    if (blur) {
      errors.value.username =
        'Name must be at least 3 characters.'
    }
  } else {
    errors.value.username = null
  }
}

// Validate Password
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar =
    /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password =
        `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one special character.'
    }
  } else {
    errors.value.password = null
  }
}

// Validate Australian Resident
const validateResident = () => {
  if (!formData.value.isAustralian) {
    errors.value.resident =
      'Please confirm that you are an Australian resident.'
  } else {
    errors.value.resident = null
  }
}

// Validate Gender
const validateGender = () => {
  if (formData.value.gender === '') {
    errors.value.gender =
      'Please select a gender.'
  } else {
    errors.value.gender = null
  }
}

// Validate Reason for joining
const validateReason = (blur) => {
  if (formData.value.reason.trim().length < 10) {
    if (blur) {
      errors.value.reason =
        'Reason must be at least 10 characters.'
    }
  } else {
    errors.value.reason = null
  }
}

// Clear form fields and validation errors
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    gender: '',
    reason: ''
  }

  errors.value = {
    username: null,
    password: null,
    resident: null,
    gender: null,
    reason: null
  }
}

// Submit only when all fields are valid
const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateResident()
  validateGender()
  validateReason(true)

  const formIsValid =
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason

  if (formIsValid) {
    submittedCards.value.push({
      ...formData.value
    })

    clearForm()
  }
}
</script>

<style scoped>
.text-danger {
  margin-top: 4px;
  font-size: 14px;
}

.datatable-wrapper {
  width: 100%;
  overflow-x: auto;
}
</style>