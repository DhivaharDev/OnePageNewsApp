# 🔧 GitHub Actions Setup Guide

Complete step-by-step guide to set up automated news updates with Claude Haiku API.

## 📋 Prerequisites

- Your Anthropic API key (starts with `sk-ant-api03-...`)
- GitHub repository with push access
- This project pushed to GitHub

---

## 🔑 Step 1: Add API Key to GitHub Secrets

### 1. Navigate to Your Repository Settings

1. Go to your GitHub repository: `https://github.com/YourUsername/OnePageNewApp`
2. Click on **Settings** tab (at the top of the repository page)

### 2. Access Secrets and Variables

1. In the left sidebar, scroll down to **Security** section
2. Click on **Secrets and variables**
3. Click on **Actions**

### 3. Add New Repository Secret

1. Click the **New repository secret** button (green button on the right)
2. Fill in the form:
   - **Name**: `ANTHROPIC_API_KEY` (must be exactly this, case-sensitive)
   - **Secret**: Paste your Anthropic API key (e.g., `sk-ant-api03-xxxxxxxxxxxxx`)
3. Click **Add secret**

### ✅ Verification

You should now see `ANTHROPIC_API_KEY` listed under "Repository secrets"
- The value will be hidden (shows as `***`)
- Only shows "Updated X seconds/minutes ago"

---

## ⚙️ Step 2: Verify GitHub Actions Workflow

The workflow is already configured in `.github/workflows/update-news.yml`

### Workflow Configuration

```yaml
Name: Update Daily News
Schedule: 7:00 AM IST (1:30 AM UTC) - Daily
Trigger: Automatic + Manual
```

### View Workflow File

Check `.github/workflows/update-news.yml`:

```yaml
name: Update Daily News

on:
  schedule:
    - cron: '30 1 * * *'  # 7:00 AM IST (1:30 AM UTC)
  workflow_dispatch:      # Allows manual trigger

jobs:
  update-news:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Fetch and generate news
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run fetch-news

      - name: Commit and push changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "GitHub Actions Bot"
          git add public/news-data.json
          git diff --quiet && git diff --staged --quiet || \
            (git commit -m "📰 Update news data - $(date +'%Y-%m-%d %H:%M IST')" && \
             git push)
```

---

## 🧪 Step 3: Test the Workflow Manually

Before waiting for the scheduled run, test it manually:

### 1. Navigate to Actions Tab

1. Click on **Actions** tab in your repository
2. You should see "Update Daily News" workflow listed

### 2. Run Workflow Manually

1. Click on **Update Daily News** in the left sidebar
2. Click the **Run workflow** dropdown button (right side)
3. Select branch: `main` (or your default branch)
4. Click **Run workflow** (green button)

### 3. Monitor the Run

1. A new workflow run will appear (refreshing in real-time)
2. Click on the workflow run to see details
3. Expand each step to see logs

### 4. Expected Output

You should see logs like:

```
🚀 Starting news fetch process...
📅 Timestamp: 2026-01-18T01:30:00.000Z

📰 Fetching news for topic: AI
✅ Successfully fetched 4 articles for AI

📰 Fetching news for topic: Stock
✅ Successfully fetched 4 articles for Stock

📰 Fetching news for topic: Election
✅ Successfully fetched 4 articles for Election

✨ Success! News data written to: /home/runner/work/OnePageNewApp/OnePageNewApp/public/news-data.json
📊 Total articles fetched: 12

Breakdown by topic:
  - AI: 4 articles
  - Stock: 4 articles
  - Election: 4 articles
```

### 5. Verify Commit

1. Go to your repository **Commits** page
2. You should see a new commit: `📰 Update news data - 2026-01-18 07:00 IST`
3. Click on the commit to see changes to `public/news-data.json`

---

## 🔄 Step 4: Enable Automatic Runs

The workflow is already scheduled to run daily at **7:00 AM IST**.

### Schedule Details

- **Time**: 7:00 AM India Standard Time (IST)
- **UTC Time**: 1:30 AM UTC
- **Frequency**: Every day
- **Cron Expression**: `30 1 * * *`

### How It Works

1. **At 7:00 AM IST daily**, GitHub Actions automatically:
   - Checks out your code
   - Installs dependencies
   - Runs the fetch-news script
   - Commits updated `news-data.json`
   - Pushes to your repository

2. **Vercel detects the push** and:
   - Automatically rebuilds your site
   - Deploys the new version
   - Your site shows fresh news

---

## 🐛 Troubleshooting

### Workflow Fails with "API Key Not Found"

**Error**: `❌ ANTHROPIC_API_KEY environment variable is not set`

**Solution**:
1. Go to Settings → Secrets → Actions
2. Verify `ANTHROPIC_API_KEY` exists
3. Name must be EXACTLY `ANTHROPIC_API_KEY` (case-sensitive)
4. Re-add the secret if needed

### Workflow Fails with "Invalid API Key"

**Error**: `Error: Authentication error`

**Solution**:
1. Verify your API key is correct
2. Check it hasn't expired
3. Test locally: `export ANTHROPIC_API_KEY=your-key && npm run fetch-news`
4. Get a new key from [console.anthropic.com](https://console.anthropic.com/)

### Workflow Runs But No Commit

**Issue**: Workflow succeeds but no new commit appears

**Possible Causes**:
1. News data hasn't changed (same news as before)
2. Git diff found no changes

**Verification**:
- Check workflow logs for "nothing to commit"
- This is normal if news hasn't changed

### Rate Limiting Errors

**Error**: `Error: Rate limit exceeded`

**Solution**:
1. GitHub Actions free tier: 2,000 minutes/month
2. Our workflow uses ~3 minutes/day = ~90 minutes/month
3. Check your GitHub Actions usage: Settings → Billing

### Permission Denied When Pushing

**Error**: `Permission denied (publickey)` or `403 Forbidden`

**Solution**:
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

---

## 📊 Monitoring & Maintenance

### View Workflow History

1. Go to **Actions** tab
2. Click on **Update Daily News**
3. See all past runs with status (✅ success, ❌ failed)

### Email Notifications

GitHub sends email notifications for:
- Failed workflow runs
- First failure after successes

**Configure notifications**:
1. Click your profile picture → Settings
2. Notifications → Actions
3. Choose notification preferences

### Check API Usage

Monitor your Anthropic API costs:

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Go to **Usage** tab
3. See daily API call count

**Expected Monthly Usage** (with Claude Haiku):
- **Calls**: ~90 requests/month (3 topics × 1 call × 30 days)
- **Cost**: ~$0.20 - $0.50/month
- **Haiku pricing**: ~$0.25 per million input tokens, ~$1.25 per million output tokens

---

## 🎯 Customization

### Change Schedule Time

Edit `.github/workflows/update-news.yml`:

```yaml
schedule:
  - cron: '30 1 * * *'  # Current: 7:00 AM IST

  # Change to 9:00 AM IST (3:30 AM UTC):
  - cron: '30 3 * * *'

  # Change to 6:00 PM IST (12:30 PM UTC):
  - cron: '30 12 * * *'
```

**Cron Helper**:
- IST = UTC + 5 hours 30 minutes
- Formula: IST_hour - 5.5 = UTC_hour
- Example: 7:00 AM IST → 1:30 AM UTC → cron: `30 1 * * *`

### Change Frequency

```yaml
# Every 12 hours:
- cron: '0 */12 * * *'

# Weekly (Sundays at 7 AM IST):
- cron: '30 1 * * 0'

# Twice daily (7 AM and 7 PM IST):
- cron: '30 1,13 * * *'
```

### Reduce Articles Per Topic

Edit `scripts/fetch-news.ts`:

```typescript
const MAX_NEWS_PER_TOPIC = 4  // Change to 2 or 3
```

This reduces API costs.

---

## ✅ Success Checklist

After completing setup:

- [ ] `ANTHROPIC_API_KEY` secret added to GitHub
- [ ] Workflow runs successfully (manual test)
- [ ] New commit appears with updated news-data.json
- [ ] Vercel deploys automatically after commit
- [ ] News visible on your website
- [ ] Scheduled time confirmed (7:00 AM IST)
- [ ] Email notifications configured

---

## 🎉 You're All Set!

Your news app will now automatically update daily at 7:00 AM IST using Claude Haiku.

**Cost Estimate**: ~$0.20-0.50/month for API calls (90 requests with Haiku)

**Next Steps**:
1. Check tomorrow morning at 7:00 AM IST
2. Verify new news appears
3. Monitor workflow runs in Actions tab

---

## 📞 Need Help?

- **GitHub Actions Docs**: [docs.github.com/actions](https://docs.github.com/en/actions)
- **Anthropic API Docs**: [docs.anthropic.com](https://docs.anthropic.com/)
- **Project Issues**: [GitHub Issues](https://github.com/DhivaharDev/OnePageNewApp/issues)

---

**Built with ❤️ using GitHub Actions and Claude Haiku**
