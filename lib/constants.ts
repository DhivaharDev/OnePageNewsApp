import { NewsTopic, TopicColors } from './types'

export const TOPICS: NewsTopic[] = ['AI', 'Stock', 'Election']

export const TOPIC_COLORS: Record<NewsTopic, TopicColors> = {
  AI: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
  },
  Stock: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
  },
  Election: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
  },
}

export const MAX_SUMMARY_WORDS = 100
export const NEWS_DATA_PATH = '/news-data.json'
