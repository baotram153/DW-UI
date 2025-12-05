export type AuthorCitationsData = {
  year: number
  author: string
  total_citations: number
  rank_in_year: number
}

export type AuthorPapersData = {
  year: number
  author: string
  paper_count: number
  rank_in_year: number
}

export type AuthorCategoryData = {
  year: number
  author: string
  category: string
  paper_count: number
  rank_in_category_year: number
}
