import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { NewsItem, NewsData } from '../lib/types'

const TOPICS = ['AI', 'Stock', 'Election'] as const
const MAX_NEWS_PER_TOPIC = 4
const MAX_SUMMARY_WORDS = 100

// Topic to search query mapping for NewsAPI
const TOPIC_QUERIES: Record<typeof TOPICS[number], string> = {
  'AI': 'artificial intelligence OR AI OR machine learning OR OpenAI OR ChatGPT',
  'Stock': 'stock market OR stocks OR nifty OR sensex OR BSE OR NSE OR trading',
  'Election': 'election OR politics OR government OR voting OR democracy',
}

async function fetchNewsFromAPI(topic: string): Promise<NewsItem[]> {
  console.log(`\n📰 Fetching news for topic: ${topic}`)

  try {
    const query = TOPIC_QUERIES[topic as keyof typeof TOPIC_QUERIES]
    const apiKey = process.env.GNEWS_API_KEY || 'demo'

    // Using gnews.io - Get free API key from https://gnews.io/
    const searchQuery = encodeURIComponent(query + ' India')
    const url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&country=in&max=10&apikey=${apiKey}`

    console.log(`🔍 Fetching from GNews API (key: ${apiKey === 'demo' ? 'demo (limited)' : 'custom'})...`)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const articles = data.articles || []

    if (articles.length === 0) {
      console.warn(`⚠️ No articles found for ${topic}`)
      return []
    }

    const now = new Date()
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

    const newsItems: NewsItem[] = articles
      .slice(0, MAX_NEWS_PER_TOPIC)
      .map((article: any, index: number) => {
        const publishedDate = new Date(article.publishedAt)

        // Validate date is within last 48 hours
        if (publishedDate < fortyEightHoursAgo) {
          console.warn(`⚠️ Skipping old article: ${article.title}`)
          return null
        }

        // Validate URL
        const url = article.url || ''
        const isValidUrl = url &&
                          !url.includes('example.com') &&
                          (url.startsWith('http://') || url.startsWith('https://')) &&
                          url.length > 15

        if (!isValidUrl) {
          console.warn(`⚠️ Skipping article with invalid URL: ${article.title}`)
          return null
        }

        // Truncate description to MAX_SUMMARY_WORDS
        let summary = article.description || article.content || 'No summary available.'
        const words = summary.split(' ')
        if (words.length > MAX_SUMMARY_WORDS) {
          summary = words.slice(0, MAX_SUMMARY_WORDS).join(' ') + '...'
        }

        const newsItem: NewsItem = {
          id: `${topic.toLowerCase()}-${Date.now()}-${index}`,
          topic: topic as 'AI' | 'Stock' | 'Election',
          title: article.title,
          summary: summary,
          source: article.source?.name || 'Unknown Source',
          url: url,
          publishedAt: publishedDate.toISOString(),
        }

        return newsItem
      })
      .filter((item: NewsItem | null): item is NewsItem => item !== null)

    console.log(`✅ Successfully fetched ${newsItems.length} articles for ${topic}`)
    return newsItems

  } catch (error) {
    console.error(`❌ Error fetching news for ${topic}:`, error)
    return []
  }
}

async function main() {
  console.log('🚀 Starting news fetch process...')
  console.log(`📅 Timestamp: ${new Date().toISOString()}`)
  console.log('📡 Using GNews API for real-time news...')

  try {
    // Fetch news for all topics
    const allNews: NewsItem[] = []

    for (const topic of TOPICS) {
      const newsItems = await fetchNewsFromAPI(topic)

      if (newsItems.length > 0) {
        allNews.push(...newsItems)
      } else {
        // Add fallback if no news found
        const fallbackItem: NewsItem = {
          id: `${topic.toLowerCase()}-fallback-${Date.now()}`,
          topic: topic as 'AI' | 'Stock' | 'Election',
          title: `Latest ${topic} News`,
          summary: `Stay tuned for the latest ${topic.toLowerCase()} news. Our system is working to bring you the most recent updates from trusted sources.`,
          source: 'News Aggregator',
          url: 'https://news.google.com',
          publishedAt: new Date().toISOString(),
        }
        allNews.push(fallbackItem)
      }

      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Create news data object
    const newsData: NewsData = {
      lastUpdated: new Date().toISOString(),
      news: allNews,
    }

    // Write to file
    const outputPath = join(process.cwd(), 'public', 'news-data.json')
    writeFileSync(outputPath, JSON.stringify(newsData, null, 2), 'utf-8')

    console.log('\n✨ Success! News data written to:', outputPath)
    console.log(`📊 Total articles fetched: ${allNews.length}`)
    console.log('\nBreakdown by topic:')
    for (const topic of TOPICS) {
      const count = allNews.filter(item => item.topic === topic).length
      console.log(`  - ${topic}: ${count} articles`)
    }

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
main()
