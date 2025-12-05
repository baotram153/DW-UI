export type MonthlyCitationData = {
  id: string
  citation_count: number
  month: number
  year: number
  rank_in_month: number
  title: string
  authors: string
}

export type YearlyCitationData = {
  id: string
  citation_count: number
  year: number
  rank_in_year: number
  title: string
  authors: string
}

export type CitationBinData = {
  bin_start: number
  bin_end: number
  paper_count: number
}
