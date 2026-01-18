export type NewsTopic = 'AI' | 'Stock' | 'Election'

export interface NewsItem {
  id: string
  topic: NewsTopic
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  imageUrl?: string | null
}

export interface NewsData {
  lastUpdated: string
  news: NewsItem[]
}

export interface TopicColors {
  bg: string
  text: string
  border: string
}
