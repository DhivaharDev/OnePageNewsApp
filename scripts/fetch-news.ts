import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { NewsItem, NewsData } from '../lib/types'

const TOPICS = ['AI', 'Stock', 'Election'] as const
const MAX_NEWS_PER_TOPIC = 4
const MAX_SUMMARY_WORDS = 100

async function fetchNewsForTopic(
  client: Anthropic,
  topic: string
): Promise<NewsItem[]> {
  console.log(`\n📰 Fetching news for topic: ${topic}`)

  try {
    // Get current date info for the prompt
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString().split('T')[0]

    const prompt = `You are a real-time news aggregator. TODAY'S DATE is ${today}.

CRITICAL REQUIREMENTS - READ CAREFULLY:
1. Find ONLY news published in the LAST 48 HOURS (from ${twoDaysAgo} onwards to ${today})
2. News MUST be from ${today} (today) OR ${yesterday} (yesterday) ONLY
3. DO NOT include any news older than 48 hours (before ${twoDaysAgo})
4. Prioritize breaking news and stories from TODAY (${today}) over yesterday
5. Use REAL current events happening NOW, not old historical events

Find the top ${MAX_NEWS_PER_TOPIC} most recent and important news articles about "${topic}" from the LAST 48 HOURS ONLY.

For each news article, provide:
1. Title (concise, under 100 characters)
2. Summary (EXACTLY ${MAX_SUMMARY_WORDS} words or less, no exceptions)
3. Source (publication name - real news outlet)
4. URL (if available, otherwise use a placeholder)
5. Published date/time (MUST be ${today} or ${yesterday} - use actual article date)

Format your response as a JSON array with this exact structure:
[
  {
    "title": "Article title here",
    "summary": "Brief summary here in ${MAX_SUMMARY_WORDS} words or less",
    "source": "Source Name",
    "url": "https://example.com/article",
    "publishedAt": "2026-01-18T14:30:00Z"
  }
]

STRICT VALIDATION RULES:
- Summaries MUST be ${MAX_SUMMARY_WORDS} words or less
- ONLY include news from ${today} or ${yesterday} (last 48 hours max)
- Absolutely NO news from ${twoDaysAgo} or earlier
- Use actual publication dates from real articles
- Dates MUST be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
- Prioritize breaking news from TODAY over yesterday's news
- Only credible news sources (Reuters, AP, Bloomberg, TechCrunch, etc.)
- Return valid JSON only, no additional text or explanations

Topic: ${topic}
Current Time: ${now.toISOString()}`

    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307', // Using Haiku for cost efficiency (~10x cheaper than Sonnet)
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON from response
    let jsonText = content.text.trim()

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')

    const articles = JSON.parse(jsonText)

    if (!Array.isArray(articles)) {
      throw new Error('Response is not an array')
    }

    // Convert to NewsItem format and validate dates
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

    const newsItems = articles
      .slice(0, MAX_NEWS_PER_TOPIC)
      .map((article, index) => {
        const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date()

        // Validate date is within last 48 hours
        if (publishedDate < fortyEightHoursAgo) {
          console.warn(`⚠️ Skipping old article (${publishedDate.toISOString()}): ${article.title}`)
          return null
        }

        const newsItem: NewsItem = {
          id: `${topic.toLowerCase()}-${Date.now()}-${index}`,
          topic: topic as 'AI' | 'Stock' | 'Election',
          title: article.title,
          summary: article.summary,
          source: article.source,
          url: article.url || 'https://example.com',
          publishedAt: publishedDate.toISOString(),
        }
        return newsItem
      })
      .filter((item): item is NewsItem => item !== null)

    console.log(`✅ Successfully fetched ${newsItems.length} articles for ${topic} (within last 48 hours)`)

    // If no valid recent articles, throw error to trigger fallback
    if (newsItems.length === 0) {
      throw new Error('No recent articles found within last 48 hours')
    }

    return newsItems
  } catch (error) {
    console.error(`❌ Error fetching news for ${topic}:`, error)

    // Return fallback news item
    const fallbackItem: NewsItem = {
      id: `${topic.toLowerCase()}-fallback-${Date.now()}`,
      topic: topic as 'AI' | 'Stock' | 'Election',
      title: `${topic} News Update`,
      summary: `Unable to fetch latest ${topic} news at this time. Our automated system encountered an issue. Please check back later for updates.`,
      source: 'System',
      url: 'https://example.com',
      publishedAt: new Date().toISOString(),
    }
    return [fallbackItem]
  }
}

async function main() {
  console.log('🚀 Starting news fetch process...')
  console.log(`📅 Timestamp: ${new Date().toISOString()}`)

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is not set')
    process.exit(1)
  }

  const client = new Anthropic({
    apiKey,
  })

  try {
    // Fetch news for all topics
    const allNews: NewsItem[] = []

    for (const topic of TOPICS) {
      const newsItems = await fetchNewsForTopic(client, topic)
      allNews.push(...newsItems)

      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
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
