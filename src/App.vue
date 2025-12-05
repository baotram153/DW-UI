<template>
  <div class="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-stone-50 via-slate-50 to-stone-50 p-10">
    <AppHeader />
    <main class="mx-auto max-w-dvw px-24 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>
