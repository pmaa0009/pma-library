<script setup>
import { onUnmounted, ref } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'

const currentUser = ref(null)
const successMessage = ref('')
const errorMessage = ref('')
const isSigningOut = ref(false)

const userForConsole = (user) =>
  user ? { email: user.email, uid: user.uid } : null

const stopAuthListener = auth
  ? onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      console.log('Current user on logout page:', userForConsole(user))
    })
  : null

onUnmounted(() => stopAuthListener?.())

const logOut = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!auth) {
    errorMessage.value = 'Firebase has not been configured yet.'
    return
  }

  isSigningOut.value = true

  try {
    const signedOutEmail = currentUser.value?.email

    console.log(
      'Current user before logout:',
      userForConsole(currentUser.value)
    )

    await signOut(auth)

    console.log('Current user after logout:', auth.currentUser)
    successMessage.value = signedOutEmail
      ? `Signed out successfully: ${signedOutEmail}.`
      : 'No user was signed in.'
  } catch (error) {
    console.error('Logout error:', error.code ?? error.message)
    errorMessage.value = 'Unable to log out. Please try again.'
  } finally {
    isSigningOut.value = false
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
            <h1 class="h2 mb-2">Log out</h1>
            <p class="text-secondary mb-4">
              End the current Firebase Authentication session.
            </p>

            <div
              v-if="!isFirebaseConfigured"
              class="alert alert-warning"
              role="alert"
            >
              Firebase configuration is required before logout can be tested.
            </div>

            <div
              v-if="currentUser"
              class="alert alert-info"
              role="status"
            >
              <strong>Current user before logout:</strong><br />
              {{ currentUser.email }}
            </div>

            <div
              v-else
              class="alert alert-secondary"
              role="status"
            >
              <strong>Current Firebase user:</strong> None
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

            <button
              v-if="currentUser"
              type="button"
              class="btn btn-danger w-100"
              :disabled="isSigningOut || !isFirebaseConfigured"
              @click="logOut"
            >
              {{ isSigningOut ? 'Logging out…' : 'Log out' }}
            </button>

            <RouterLink
              v-else
              to="/firebase-signin"
              class="btn btn-primary w-100"
            >
              Return to sign in
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
