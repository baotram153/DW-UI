<template>
  <div class="mb-8 flex gap-1 border-b border-stone-200">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="$emit('update:activeTab', tab)"
      :class="[
        'px-4 py-3 text-sm font-medium transition-all duration-300',
        activeTab === tab
          ? 'border-b-2 border-rose-300 text-stone-900'
          : 'text-stone-500 hover:text-stone-700'
      ]"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: string[]
  activeTab: string
}>()

defineEmits<{
  'update:activeTab': [tab: string]
}>()
</script>
