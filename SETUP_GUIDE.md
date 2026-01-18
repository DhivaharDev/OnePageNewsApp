# 🚀 Complete Setup Guide

This guide will walk you through setting up the One Page News App from scratch.

## 📋 Prerequisites Checklist

- [ ] Node.js 20+ installed ([Download](https://nodejs.org/))
- [ ] Git installed ([Download](https://git-scm.com/))
- [ ] GitHub account ([Sign up](https://github.com/join))
- [ ] Vercel account ([Sign up](https://vercel.com/signup))
- [ ] Anthropic API key ([Get key](https://console.anthropic.com/))

## Step 1: Get Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Name it "news-app-production"
6. Copy the key (starts with `sk-ant-`)
7. **Save it securely** - you'll need it later

## Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/one-page-news-app.git
cd one-page-news-app

# Install dependencies
npm install
```

## Step 3: Local Development Setup

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local and add your API key
nano .env.local
```

Add this content:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Test the news fetching script
npm run fetch-news

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: one-page-news-app
# - Directory: ./
# - Framework: Next.js
```

### Option B: Using Vercel Dashboard

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)

3. Click "Import Project"

4. Select your GitHub repository

5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Click "Deploy"

## Step 5: Add Vercel Environment Variables

1. Go to your Vercel project dashboard

2. Click "Settings" → "Environment Variables"

3. Add variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-your-key-here`
   - **Environment**: All (Production, Preview, Development)

4. Click "Save"

5. Redeploy:
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

## Step 6: Setup GitHub Actions

1. Go to your GitHub repository

2. Click "Settings" → "Secrets and variables" → "Actions"

3. Click "New repository secret"

4. Add secret:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key

5. Click "Add secret"

6. Verify workflow file exists at `.github/workflows/update-news.yml`

## Step 7: Test GitHub Actions

### Manual Test

1. Go to "Actions" tab in GitHub

2. Select "Update Daily News" workflow

3. Click "Run workflow" dropdown

4. Click green "Run workflow" button

5. Wait for completion (1-2 minutes)

6. Check if `public/news-data.json` was updated

### Verify Auto-Schedule

The workflow is scheduled to run at **7:00 AM IST daily**.

To verify:
1. Check `.github/workflows/update-news.yml`
2. Look for: `cron: '30 1 * * *'`
3. This means 1:30 AM UTC = 7:00 AM IST

## Step 8: Verify Deployment

1. Visit your Vercel URL (e.g., `https://one-page-news-app.vercel.app`)

2. Check all features:
   - [ ] Page loads without errors
   - [ ] Three.js background animates
   - [ ] News cards display
   - [ ] Swipe gestures work (mobile)
   - [ ] Topic filter buttons work
   - [ ] All 3 topics show news

3. Test on mobile device

4. Check browser console for errors

## Step 9: Setup Custom Domain (Optional)

1. Go to Vercel project → "Settings" → "Domains"

2. Add your domain (e.g., `news.yourdomain.com`)

3. Configure DNS:
   ```
   Type: CNAME
   Name: news
   Value: cname.vercel-dns.com
   ```

4. Wait for DNS propagation (5-30 minutes)

## Step 10: Monitor & Maintain

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### Check GitHub Actions History
- Go to "Actions" tab
- View past runs and logs

### Monitor Rate Limiting
Check response headers in browser DevTools:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 28
```

## 🔧 Troubleshooting

### Issue: News data not loading

**Solution:**
1. Check if `public/news-data.json` exists
2. Run `npm run fetch-news` locally
3. Check browser console for errors
4. Verify API key is set in Vercel

### Issue: GitHub Action failing

**Solution:**
1. Check Actions logs for errors
2. Verify `ANTHROPIC_API_KEY` secret exists
3. Test locally: `npm run fetch-news`
4. Check API key validity

### Issue: Build failing on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version (should be 20+)

### Issue: DDoS protection too strict

**Solution:**
Edit `middleware.ts`:
```typescript
const RATE_LIMIT_CONFIG = {
  maxRequests: 60,  // Increase from 30
}
```

### Issue: Three.js not working

**Solution:**
1. Check browser console for WebGL errors
2. Try different browser
3. Disable if needed in `app/page.tsx`:
   ```typescript
   // Comment out:
   // <ThreeBackground />
   ```

## 📊 Success Metrics

After setup, you should have:

- ✅ App deployed to Vercel
- ✅ Custom domain configured (optional)
- ✅ GitHub Actions running daily at 7 AM IST
- ✅ DDoS protection active
- ✅ News updating automatically
- ✅ Mobile-responsive UI
- ✅ Lighthouse score > 90
- ✅ No console errors

## 🎯 Next Steps

1. **Customize**:
   - Change colors in `tailwind.config.ts`
   - Modify topics in `lib/constants.ts`
   - Adjust Three.js effects in `components/ThreeBackground.tsx`

2. **Monitor**:
   - Check Vercel analytics
   - Review GitHub Actions logs
   - Monitor API usage in Anthropic console

3. **Optimize**:
   - Enable Vercel Analytics
   - Add error tracking (Sentry)
   - Setup uptime monitoring

## 📞 Need Help?

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/one-page-news-app/issues)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Anthropic Support**: [support.anthropic.com](https://support.anthropic.com)

---

**Setup complete! 🎉** Your news app should now be live and updating daily.
