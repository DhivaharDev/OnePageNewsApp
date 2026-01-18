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

      <main className="relative h-screen overflow-hidden flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col py-4 sm:py-6">
          {/* Header */}
          <header className="text-center mb-4 flex-shrink-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              Stay updated with the latest in AI, Stock Market & Elections
            </h1>
          </header>

          {/* Topic Filter */}
          {!loading && !error && (
            <div className="flex-shrink-0 mb-4">
              <TopicFilter
                selectedTopic={selectedTopic}
                onSelectTopic={setSelectedTopic}
              />
            </div>
          )}

          {/* Content - Takes remaining space */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-red-400 text-6xl">⚠️</div>
                <p className="text-red-300 font-medium text-lg">{error}</p>
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
          <footer className="text-center flex-shrink-0 py-3">
            {newsData?.lastUpdated && (
              <p className="text-xs text-gray-400 mb-1">
                Last updated: {new Date(newsData.lastUpdated).toLocaleString('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })} IST
              </p>
            )}
            <p className="text-gray-500 text-xs">
              News updated daily at 7:00 AM IST
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
