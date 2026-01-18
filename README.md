# 📰 One Page News App

A high-performance, mobile-friendly Single Page Application (SPA) for viewing the latest news on AI, Stock Market, and Elections. Features beautiful card-based UI with swipe gestures, Three.js animated background, and automated daily updates via GitHub Actions.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Three.js](https://img.shields.io/badge/Three.js-0.160-black)
![License](https://img.shields.io/badge/License-Apache%202.0-green)

## ✨ Features

- 🎨 **Beautiful UI**: Clean, minimalist design with Tailwind CSS
- 📱 **Mobile-First**: Fully responsive with touch-optimized swipe gestures
- 🎭 **3D Background**: Subtle Three.js particle animation
- 🔄 **Auto-Updates**: Daily news fetch at 7:00 AM IST via GitHub Actions
- 🤖 **AI-Powered**: Claude API for intelligent news summarization
- 🛡️ **DDoS Protection**: Built-in rate limiting and bot detection
- ⚡ **High Performance**: Lighthouse score > 90
- 🔒 **Secure**: CSP headers, XSS protection, secure headers
- 🎯 **3 Topics**: AI, Stock Market, and Election news

## 🏗️ Architecture

```
User Browser → Vercel Edge → Next.js SPA
                    ↓
            GitHub Repository
                    ↓
         GitHub Actions (Daily Cron)
                    ↓
            Claude API + Web Search
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- GitHub account
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Vercel account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/one-page-news-app.git
   cd one-page-news-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY` with your API key

4. **Deploy**
   - Vercel will automatically deploy on every push

### Setup GitHub Actions

1. **Add GitHub Secret**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key
   - Click "Add secret"

2. **Workflow Schedule**
   The workflow runs automatically at **7:00 AM IST** daily.

   To test manually:
   - Go to Actions tab
   - Select "Update Daily News"
   - Click "Run workflow"

## 🛡️ Security & DDoS Protection

### Built-in Protection

This app includes comprehensive DDoS protection suitable for **Hobby/Free tier**:

#### 1. **Rate Limiting**
- **30 requests per minute** per IP address
- **5-minute block** for violators
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

#### 2. **Bot Detection**
Blocks known bad user agents:
- Scrapers (curl, wget, python-requests)
- Malicious bots
- Unauthorized crawlers

#### 3. **Security Headers**
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- X-XSS-Protection

#### 4. **Request Validation**
- User-Agent checking
- IP-based tracking
- Automatic cleanup of old rate limit entries

### Rate Limit Configuration

Edit `middleware.ts` to adjust limits:

```typescript
const RATE_LIMIT_CONFIG = {
  windowMs: 60000,        // 1 minute window
  maxRequests: 30,        // Max 30 requests
  blockDuration: 300000,  // 5 minute block
}
```

### Vercel-Specific Protection

For **Vercel Pro** users, you can enable additional firewall rules in `vercel.json`:

```json
{
  "firewall": [
    {
      "rate_limit": {
        "window": "1m",
        "limit": 60,
        "action": "deny"
      }
    }
  ]
}
```

### Monitoring

Check rate limit headers in browser DevTools:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 2026-01-18T10:30:00Z
```

## 💰 Budget Management

### Cost Estimation (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel Hosting | Hobby (Free) | $0 |
| Claude API | ~90 requests/month | ~$1-3 |
| GitHub Actions | Free tier | $0 |
| **Total** | | **$1-3/month** |

### Free Tier Limits

- **Vercel Hobby**: 100GB bandwidth, unlimited sites
- **GitHub Actions**: 2,000 minutes/month (we use ~30 mins)
- **Claude API**: Pay as you go (~$0.015 per request)

### Cost Optimization Tips

1. **Reduce News Frequency**
   - Edit `.github/workflows/update-news.yml`
   - Change cron from daily to weekly: `0 1 * * 0`

2. **Limit News Per Topic**
   - Edit `scripts/fetch-news.ts`
   - Change `MAX_NEWS_PER_TOPIC` from 4 to 2

3. **Use Cached Responses**
   - News data is cached for 1 hour on CDN
   - Static site = minimal compute costs

## 🔧 Configuration

### Update Schedule (Change from 7:00 AM IST)

Edit `.github/workflows/update-news.yml`:

```yaml
schedule:
  - cron: '30 1 * * *'  # Current: 7:00 AM IST (1:30 AM UTC)
  # Examples:
  # - cron: '0 0 * * *'   # Midnight UTC (5:30 AM IST)
  # - cron: '30 12 * * *' # 6:00 PM IST (12:30 PM UTC)
```

**Cron Helper**: IST = UTC + 5:30

### Customize Topics

Edit `lib/constants.ts`:

```typescript
export const TOPICS: NewsTopic[] = ['AI', 'Stock', 'Election']
// Change to: ['Tech', 'Sports', 'Politics']
```

Update `lib/types.ts` to match.

### Styling

**Colors**: Edit `tailwind.config.ts`
```typescript
colors: {
  'accent-ai': '#3B82F6',      // Blue
  'accent-stock': '#10B981',   // Green
  'accent-election': '#8B5CF6', // Purple
}
```

**Animation**: Edit `components/ThreeBackground.tsx`
- Particle count, size, color, speed

## 📱 Mobile Optimization

- Touch-optimized swipe gestures
- Responsive typography (16px+ base)
- Fast 3-second load time
- PWA-ready (manifest.json)
- Mobile-first CSS

## 🧪 Testing

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

### Test News Fetch
```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxx
npm run fetch-news
```

## 📄 File Structure

```
one-page-news-app/
├── .github/
│   └── workflows/
│       └── update-news.yml      # GitHub Actions workflow
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── components/
│   ├── NewsCard.tsx             # Card component
│   ├── NewsCarousel.tsx         # Swipe carousel
│   ├── TopicFilter.tsx          # Filter buttons
│   ├── ThreeBackground.tsx      # 3D background
│   └── LoadingState.tsx         # Loading UI
├── lib/
│   ├── types.ts                 # TypeScript types
│   ├── constants.ts             # Constants
│   └── utils.ts                 # Utilities
├── public/
│   ├── news-data.json           # Auto-generated news
│   └── manifest.json            # PWA manifest
├── scripts/
│   └── fetch-news.ts            # Claude API script
├── middleware.ts                # DDoS protection
├── next.config.js               # Next.js config
├── vercel.json                  # Vercel config
└── package.json
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **Framer Motion** - Animations
- **Anthropic Claude** - AI news summarization
- **Vercel** - Hosting platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/one-page-news-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/one-page-news-app/discussions)

## 🔐 Security

Found a security vulnerability? Please email security@example.com instead of using the issue tracker.

---

**Built with ❤️ using Next.js, Claude AI, and modern web technologies**
