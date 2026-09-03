<template>
  <div class="container mt-5">
    <!-- User Information Form -->
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center mb-2">
          W5. Library Registration Form
        </h1>

        <p class="text-center mb-4">
          Let's build some more advanced features into our form.
        </p>

        <form @submit.prevent="submitForm">
          <!-- Username and Gender -->
          <div class="row mb-3">
            <!-- Username -->
            <div class="col-md-6 col-sm-6">
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

            <!-- Gender -->
            <div class="col-md-6 col-sm-6">
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

          <!-- Password and Confirm Password -->
          <div class="row mb-3">
            <!-- Password -->
            <div class="col-md-6 col-sm-6">
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

            <!-- Confirm Password -->
            <div class="col-md-6 col-sm-6">
              <label
                for="confirm-password"
                class="form-label"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                v-model="formData.confirmPassword"
                type="password"
                name="confirmPassword"
                class="form-control"
                @blur="validateConfirmPassword(true)"
              />

              <div
                v-if="errors.confirmPassword"
                class="text-danger"
              >
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <!-- Australian Resident -->
          <div class="mb-3">
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

            <!-- Red validation error -->
            <div
            v-if="errors.reason"
            class="text-danger"
            >
            {{ errors.reason }}
            </div>

            <!-- Green friend message -->
            <div
            v-if="reasonSuccessMessage"
            class="text-success"
            >
            {{ reasonSuccessMessage }}
            </div>
          </div>

          <!-- Suburb -->
          <div class="mb-3">
            <label
              for="suburb"
              class="form-label"
            >
              Suburb
            </label>

            <input
              id="suburb"
              v-model="formData.suburb"
              type="text"
              name="suburb"
              class="form-control"
            />
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
  confirmPassword: '',
  isAustralian: false,
  gender: '',
  reason: '',
  suburb: 'Clayton'
})

const submittedCards = ref([])
const reasonSuccessMessage = ref('')

// Store validation error messages
const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
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

// Validate Confirm Password
const validateConfirmPassword = (blur) => {
  if (
    formData.value.password !==
    formData.value.confirmPassword
  ) {
    if (blur) {
      errors.value.confirmPassword =
        'Passwords do not match.'
    }
  } else {
    errors.value.confirmPassword = null
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
  const reason = formData.value.reason.trim()

  if (reason.toLowerCase().includes('friend')) {
    reasonSuccessMessage.value =
      'Great to have a friend'
  } else {
    reasonSuccessMessage.value = ''
  }

  if (reason.length < 10) {
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
    confirmPassword: '',
    isAustralian: false,
    gender: '',
    reason: '',
    suburb: 'Clayton'
  }

  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    reason: null
  }
    reasonSuccessMessage.value = ''
}

// Submit only when all fields are valid
const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateResident()
  validateGender()
  validateReason(true)

  const formIsValid =
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason

  if (formIsValid) {
    // Do not store the confirm password in the DataTable
    submittedCards.value.push({
      username: formData.value.username,
      password: formData.value.password,
      isAustralian: formData.value.isAustralian,
      gender: formData.value.gender,
      reason: formData.value.reason
    })

    clearForm()

  }
}
</script>

<style scoped>
.text-danger {
  margin-top: 4px;
  color: #dc3545;
  font-size: 14px;
}

.datatable-wrapper {
  width: 100%;
  overflow-x: auto;
}
</style>
