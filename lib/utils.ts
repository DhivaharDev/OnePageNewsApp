import { formatDistanceToNow } from 'date-fns'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatTimeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ') + '...'
}

export function validateSummary(summary: string, maxWords: number): boolean {
  const wordCount = summary.trim().split(/\s+/).length
  return wordCount <= maxWords
}

export function getNewsAge(publishedAt: string): 'today' | 'yesterday' | 'older' {
  const now = new Date()
  const published = new Date(publishedAt)
  const diffInHours = (now.getTime() - published.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return 'today'
  } else if (diffInHours < 48) {
    return 'yesterday'
  } else {
    return 'older'
  }
}

export function getNewsAgeBadge(publishedAt: string): { text: string; color: string } | null {
  const age = getNewsAge(publishedAt)

  if (age === 'today') {
    return { text: 'TODAY', color: 'bg-green-500' }
  } else if (age === 'yesterday') {
    return { text: 'YESTERDAY', color: 'bg-blue-500' }
  }

  return null
}
