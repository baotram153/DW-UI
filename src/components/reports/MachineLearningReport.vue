<template>
  <!-- <section class="space-y-6 animate-fadeIn">
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <h3 class="mb-4 text-sm font-medium text-stone-600">Trending Keywords</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(keyword, i) in data.keywords"
            :key="i"
            :style="{ animationDelay: i * 50 + 'ms' }"
            class="rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 hover:scale-105"
            :class="`${keyword.bgColor} ${keyword.textColor}`"
          >
            {{ keyword.text }}
            <span class="ml-2 opacity-75">{{ keyword.count }}</span>
          </div>
        </div>
      </div>

      <div class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <h3 class="mb-4 text-sm font-medium text-stone-600">Next Month Prediction</h3>
        <div class="space-y-4">
          <div v-for="(trend, i) in data.predictions" :key="i" class="group/trend">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium text-stone-900">{{ trend.keyword }}</span>
              <span class="text-xs text-teal-600 font-semibold">↑ {{ trend.confidence }}%</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                :style="{ width: trend.confidence + '%' }"
                class="h-full rounded-full bg-gradient-to-r from-teal-200 to-teal-300 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h3 class="mb-4 text-sm font-medium text-stone-600">Similar Papers (Vector Embedding)</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(paper, i) in data.similarPapers"
          :key="i"
          class="group/paper relative overflow-hidden rounded-xl bg-gradient-to-br p-4 transition-all hover:shadow-md"
          :class="paper.bgGradient"
        >
          <div class="mb-3 flex items-start justify-between">
            <h4 class="flex-1 pr-2 text-sm font-medium text-stone-900 line-clamp-2">{{ paper.title }}</h4>
            <div class="flex-shrink-0 rounded-full px-2 py-1 text-xs font-semibold" :class="paper.badgeClass">
              {{ paper.similarity }}%
            </div>
          </div>
          <p class="text-xs text-stone-600">{{ paper.authors }}</p>
          <div class="mt-3 border-t border-stone-200/50 pt-3">
            <p class="text-xs text-stone-500">Relevance Score</p>
            <div class="mt-2 h-1 overflow-hidden rounded-full bg-stone-100">
              <div :style="{ width: paper.similarity + '%' }" class="h-full rounded-full bg-stone-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section> -->
  <div class="p-4 text-center text-stone-600">
      Under-developed feature - Machine Learning Report coming soon!
  </div>
</template>

<script setup lang="ts">
type Keyword = {
  text: string
  count: number
  bgColor: string
  textColor: string
}

type Prediction = {
  keyword: string
  confidence: number
  trend: 'up' | 'down'
}

type SimilarPaper = {
  title: string
  authors: string
  similarity: number
  bgGradient: string
  badgeClass: string
}

defineProps<{
  data: {
    keywords: Keyword[]
    predictions: Prediction[]
    similarPapers: SimilarPaper[]
  }
}>()
</script>
