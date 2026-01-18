# 🧪 Test News Fetch Locally

Quick guide to test the news fetching script locally before deploying.

## Prerequisites

- Node.js 20+ installed
- Your Anthropic API key
- Project dependencies installed (`npm install`)

---

## 🚀 Quick Test

### 1. Set Your API Key

**Option A: Temporary (Linux/Mac)**
```bash
export ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

**Option B: Using .env.local file** (Recommended)
```bash
# Create .env.local file
echo "ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here" > .env.local
```

### 2. Run the Fetch Script

```bash
npm run fetch-news
```

### 3. Expected Output

You should see:

```
🚀 Starting news fetch process...
📅 Timestamp: 2026-01-18T10:30:00.000Z

📰 Fetching news for topic: AI
✅ Successfully fetched 4 articles for AI

📰 Fetching news for topic: Stock
✅ Successfully fetched 4 articles for Stock

📰 Fetching news for topic: Election
✅ Successfully fetched 4 articles for Election

✨ Success! News data written to: /path/to/OnePageNewApp/public/news-data.json
📊 Total articles fetched: 12

Breakdown by topic:
  - AI: 4 articles
  - Stock: 4 articles
  - Election: 4 articles
```

### 4. Verify Output

Check the generated file:

```bash
cat public/news-data.json
```

You should see JSON with news articles:

```json
{
  "lastUpdated": "2026-01-18T10:30:00.000Z",
  "news": [
    {
      "id": "ai-1737195000000-0",
      "topic": "AI",
      "title": "Example AI News Title",
      "summary": "Brief summary of the news article...",
      "source": "TechCrunch",
      "url": "https://techcrunch.com/...",
      "publishedAt": "2026-01-18T08:00:00Z",
      "imageUrl": null
    }
  ]
}
```

---

## ✅ Success Indicators

- Script completes without errors
- `public/news-data.json` file is created/updated
- File contains 12 articles (4 per topic: AI, Stock, Election)
- Each article has title, summary (≤100 words), source, URL
- No error messages in console

---

## ❌ Common Issues

### Error: "ANTHROPIC_API_KEY environment variable is not set"

**Cause**: API key not set in environment

**Solution**:
```bash
# Set it in terminal
export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Or create .env.local file
echo "ANTHROPIC_API_KEY=sk-ant-api03-xxxxx" > .env.local
```

### Error: "Authentication error" or "Invalid API key"

**Cause**: Wrong or expired API key

**Solution**:
1. Verify your API key at [console.anthropic.com](https://console.anthropic.com/)
2. Copy the key exactly (including `sk-ant-api03-` prefix)
3. Check for extra spaces or characters

### Error: "Module not found" or "Cannot find module"

**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
```

### Script Hangs or Takes Too Long

**Cause**: API rate limiting or network issues

**Solution**:
- Wait a moment and try again
- Check your internet connection
- Verify API key hasn't hit usage limits

### Error: "ENOENT: no such file or directory, open 'public/news-data.json'"

**Cause**: `public` folder doesn't exist

**Solution**:
```bash
mkdir -p public
npm run fetch-news
```

---

## 🔍 Detailed Testing

### Test Individual Components

**1. Check API Connection**
```bash
# Simple API test (requires curl and jq)
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-haiku-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**2. Validate Output JSON**
```bash
# Check if JSON is valid
cat public/news-data.json | jq .

# Count articles
cat public/news-data.json | jq '.news | length'

# Check topics
cat public/news-data.json | jq '.news[].topic' | sort | uniq -c
```

**3. Check Summary Length**
```bash
# Count words in first summary
cat public/news-data.json | jq -r '.news[0].summary' | wc -w
```

Should be ≤ 100 words.

---

## 📊 Cost Tracking

### Estimate API Costs

Each test run:
- Makes **3 API calls** (one per topic)
- Uses **Claude Haiku** model
- Approximate cost: **~$0.015** per test

**Example calculation:**
```
Input tokens: ~500 tokens/request × 3 requests = 1,500 tokens
Output tokens: ~2,000 tokens/request × 3 requests = 6,000 tokens

Cost = (1,500 ÷ 1,000,000 × $0.25) + (6,000 ÷ 1,000,000 × $1.25)
     ≈ $0.0004 + $0.0075
     ≈ $0.008 per test run
```

**Recommendation**: Limit local testing to 2-3 runs to minimize costs.

---

## 🧹 Cleanup

After testing, you may want to:

### Remove Generated File
```bash
rm public/news-data.json
```

### Clear Environment Variable
```bash
unset ANTHROPIC_API_KEY
```

### Keep .env.local for Development
```bash
# .env.local is already in .gitignore
# Safe to keep for local dev, won't be committed
```

---

## 🎯 Ready for Production?

After successful local testing:

1. ✅ Script runs without errors
2. ✅ Generates valid JSON
3. ✅ Articles are relevant and recent
4. ✅ Summaries are ≤100 words
5. ✅ All 3 topics have articles

**Next step**: Set up GitHub Actions → See [GITHUB_SETUP.md](GITHUB_SETUP.md)

---

## 💡 Tips

### Test with Fewer Topics

Edit `scripts/fetch-news.ts` temporarily:

```typescript
// Change from:
const TOPICS = ['AI', 'Stock', 'Election'] as const

// To (for faster testing):
const TOPICS = ['AI'] as const
```

This reduces API calls from 3 to 1.

### Test with Fewer Articles

```typescript
// Change from:
const MAX_NEWS_PER_TOPIC = 4

// To:
const MAX_NEWS_PER_TOPIC = 2
```

Reduces output tokens and cost.

### Dry Run (No API Calls)

For testing structure without API costs, you can temporarily add mock data:

```typescript
// In fetchNewsForTopic(), before the try block, add:
if (process.env.DRY_RUN === 'true') {
  return [{
    id: `${topic.toLowerCase()}-mock-${Date.now()}`,
    topic: topic as any,
    title: `Mock ${topic} News`,
    summary: 'This is a mock news item for testing.',
    source: 'Mock Source',
    url: 'https://example.com',
    publishedAt: new Date().toISOString(),
    imageUrl: null,
  }]
}
```

Then run:
```bash
DRY_RUN=true npm run fetch-news
```

---

**Happy Testing! 🎉**
