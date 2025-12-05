<template>
  <section class="animate-fadeIn flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-8 p-4">
    <div class="flex flex-col flex-1 lg:pr-4">
      <div id="category-chart" class="mb-6">
        <div class="pb-4">
          <h2 class="text-2xl font-bold text-stone-800 p-2">Monthly volume by category</h2>
          <p class="text-stone-600 p-2">Bar chart of papers per month in {{ chartYear }}.</p>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap gap-3">
              <Dropdown
                v-model="selectedCategory"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select category"
                class="w-56"
              />
              <Dropdown
                v-model="chartYear"
                :options="yearOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Year"
                class="w-28"
              />
            </div>
          </div>
        </div>
        
        <div class="rounded-2xl bg-white p-4 shadow-sm">
          <div class="mt-4 h-70 p-4">
            <p v-if="chartError" class="text-xs font-semibold text-rose-600">{{ chartError }}</p>
            <Chart
              v-else
              type="bar"
              :data="categoryChartData"
              :options="chartOptions"
              :plugins="[valueLabelPlugin]"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>

      <div id="monthly-categories">
        <div class="flex flex-col px-4 py-6 w-full">
          <h1 class="text-2xl font-black p-2">Monthly Category Report</h1>
          <h3 class="p-2 text-stone-600">Top categories by month</h3>
        </div>
        <div class="flex flex-wrap items-center gap-4 p-2">
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
          <span v-if="error" class="text-xs font-semibold text-rose-600">{{ error }}</span>
        </div>

        <div class="w-full">
          <DataTable
            :value="monthlyCategories"
            paginator
            :rows="rows"
            :rowsPerPageOptions="[5, 10]"
            :loading="loading"
            responsiveLayout="scroll"
            scrollable
            scrollHeight="600px"
            dataKey="category"
            class="row-fixed-height p-2"
          >
            <Column field="rank_in_month" header="Rank" style="width: 80px;" />
            <Column field="category" header="Category" />
            <Column field="paper_count" header="Papers" style="width: 120px;" />
            <Column field="month" header="Month" style="width: 90px;" />
            <Column field="year" header="Year" style="width: 90px;" />
          </DataTable>
        </div>
      </div>

      <div class="p-2" id="yearly-categories">
        <div class="mb-2 flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Yearly Category Report</h1>
            <h4 class="text-stone-600">Top categories of the year</h4>
          </div>
          <div class="flex items-center gap-3">
            <Dropdown
              v-model="selectedYearYearly"
              :options="yearOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Year"
              class="w-32"
            />
            <span v-if="yearlyError" class="text-xs font-semibold text-rose-600">{{ yearlyError }}</span>
          </div>
        </div>

        <DataTable
          :value="yearlyCategories"
          paginator
          :rows="rows"
          :rowsPerPageOptions="[5, 10]"
          :loading="yearlyLoading"
          responsiveLayout="scroll"
          scrollable
          scrollHeight="600px"
          dataKey="category"
          class="row-fixed-height p-2"
        >
          <Column field="rank_in_year" header="Rank" style="width: 80px;" />
          <Column field="category" header="Category" />
          <Column field="paper_count" header="Papers" style="width: 120px;" />
          <Column field="year" header="Year" style="width: 90px;" />
        </DataTable>
      </div>
    </div>

    <aside class="sticky top-6 self-start w-full lg:w-64 p-4 lg:h-max">
      <div class="rounded-lg border border-stone-200 bg-white/80 p-4 shadow-sm">
        <h4 class="text-sm font-semibold text-stone-700">Table of contents</h4>
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-600">
          <li><a href="#category-chart" class="text-blue-700 hover:underline">Category monthly bar chart</a></li>
          <li><a href="#monthly-categories" class="text-blue-700 hover:underline">Top categories by month</a></li>
          <li><a href="#yearly-categories" class="text-blue-700 hover:underline">Top categories of the year</a></li>
        </ol>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Chart from 'primevue/chart'

import { api } from '@/lib/api'
import type { MonthlyCategoryData, YearlyCategoryData } from '@/types/category-data.types'

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
const chartYear = ref<number>(currentYear)
const categoryOptions = ref<{ label: string; value: string }[]>([])
const selectedCategory = ref<string | null>(null)

const monthlyCategories = ref<MonthlyCategoryData[]>([])
const yearlyCategories = ref<YearlyCategoryData[]>([])
const categoryChartData = ref<Record<string, unknown> | null>(null)

const loading = ref(false)
const yearlyLoading = ref(false)
const error = ref<string | null>(null)
const yearlyError = ref<string | null>(null)
const chartError = ref<string | null>(null)

const rows = 10

async function loadMonthlyCategories() {
  loading.value = true
  error.value = null
  try {
    monthlyCategories.value = await api.monthlyCategories(selectedYear.value, selectedMonth.value, 20)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load monthly categories'
    monthlyCategories.value = []
  } finally {
    loading.value = false
  }
}

async function loadYearlyCategories() {
  console.log('Loading yearly categories for', selectedYearYearly.value)
  yearlyLoading.value = true
  yearlyError.value = null
  try {
    yearlyCategories.value = await api.yearlyCategories(selectedYearYearly.value, 20)
  } catch (err) {
    yearlyError.value = err instanceof Error ? err.message : 'Failed to load yearly categories'
    yearlyCategories.value = []
  } finally {
    yearlyLoading.value = false
  }
}

watch([selectedMonth, selectedYear], loadMonthlyCategories)
watch(selectedYearYearly, loadYearlyCategories)
watch([selectedCategory, chartYear], loadCategoryChart)

onMounted(() => {
  loadCategoryOptions()
  loadMonthlyCategories()
  loadYearlyCategories()
})

async function loadCategoryOptions() {
  try {
    const categories2025 = await api.yearlyCategories(2025, 100)
    categoryOptions.value = categories2025.map((c) => ({
      label: c.category,
      value: c.category,
    }))
    if (!selectedCategory.value && categoryOptions.value.length) {
      selectedCategory.value = categoryOptions.value[0]!.value
    }
  } catch (err) {
    chartError.value = err instanceof Error ? err.message : 'Failed to load categories'
  }
}

async function loadCategoryChart() {
  if (!selectedCategory.value) return
  chartError.value = null
  try {
    const counts = await Promise.all(
      monthOptions.map(async (m) => {
        const monthData = await api.monthlyCategories(chartYear.value, m.value, 100)
        const match = monthData.find((c) => c.category === selectedCategory.value)
        return match ? match.paper_count : 0
      })
    )

    categoryChartData.value = {
      labels: monthOptions.map((m) => m.label),
      datasets: [
        {
          label: `${selectedCategory.value} papers in ${chartYear.value}`,
          data: counts,
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
        },
      ],
    }
  } catch (err) {
    chartError.value = err instanceof Error ? err.message : 'Failed to load chart data'
    categoryChartData.value = null
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: '#e5e7eb' },
    },
    x: {
      grid: { display: false },
    },
  },
  plugins: {
    legend: {
      labels: { color: '#374151' },
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.parsed.y} papers`,
      },
    },
  },
}

const valueLabelPlugin = {
  id: 'valueLabels',
  afterDatasetsDraw: (chart: any) => {
    const { ctx } = chart
    ctx.save()
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      if (!meta || !meta.data) return
      meta.data.forEach((bar: any, index: number) => {
        const value = dataset.data[index]
        if (value === undefined || value === null) return
        const { x, y } = bar.tooltipPosition()
        ctx.fillStyle = '#111827'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText(String(value), x, y - 6)
      })
    })
    ctx.restore()
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
</style>
