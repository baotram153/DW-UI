<template>
  <section class="animate-fadeIn flex flex-col gap-6 sm:grid sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8">
    <div class="flex flex-col flex-1 lg:pr-4 gap-6">
      <div class="flex flex-col px-4 py-2 w-full">
        <h1 class="text-2xl font-black p-2">Author Report</h1>
        <h3 class="p-2 text-stone-600">Top authors by citations, papers, and category</h3>
      </div>

      <div id="authors-citations" class="rounded-2xl bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
          <div>
            <h4 class="text-xl font-semibold text-stone-800">Top authors by citations</h4>
            <p class="text-sm text-stone-500">Based on published papers in the selected year</p>
          </div>
          <div class="flex items-center gap-3">
            <Dropdown
              v-model="citationsYear"
              :options="yearOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Year"
              class="w-32"
            />
            <span v-if="citationsError" class="text-xs font-semibold text-rose-600">{{ citationsError }}</span>
          </div>
        </div>
        <div class="p-2">
          <DataTable
            :value="authorsByCitations"
            paginator
            :rows="rows"
            :rowsPerPageOptions="[5, 10]"
            :loading="citationsLoading"
            responsiveLayout="scroll"
            scrollable
            scrollHeight="500px"
            dataKey="author"
            class="row-fixed-height"
          >
            <Column field="rank_in_year" header="Rank" style="width: 80px;" />
            <Column field="author" header="Author" />
            <Column field="total_citations" header="Total citations" style="width: 140px;" />
            <Column field="year" header="Year" style="width: 90px;" />
          </DataTable>
        </div>
      </div>

      <div id="authors-papers" class="rounded-2xl bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
          <div>
            <h4 class="text-xl font-semibold text-stone-800">Top authors by number of papers</h4>
            <p class="text-sm text-stone-500">Total papers published in the selected year</p>
          </div>
          <div class="flex items-center gap-3">
            <Dropdown
              v-model="papersYear"
              :options="yearOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Year"
              class="w-32"
            />
            <span v-if="papersError" class="text-xs font-semibold text-rose-600">{{ papersError }}</span>
          </div>
        </div>
        <div class="p-2">
          <DataTable
            :value="authorsByPapers"
            paginator
            :rows="rows"
            :rowsPerPageOptions="[5, 10]"
            :loading="papersLoading"
            responsiveLayout="scroll"
            scrollable
            scrollHeight="500px"
            dataKey="author"
            class="row-fixed-height"
          >
            <Column field="rank_in_year" header="Rank" style="width: 80px;" />
            <Column field="author" header="Author" />
            <Column field="paper_count" header="Paper count" style="width: 120px;" />
            <Column field="year" header="Year" style="width: 90px;" />
          </DataTable>
        </div>
      </div>

      <div id="authors-category" class="rounded-2xl bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
          <div>
            <h4 class="text-xl font-semibold text-stone-800">Top authors by category</h4>
            <p class="text-sm text-stone-500">Select a category to see its leading authors</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <Dropdown
              v-model="categoryYear"
              :options="yearOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Year"
              class="w-28"
            />
            <Dropdown
              v-model="selectedCategory"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Category"
              class="w-52"
            />
            <span v-if="categoryError" class="text-xs font-semibold text-rose-600">{{ categoryError }}</span>
          </div>
        </div>
        <div class="p-2">
          <DataTable
            :value="filteredAuthorsByCategory"
            paginator
            :rows="rows"
            :rowsPerPageOptions="[5, 10]"
            :loading="categoryLoading"
            responsiveLayout="scroll"
            scrollable
            scrollHeight="500px"
            dataKey="author"
            class="row-fixed-height"
          >
            <Column field="rank_in_category_year" header="Rank" style="width: 80px;" />
            <Column field="author" header="Author" />
            <Column field="category" header="Category" />
            <Column field="paper_count" header="Papers" style="width: 120px;" />
            <Column field="year" header="Year" style="width: 90px;" />
          </DataTable>
        </div>
      </div>
    </div>

    <aside class="sticky top-6 self-start w-full lg:w-64 p-4 lg:h-max">
      <div class="rounded-lg border border-stone-200 bg-white/80 p-4 shadow-sm">
        <h4 class="text-sm font-semibold text-stone-700">Table of contents</h4>
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-600">
          <li><a href="#authors-citations" class="text-blue-700 hover:underline">Top authors by citations</a></li>
          <li><a href="#authors-papers" class="text-blue-700 hover:underline">Top authors by papers</a></li>
          <li><a href="#authors-category" class="text-blue-700 hover:underline">Top authors by category</a></li>
        </ol>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { api } from '@/lib/api'
import type { AuthorCitationsData, AuthorPapersData, AuthorCategoryData } from '@/types/author-data.types'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 10 }, (_, i) => {
  const year = currentYear - i
  return { label: String(year), value: year }
})

const citationsYear = ref<number>(currentYear)
const papersYear = ref<number>(currentYear)
const categoryYear = ref<number>(currentYear)
const categoryOptions = ref<{ label: string; value: string }[]>([])
const selectedCategory = ref<string | null>(null)

const authorsByCitations = ref<AuthorCitationsData[]>([])
const authorsByPapers = ref<AuthorPapersData[]>([])
const authorsByCategory = ref<AuthorCategoryData[]>([])

const citationsLoading = ref(false)
const papersLoading = ref(false)
const categoryLoading = ref(false)
const citationsError = ref<string | null>(null)
const papersError = ref<string | null>(null)
const categoryError = ref<string | null>(null)

const rows = 10

async function loadAuthorsByCitations() {
  citationsLoading.value = true
  citationsError.value = null
  try {
    authorsByCitations.value = await api.topAuthorsCitations(citationsYear.value, 20)
  } catch (err) {
    citationsError.value = err instanceof Error ? err.message : 'Failed to load top authors by citations'
    authorsByCitations.value = []
  } finally {
    citationsLoading.value = false
  }
}

async function loadAuthorsByPapers() {
  papersLoading.value = true
  papersError.value = null
  try {
    authorsByPapers.value = await api.topAuthorsNumPapers(papersYear.value, 20)
  } catch (err) {
    papersError.value = err instanceof Error ? err.message : 'Failed to load top authors by papers'
    authorsByPapers.value = []
  } finally {
    papersLoading.value = false
  }
}

async function loadAuthorsByCategory() {
  categoryLoading.value = true
  categoryError.value = null
  try {
    authorsByCategory.value = await api.topAuthorsCategories(categoryYear.value)
    const categories = Array.from(new Set(authorsByCategory.value.map((c) => c.category)))
    categoryOptions.value = categories.map((c) => ({ label: c, value: c }))
    if (!selectedCategory.value && categoryOptions.value.length) {
      selectedCategory.value = categoryOptions.value[0]!.value
    } else if (selectedCategory.value && !categories.includes(selectedCategory.value)) {
      selectedCategory.value = categoryOptions.value[0]?.value ?? null
    }
  } catch (err) {
    categoryError.value = err instanceof Error ? err.message : 'Failed to load authors by category'
    authorsByCategory.value = []
  } finally {
    categoryLoading.value = false
  }
}

const filteredAuthorsByCategory = computed(() =>
  authorsByCategory.value.filter((row) => !selectedCategory.value || row.category === selectedCategory.value)
)

watch(citationsYear, loadAuthorsByCitations)
watch(papersYear, loadAuthorsByPapers)
watch(categoryYear, loadAuthorsByCategory)

onMounted(() => {
  loadAuthorsByCitations()
  loadAuthorsByPapers()
  loadAuthorsByCategory()
})
</script>

<style scoped>
.row-fixed-height .p-datatable-tbody > tr {
  height: 56px;
}

.row-fixed-height .p-datatable-tbody > tr > td {
  height: 56px;
  max-height: 56px;
}
</style>
