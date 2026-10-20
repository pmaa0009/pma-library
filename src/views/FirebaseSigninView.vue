<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'
import { getOrCreateUserProfile } from '../services/userProfile'

const email = ref('')
const password = ref('')
const currentUser = ref(null)
const currentRole = ref('')
const roleErrorMessage = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const firebaseErrorMessages = {
  'auth/invalid-credential': 'Incorrect email address or password.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please try again.'
}

const showCurrentUserInConsole = (user) => {
  console.log(
    'Current user:',
    user ? { email: user.email, uid: user.uid } : null
  )
}

const roleLabel = computed(() => {
  if (currentRole.value === 'librarian') return 'Librarian'
  if (currentRole.value === 'customer') return 'customer'
  return 'Loading…'
})

const loadCurrentUser = async (user) => {
  currentUser.value = user
  currentRole.value = ''
  roleErrorMessage.value = ''
  showCurrentUserInConsole(user)

  if (!user) return

  try {
    const profile = await getOrCreateUserProfile(user)
    currentRole.value = profile.role
    console.log('Current role:', profile.role)
  } catch (error) {
    console.error('Role loading error:', error.code ?? error.message)
    roleErrorMessage.value = 'Unable to load the role from Firestore.'
  }
}

const stopAuthListener = auth
  ? onAuthStateChanged(auth, (user) => {
      loadCurrentUser(user)
    })
  : null

onUnmounted(() => stopAuthListener?.())

const signIn = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!auth) {
    errorMessage.value = 'Firebase has not been configured yet.'
    return
  }

  isSubmitting.value = true

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    await loadCurrentUser(userCredential.user)
    successMessage.value = `Signed in successfully as ${userCredential.user.email}.`
    password.value = ''
  } catch (error) {
    console.error('Sign-in error:', error.code)
    errorMessage.value =
      firebaseErrorMessages[error.code] ?? 'Unable to sign in.'
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
            <h1 class="h2 mb-2">Sign in</h1>
            <p class="text-secondary mb-4">
              Sign in with your Firebase Authentication account.
            </p>

            <div
              v-if="currentUser"
              class="alert alert-info"
              role="status"
            >
              <div><strong>Current Firebase user:</strong> {{ currentUser.email }}</div>
              <span
                v-if="currentRole"
                class="badge text-bg-primary mt-2"
              >
                Role: {{ roleLabel }}
              </span>
            </div>

            <div
              v-if="currentRole === 'customer'"
              class="alert alert-secondary"
              role="status"
            >
              <strong>Member access</strong><br />
              Browse the catalogue and view borrowing history.
            </div>

            <div
              v-if="currentRole === 'librarian'"
              class="alert alert-warning"
              role="status"
            >
              <strong>Librarian access</strong><br />
              Catalogue management and member administration are available.
            </div>

            <div
              v-if="roleErrorMessage"
              class="alert alert-danger"
              role="alert"
            >
              {{ roleErrorMessage }}
            </div>

            <div
              v-if="!isFirebaseConfigured"
              class="alert alert-warning"
              role="alert"
            >
              Firebase configuration is required before sign-in can be tested.
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

            <form @submit.prevent="signIn">
              <div class="mb-3">
                <label for="signin-email" class="form-label">Please Enter your Email address</label>
                <input
                  id="signin-email"
                  v-model.trim="email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="signin-password" class="form-label">Password</label>
                <input
                  id="signin-password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  autocomplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="isSubmitting || !isFirebaseConfigured"
              >
                {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
              </button>
            </form>

            <p class="text-center text-secondary mt-4 mb-0">
              Need an account?
              <RouterLink to="/firebase-register">Register</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
