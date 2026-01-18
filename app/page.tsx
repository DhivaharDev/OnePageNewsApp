'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NewsData, NewsTopic } from '@/lib/types'
import { NEWS_DATA_PATH } from '@/lib/constants'
import NewsCarousel from '@/components/NewsCarousel'
import TopicFilter from '@/components/TopicFilter'
import LoadingState from '@/components/LoadingState'

// Dynamically import ThreeBackground to avoid SSR issues
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
})

export default function Home() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<NewsTopic | 'All'>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(NEWS_DATA_PATH, {
          cache: 'no-store', // Always fetch fresh data
        })

        if (!response.ok) {
          throw new Error('Failed to fetch news data')
        }

        const data: NewsData = await response.json()
        setNewsData(data)
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Unable to load news. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const filteredNews =
    selectedTopic === 'All'
      ? newsData?.news || []
      : newsData?.news.filter((item) => item.topic === selectedTopic) || []

  return (
    <>
      <ThreeBackground />

      <main className="relative min-h-screen">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              One Page News
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Stay updated with the latest in AI, Stock Market & Elections
            </p>
            {newsData?.lastUpdated && (
              <p className="text-sm text-gray-500 mt-3">
                Last updated: {new Date(newsData.lastUpdated).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            )}
          </header>

          {/* Topic Filter */}
          {!loading && !error && (
            <TopicFilter
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
            />
          )}

          {/* Content */}
          <div className="mt-8">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-red-500 text-6xl">⚠️</div>
                <p className="text-red-600 font-medium text-lg">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <NewsCarousel newsItems={filteredNews} />
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 pb-8">
            <p className="text-gray-500 text-sm">
              Built with Next.js, Tailwind CSS & Three.js
            </p>
            <p className="text-gray-400 text-xs mt-2">
              News updated daily at 7:00 AM IST
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
