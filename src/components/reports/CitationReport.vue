<template>
  <section class="space-y-6 animate-fadeIn flex h-full">
    <div class="flex flex-col flex-1">
    <div id="citation-histogram" class="p-2">
      <div class="flex flex-col gap-2 px-4 py-6">
        <h1 class="text-2xl font-black">Citation distribution</h1>
        <p class="text-stone-600">Histogram of papers by citation bucket.</p>
      </div>
      <div class="rounded-2xl bg-white p-4 shadow-sm">
        <div class="h-80">
          <p v-if="binsError" class="text-xs font-semibold text-rose-600">{{ binsError }}</p>
          <p v-else-if="binsLoading" class="text-sm text-stone-500">Loading citation bins…</p>
          <p v-else-if="!citationBins.length" class="text-sm text-stone-500">No citation data available.</p>
          <Chart
            v-else
            type="bar"
            :data="citationBinChartData"
            :options="citationBinChartOptions"
            class="w-full h-full"
          />
        </div>
      </div>
    </div>

    <div id="monthly-citations">
      <div class="flex flex-col px-4 py-6 w-full">
        <h1 class="text-2xl font-black p-2">Monthly Citation Report</h1>
        <h3 class="p-2">Top cited papers of each month</h3>
      </div>
      <div class="flex flex-col gap-6 p-2 lg:flex-row">
        <div class="flex flex-wrap gap-4">
          <Dropdown
            v-model="selectedMonth"
            :options="monthOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select month"
            class="w-48"
          />
          <Dropdown
            v-model="selectedYear"
            :options="yearOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select year (monthly)"
            class="w-40"
          />
        </div>
      </div>

      <div class="w-full">
        <DataTable
          :value="citations"
          paginator
          :rows="rows"
          :rowsPerPageOptions="[5, 10]"
          :loading="loading"
          responsiveLayout="scroll"
          scrollable
          scrollHeight="600px"
          dataKey="id"
          class="row-fixed-height p-2"
        >
          <Column field="rank_in_month" header="Rank" style="width: 60px;" />
          <Column field="title" header="Title">
            <template #body="{ data }">
              <div class="font-semibold h-40 overflow-y-auto">{{ data.title }}</div>
            </template>
          </Column>
          <Column field="authors" header="Authors">
            <template #body="{ data }">
              <div class="h-40 overflow-y-auto">{{ data.authors }}</div>
            </template>
          </Column>
          <Column field="citation_count" header="Citations" style="width: 120px; height: 44px"/>
          <Column field="month" header="Month" style="width: 90px; height: 44px" />
          <Column field="year" header="Year" style="width: 90px; height: 44px" />
        </DataTable>
      </div>
    </div>

    <div class="p-2" id="yearly-citations">
      <div class="mb-2 flex flex-col">
        <h1 class="text-2xl font-bold p-2">Yearly Citation Report</h1>
        <h4 class="p-2">Top citations of the year</h4>
        <Dropdown
          v-model="selectedYearYearly"
          :options="yearOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Year"
          class="w-32"
        />
      </div>

      <DataTable
        :value="yearlyCitations"
        paginator
        :rows="rows"
        :rowsPerPageOptions="[5, 10]"
        :loading="yearlyLoading"
        responsiveLayout="scroll"
        scrollable
        scrollHeight="600px"
        dataKey="id"
        class="p-datatable-sm row-fixed-height h-40 p-2"
      >
        <Column field="rank_in_year" header="Rank" style="width: 60px;" />
        <Column field="title" header="Title">
          <template #body="{ data }">
            <div class="font-semibold h-40 overflow-y-auto">{{ data.title }}</div>
          </template>
        </Column>
        <Column field="authors" header="Authors">
          <template #body="{ data }">
            <div class="h-40 overflow-y-auto">{{ data.authors }}</div>
          </template>
        </Column>
        <Column field="citation_count" header="Citations" style="width: 120px; height: 44px"/>
        <Column field="year" header="Year" style="width: 90px; height: 44px" />
      </DataTable>
    </div>
  </div>
  <aside class="sticky top-6 self-start w-full lg:w-64 p-4">
    <div class="rounded-lg border border-stone-200 bg-white/80 p-4 shadow-sm">
      <h4 class="text-sm font-semibold text-stone-700">Table of contents</h4>
      <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-600">
        <li><a href="#citation-histogram" class="text-blue-700 hover:underline">Citation histogram</a></li>
        <li><a href="#monthly-citations" class="text-blue-700 hover:underline">Top citations by month</a></li>
        <li><a href="#yearly-citations" class="text-blue-700 hover:underline">Top citations of the year</a></li>
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
import Chart from 'primevue/chart'

import { api } from '@/lib/api'
import type { CitationBinData, MonthlyCitationData, YearlyCitationData } from '@/types/citation-data.types'

const monthOptions = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 10 }, (_, i) => {
  const year = currentYear - i
  return { label: String(year), value: year }
})

const selectedMonth = ref<number>(monthOptions[new Date().getMonth()].value)
const selectedYear = ref<number>(currentYear)
const selectedYearYearly = ref<number>(currentYear)
const citations = ref<MonthlyCitationData[]>([])
const yearlyCitations = ref<YearlyCitationData[]>([])
const citationBins = ref<CitationBinData[]>([])
const citationBinChartData = computed<Record<string, unknown> | null>(() => {
  if (!citationBins.value.length) return null
  return {
    labels: citationBins.value.map((bin) => `${bin.bin_start}-${bin.bin_end}`),
    datasets: [
      {
        label: 'Papers',
        data: citationBins.value.map((bin) => bin.paper_count),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    ],
  }
})
const loading = ref(false)
const yearlyLoading = ref(false)
const binsLoading = ref(false)
const error = ref<string | null>(null)
const yearlyError = ref<string | null>(null)
const binsError = ref<string | null>(null)
const rows = 10

const monthLabel = computed(
  () => monthOptions.find((m) => m.value === selectedMonth.value)?.label ?? 'Month'
)

async function loadCitations() {
  console.log('Loading citations for', selectedMonth.value, selectedYear.value)
  loading.value = true
  error.value = null
  try {
    citations.value = await api.monthlyCitations(selectedYear.value, selectedMonth.value, 20)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load citations'
    citations.value = []
  } finally {
    loading.value = false
  }
}

async function loadCitationBins() {
  binsLoading.value = true
  binsError.value = null
  try {
    citationBins.value = await api.citationBins()
  } catch (err) {
    binsError.value = err instanceof Error ? err.message : 'Failed to load citation histogram'
    citationBins.value = []
  } finally {
    binsLoading.value = false
  }
}

async function loadYearlyCitations() {
  yearlyLoading.value = true
  yearlyError.value = null
  try {
    yearlyCitations.value = await api.yearlyCitations(selectedYearYearly.value, 20)
  } catch (err) {
    yearlyError.value = err instanceof Error ? err.message : 'Failed to load yearly citations'
    yearlyCitations.value = []
  } finally {
    yearlyLoading.value = false
  }
}

watch([selectedMonth, selectedYear], loadCitations)
watch(selectedYearYearly, loadYearlyCitations)
onMounted(() => {
  loadCitationBins()
  loadCitations()
  loadYearlyCitations()
})

const citationBinChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: '#e5e7eb' },
      title: { display: true, text: 'Papers' },
    },
    x: {
      grid: { display: false },
      title: { display: true, text: 'Citation range' },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.parsed.y} papers`,
      },
    },
  },
}
</script>

<style scoped>
.row-fixed-height .p-datatable-tbody > tr {
  height: 56px;
}

.row-fixed-height .p-datatable-tbody > tr > td {
  height: 56px;
  max-height: 56px;
}

.cell-scroll {
  max-height: 40px;
  overflow-y: auto;
}
</style>
