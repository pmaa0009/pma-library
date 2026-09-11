<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'
import { getOrCreateUserProfile } from '../services/userProfile'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const firebaseErrorMessages = {
  'auth/email-already-in-use': 'This email address is already registered.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must contain at least 6 characters.',
  'auth/network-request-failed': 'Network error. Please try again.'
}

const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (!auth) {
    errorMessage.value = 'Firebase has not been configured yet.'
    return
  }

  isSubmitting.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    console.log('Registered user:', userCredential.user)

    try {
      const profile = await getOrCreateUserProfile(userCredential.user)
      console.log('Assigned role:', profile.role)
    } catch (profileError) {
      console.error('Profile creation error:', profileError.code ?? profileError.message)
      errorMessage.value =
        'Your account was created, but the Member role could not be saved.'
      return
    }

    successMessage.value = `Account created successfully for ${userCredential.user.email}.`
    password.value = ''
    confirmPassword.value = ''
  } catch (error) {
    console.error('Registration error:', error.code)
    errorMessage.value =
      firebaseErrorMessages[error.code] ?? 'Unable to create the account.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">
            <p class="text-primary fw-semibold mb-2">PMA Library</p>
            <h1 class="h2 mb-2">Create an account</h1>
            <p class="text-secondary mb-4">
              Register with Firebase Authentication to access the library.
            </p>

            <div
              v-if="!isFirebaseConfigured"
              class="alert alert-warning"
              role="alert"
            >
              Firebase configuration is required before registration can be tested.
            </div>

            <div
              v-if="successMessage"
              class="alert alert-success"
              role="status"
            >
              {{ successMessage }}
            </div>

            <div
              v-if="errorMessage"
              class="alert alert-danger"
              role="alert"
            >
              {{ errorMessage }}
            </div>

            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="register-email" class="form-label">Email address</label>
                <input
                  id="register-email"
                  v-model.trim="email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="register-password" class="form-label">Password</label>
                <input
                  id="register-password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  autocomplete="new-password"
                  minlength="6"
                  required
                />
                <div class="form-text">Use at least 6 characters.</div>
              </div>

              <div class="mb-4">
                <label for="confirm-password" class="form-label">Confirm password</label>
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  type="password"
                  class="form-control"
                  autocomplete="new-password"
                  minlength="6"
                  required
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="isSubmitting || !isFirebaseConfigured"
              >
                {{ isSubmitting ? 'Creating account…' : 'Register' }}
              </button>
            </form>

            <p class="text-center text-secondary mt-4 mb-0">
              Already registered?
              <RouterLink to="/firebase-signin">Sign in</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
