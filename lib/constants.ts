import { NewsTopic, TopicColors } from './types'

export const TOPICS: NewsTopic[] = ['AI', 'Stock', 'Election']

export const TOPIC_COLORS: Record<NewsTopic, TopicColors> = {
  AI: {
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-600',
  },
  Stock: {
    bg: 'bg-green-600',
    text: 'text-white',
    border: 'border-green-600',
  },
  Election: {
    bg: 'bg-purple-600',
    text: 'text-white',
    border: 'border-purple-600',
  },
}

export const MAX_SUMMARY_WORDS = 100
export const NEWS_DATA_PATH = '/news-data.json'
