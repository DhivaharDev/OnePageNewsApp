import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync } from 'fs'
import { join } from 'path'

interface NewsItem {
  id: string
  topic: 'AI' | 'Stock' | 'Election'
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  imageUrl: string | null
}

interface NewsData {
  lastUpdated: string
  news: NewsItem[]
}

const TOPICS = ['AI', 'Stock', 'Election'] as const
const MAX_NEWS_PER_TOPIC = 4
const MAX_SUMMARY_WORDS = 100

async function fetchNewsForTopic(
  client: Anthropic,
  topic: string
): Promise<NewsItem[]> {
  console.log(`\n📰 Fetching news for topic: ${topic}`)

  try {
    const prompt = `You are a news aggregator. Find the top ${MAX_NEWS_PER_TOPIC} most recent and important news articles about "${topic}" from today or yesterday.

For each news article, provide:
1. Title (concise, under 100 characters)
2. Summary (EXACTLY ${MAX_SUMMARY_WORDS} words or less, no exceptions)
3. Source (publication name)
4. URL (if available, otherwise use a placeholder)
5. Published date/time (use ISO 8601 format, estimate if needed)

Format your response as a JSON array with this exact structure:
[
  {
    "title": "Article title here",
    "summary": "Brief summary here in ${MAX_SUMMARY_WORDS} words or less",
    "source": "Source Name",
    "url": "https://example.com/article",
    "publishedAt": "2026-01-18T10:30:00Z"
  }
]

Important:
- Summaries MUST be ${MAX_SUMMARY_WORDS} words or less
- Only include real, recent news from credible sources
- Use actual URLs when possible
- Ensure dates are recent (today or yesterday)
- Return valid JSON only, no additional text

Topic: ${topic}`

    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022', // Using Haiku for cost efficiency (~10x cheaper than Sonnet)
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

    // Convert to NewsItem format
    const newsItems: NewsItem[] = articles.slice(0, MAX_NEWS_PER_TOPIC).map((article, index) => ({
      id: `${topic.toLowerCase()}-${Date.now()}-${index}`,
      topic: topic as 'AI' | 'Stock' | 'Election',
      title: article.title,
      summary: article.summary,
      source: article.source,
      url: article.url || 'https://example.com',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: null,
    }))

    console.log(`✅ Successfully fetched ${newsItems.length} articles for ${topic}`)
    return newsItems
  } catch (error) {
    console.error(`❌ Error fetching news for ${topic}:`, error)

    // Return fallback news item
    return [
      {
        id: `${topic.toLowerCase()}-fallback-${Date.now()}`,
        topic: topic as 'AI' | 'Stock' | 'Election',
        title: `${topic} News Update`,
        summary: `Unable to fetch latest ${topic} news at this time. Our automated system encountered an issue. Please check back later for updates.`,
        source: 'System',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        imageUrl: null,
      },
    ]
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
