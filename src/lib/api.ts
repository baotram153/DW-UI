import type { CitationBinData } from "@/types/citation-data.types";

const BASE = import.meta.env.VITE_API_BASE_URL;

const baseWithSlash = BASE.endsWith('/') ? BASE : `${BASE}/`;

async function request<T>(path: string, params?: Record<string, string | number>) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, baseWithSlash);
  Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{status: string}>('/health'),

  monthlyCategories: (year: number, month: number, limit = 20) =>
    request('/categories/monthly', { year, month, limit }),
  yearlyCategories: (year: number, limit = 20) =>
    request('/categories/yearly', { year, limit }),

  monthlyCitations: (year: number, month: number, limit = 20) =>
    request('/citations/monthly', { year, month, limit }),
  yearlyCitations: (year: number, limit = 20) =>
    request('/citations/yearly', { year, limit }),
  latestCitations: (limit = 20) => request('/citations/latest', { limit }),

  topAuthorsCitations: (year: number, limit = 20) =>
    request('/authors/citations', { year, limit }),
  topAuthorsNumPapers: (year: number, limit = 20) =>
    request('/authors/num-papers', { year, limit }),
  topAuthorsCategories: (year: number,) =>
    request('/authors/categories', { year }),
  citationBins: () => request<CitationBinData[]>('/citations/bins'),

};
