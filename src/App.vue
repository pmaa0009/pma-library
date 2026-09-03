<script setup>
import BHeader from './components/BHeader.vue'
</script>

<template>
  <div class="main-container">
    <BHeader />

    <main class="main-box">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.main-container {
  min-height: 100vh;
}

.main-box {
  padding-bottom: 3rem;
}
</style>
