<template>
  <div>
    <TabNav :tabs="reportTabs" v-model:activeTab="activeTab" />
    <CitationReport v-if="activeTab === 'Citations'" />
    <AuthorReport v-else-if="activeTab === 'Authors'" />
    <CategoryReport v-else-if="activeTab === 'Categories'" />
    <MachineLearningReport v-else :data="mlData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabNav from '@/components/layout/TabNav.vue'
import MachineLearningReport from '@/components/reports/MachineLearningReport.vue'
import CitationReport from '@/components/reports/CitationReport.vue'
import CategoryReport from '@/components/reports/CategoryReport.vue'
import AuthorReport from '@/components/reports/AuthorReport.vue'
import type { ReportCategory } from '@/types/ReportCategory'
import { api } from '@/lib/api'

type MonthlyData = {
  categories: { name: string; count: number; percentage: number; color: string }[]
  papers: { title: string; authors: string; citations: number }[]
}

type YearlyCitationData = {
  id: string
  citation_count: number
  year: string
  rank_in_month: number
  title: string
  authors: string
}

type CitationData = {
  monthlyCitationData: MonthlyCitationData[]
  yearlyCitationData: YearlyCitationData[]
}

type YearlyData = {
  categories: { name: string; percentage: number; color: string }[]
  papers: { title: string; citations: number }[]
  authors: { name: string; citations: number; colors: [string, string] }[]
}

type MlData = {
  keywords: { text: string; count: number; bgColor: string; textColor: string }[]
  predictions: { keyword: string; confidence: number; trend: 'up' | 'down' }[]
  similarPapers: {
    title: string
    authors: string
    similarity: number
    bgGradient: string
    badgeClass: string
  }[]
}

const reportTabs: ReportCategory[] = ['Citations', 'Authors', 'Categories', 'Machine Learning']
const activeTab = ref<ReportCategory>(reportTabs[0]!)

// const monthlyData: MonthlyData = {
//   categories: [
//     { name: 'Machine Learning', count: 342, percentage: 85, color: 'bg-gradient-to-r from-blue-200 to-blue-300' },
//     { name: 'Computer Vision', count: 289, percentage: 72, color: 'bg-gradient-to-r from-pink-200 to-pink-300' },
//     { name: 'NLP', count: 156, percentage: 39, color: 'bg-gradient-to-r from-green-200 to-green-300' },
//     { name: 'Robotics', count: 98, percentage: 24, color: 'bg-gradient-to-r from-purple-200 to-purple-300' }
//   ],
//   papers: [
//     {
//       title: 'Attention Is All You Need: Transformers for Modern NLP',
//       authors: 'Vaswani et al.',
//       citations: 2847
//     },
//     {
//       title: 'Diffusion Models Beat GANs on Image Synthesis',
//       authors: 'Dhariwal & Nichol',
//       citations: 1563
//     },
//     {
//       title: 'Vision Transformers for Fine-Grained Classification',
//       authors: 'Dosovitskiy et al.',
//       citations: 987
//     }
//   ]
// }

const yearlyData: YearlyData = {
  categories: [
    { name: 'Machine Learning', percentage: 42, color: 'bg-gradient-to-r from-blue-200 to-blue-300' },
    { name: 'Computer Vision', percentage: 28, color: 'bg-gradient-to-r from-pink-200 to-pink-300' },
    { name: 'NLP', percentage: 18, color: 'bg-gradient-to-r from-green-200 to-green-300' },
    { name: 'Other', percentage: 12, color: 'bg-gradient-to-r from-stone-200 to-stone-300' }
  ],
  papers: [
    { title: 'Attention Is All You Need', citations: 2847 },
    { title: 'Diffusion Models Beat GANs', citations: 1563 },
    { title: 'Vision Transformers', citations: 987 }
  ],
  authors: [
    { name: 'Yoshua Bengio', citations: 3421, colors: ['#fde68a', '#fcd34d'] },
    { name: 'Yann LeCun', citations: 2987, colors: ['#c7d2fe', '#a5b4fc'] },
    { name: 'Geoffrey Hinton', citations: 2654, colors: ['#fbcfe8', '#f9a8d4'] },
    { name: 'Andrew Ng', citations: 2341, colors: ['#dcfce7', '#bbf7d0'] }
  ]
}

const mlData: MlData = {
  keywords: [
    { text: 'Transformers', count: 2847, bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    { text: 'Vision', count: 2156, bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
    { text: 'Attention', count: 1987, bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
    { text: 'Diffusion', count: 1654, bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
    { text: 'Neural Networks', count: 1432, bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { text: 'Language Models', count: 1298, bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
    { text: 'Embedding', count: 987, bgColor: 'bg-rose-100', textColor: 'text-rose-700' },
    { text: 'Fine-tuning', count: 876, bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' }
  ],
  predictions: [
    { keyword: 'Multimodal AI', confidence: 92, trend: 'up' },
    { keyword: 'Efficient Models', confidence: 88, trend: 'up' },
    { keyword: 'Reasoning', confidence: 85, trend: 'up' }
  ],
  similarPapers: [
    {
      title: 'Efficient Attention via Linformer',
      authors: 'Wang et al.',
      similarity: 94,
      bgGradient: 'from-blue-50 to-blue-100',
      badgeClass: 'bg-blue-200 text-blue-700'
    },
    {
      title: 'BERT: Pre-training Deep Bidirectional Transformers',
      authors: 'Devlin et al.',
      similarity: 89,
      bgGradient: 'from-indigo-50 to-indigo-100',
      badgeClass: 'bg-indigo-200 text-indigo-700'
    },
    {
      title: 'Scaling Vision Transformers',
      authors: 'Zhai et al.',
      similarity: 86,
      bgGradient: 'from-purple-50 to-purple-100',
      badgeClass: 'bg-purple-200 text-purple-700'
    },
    {
      title: 'Efficient Transformers: A Survey',
      authors: 'Tay et al.',
      similarity: 82,
      bgGradient: 'from-pink-50 to-pink-100',
      badgeClass: 'bg-pink-200 text-pink-700'
    },
    {
      title: 'RoPE: Rotary Position Embeddings',
      authors: 'Su et al.',
      similarity: 79,
      bgGradient: 'from-rose-50 to-rose-100',
      badgeClass: 'bg-rose-200 text-rose-700'
    },
    {
      title: 'FlashAttention: Fast and Memory-Efficient',
      authors: 'Dao et al.',
      similarity: 76,
      bgGradient: 'from-teal-50 to-teal-100',
      badgeClass: 'bg-teal-200 text-teal-700'
    }
  ]
}
</script>
