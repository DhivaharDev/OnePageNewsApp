'use client'

import { NewsItem } from '@/lib/types'
import { TOPIC_COLORS } from '@/lib/constants'
import { formatTimeAgo, cn } from '@/lib/utils'

interface NewsCardProps {
  news: NewsItem
}

export default function NewsCard({ news }: NewsCardProps) {
  const colors = TOPIC_COLORS[news.topic]

  return (
    <article className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full mx-auto border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
            colors.bg,
            colors.text
          )}
        >
          {news.topic}
        </span>
        <time className="text-xs text-gray-500" dateTime={news.publishedAt}>
          {formatTimeAgo(news.publishedAt)}
        </time>
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">
        {news.title}
      </h2>

      {/* Summary */}
      <p className="text-base text-gray-600 leading-relaxed mb-6 line-clamp-5">
        {news.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 font-medium transition-colors',
            colors.text,
            'hover:underline'
          )}
        >
          Read More
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
        <span className="text-sm text-gray-500 font-medium">
          {news.source}
        </span>
      </div>
    </article>
  )
}
