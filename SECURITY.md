# 🔐 Security Documentation

## Overview

This document outlines the security measures implemented in the One Page News App, specifically designed for **Hobby/Free tier** deployments.

## 🛡️ DDoS Protection

### Multi-Layer Protection Strategy

Our DDoS protection uses a defense-in-depth approach with multiple layers:

```
Layer 1: Vercel Edge Network (Automatic)
   ↓
Layer 2: Middleware Rate Limiting (Custom)
   ↓
Layer 3: Bot Detection & Blocking
   ↓
Layer 4: Security Headers & CSP
   ↓
Application
```

### Layer 1: Vercel Edge Network

**Automatic Protection** (included in Hobby tier):
- Global CDN with DDoS mitigation
- Automatic SSL/TLS encryption
- Edge caching reduces origin hits
- Geographic distribution

### Layer 2: Rate Limiting

**Implementation**: `middleware.ts`

**Configuration**:
```typescript
{
  windowMs: 60000,        // 1 minute sliding window
  maxRequests: 30,        // 30 requests per minute per IP
  blockDuration: 300000,  // 5 minute block
  cleanupInterval: 300000 // Cleanup every 5 minutes
}
```

**How it works**:
1. Tracks requests per IP address
2. Allows 30 requests per minute
3. Blocks IP for 5 minutes if exceeded
4. Returns HTTP 429 with retry headers

**Response Headers**:
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2026-01-18T10:35:00Z
Retry-After: 300
```

**Testing Rate Limits**:
```bash
# Bash script to test rate limiting
for i in {1..35}; do
  curl -I https://your-app.vercel.app
  echo "Request $i"
done
```

### Layer 3: Bot Detection

**Blocked User Agents**:
- Generic bots: `bot`, `crawl`, `spider`
- Scrapers: `curl`, `wget`, `python-requests`
- Automated tools: `selenium`, `puppeteer`
- HTTP clients: `go-http-client`, `axios`

**Implementation**:
```typescript
const BLOCKED_USER_AGENTS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /scrape/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
]
```

**Legitimate Bots Allowed**:
- Googlebot (SEO)
- Bingbot (SEO)
- Social media crawlers (Open Graph)

### Layer 4: Security Headers

**Content Security Policy (CSP)**:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  connect-src 'self';
  frame-ancestors 'none';
```

**Additional Headers**:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 🚨 Attack Scenarios & Mitigations

### Scenario 1: High-Volume HTTP Flood

**Attack**: Attacker sends 1000 requests/second

**Mitigation**:
1. Vercel Edge blocks most at CDN level
2. Middleware rate limit catches rest
3. IP blocked after 30 requests in 60 seconds
4. Stays blocked for 5 minutes

**Result**: ✅ Site stays online

### Scenario 2: Distributed Bot Attack

**Attack**: Botnet with 100 IPs, 10 req/sec each

**Mitigation**:
1. Each IP limited to 30 req/min
2. Bots identified by User-Agent
3. Blocked IPs receive 403/429
4. Static content served from CDN

**Result**: ✅ Minimal impact on real users

### Scenario 3: Slowloris Attack

**Attack**: Slow POST requests to exhaust connections

**Mitigation**:
1. Vercel handles connection management
2. Static site = no POST endpoints
3. Edge functions have built-in timeout
4. No user-generated content

**Result**: ✅ Not applicable to static SPA

### Scenario 4: API Key Theft

**Attack**: Exposed API key used maliciously

**Mitigation**:
1. API key only in GitHub Secrets & Vercel env
2. Never in frontend code
3. Only used in GitHub Actions (server-side)
4. Rate limit on Anthropic API
5. Can revoke and regenerate instantly

**Result**: ✅ Limited blast radius

## 🔍 Monitoring & Alerts

### Check if Under Attack

**Indicators**:
```bash
# High error rate in Vercel logs
vercel logs --since 1h | grep "429"

# Unusual traffic patterns
# Check Vercel Analytics dashboard
```

**Response Headers to Monitor**:
```javascript
// In browser DevTools Network tab
X-RateLimit-Remaining < 5  // Warning
X-RateLimit-Remaining = 0  // Blocked
```

### Logging

**Middleware logs** (check Vercel logs):
```
[DDoS Protection] IP blocked: 1.2.3.4 - Exceeded rate limit
[DDoS Protection] Blocked user agent: curl/7.68.0
```

## 🛠️ Configuration Guide

### Adjust Rate Limits

**For personal blog** (low traffic):
```typescript
// middleware.ts
const RATE_LIMIT_CONFIG = {
  windowMs: 60000,
  maxRequests: 15,  // Stricter
  blockDuration: 600000, // 10 min block
}
```

**For public demo** (high traffic):
```typescript
const RATE_LIMIT_CONFIG = {
  windowMs: 60000,
  maxRequests: 60,  // More lenient
  blockDuration: 180000, // 3 min block
}
```

### Whitelist Specific IPs

```typescript
// middleware.ts
const WHITELISTED_IPS = [
  '192.168.1.1',  // Your office
  '10.0.0.1',     // Your home
]

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || 'unknown'

  if (WHITELISTED_IPS.includes(ip)) {
    return 'whitelisted'  // No limit
  }

  return `ratelimit:${ip}`
}
```

### Custom Bot Blocking

```typescript
// middleware.ts
const BLOCKED_USER_AGENTS = [
  ...BLOCKED_USER_AGENTS,
  /custombot/i,
  /badactor/i,
]
```

## 💰 Budget Protection

### Anthropic API Rate Limiting

**Monthly Budget**: $50

```typescript
// scripts/fetch-news.ts
const MONTHLY_BUDGET = 50  // USD
const COST_PER_REQUEST = 0.015

async function checkBudget() {
  const spent = await getMonthlySpending()

  if (spent >= MONTHLY_BUDGET) {
    console.error('❌ Monthly budget exceeded')
    process.exit(1)
  }
}
```

### Vercel Bandwidth Limits

**Hobby Tier**: 100 GB/month

**Optimizations**:
1. Aggressive caching (`Cache-Control: max-age=3600`)
2. Compress responses (Vercel automatic)
3. CDN edge serving
4. Static generation

**Monitor Usage**:
- Vercel Dashboard → Usage
- Set alerts at 50%, 80%, 90%

## 🔐 Secrets Management

### Environment Variables

**Development** (`.env.local`):
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

**Production** (Vercel):
- Never commit `.env.local`
- Use Vercel Dashboard → Environment Variables
- Encrypt in transit
- Rotate keys every 90 days

**GitHub Actions** (Secrets):
- Repository Settings → Secrets
- Only accessible to workflows
- Masked in logs

### API Key Rotation

**Steps**:
1. Generate new key in Anthropic Console
2. Update in Vercel (Environment Variables)
3. Update in GitHub (Secrets)
4. Test deployment
5. Revoke old key

## 🚫 What's NOT Protected

### Limitations of Free Tier

1. **No WAF** (Web Application Firewall)
   - Upgrade to Vercel Pro for firewall rules

2. **In-Memory Rate Limiting**
   - Resets on each deployment
   - Not shared across edge regions
   - Consider Upstash Redis for persistence

3. **No IP Geoblocking**
   - Can't block specific countries
   - Vercel Pro/Enterprise feature

4. **No Advanced DDoS**
   - No Layer 7 attack mitigation
   - Basic flood protection only

### When to Upgrade

**Upgrade to Vercel Pro if**:
- Traffic > 100,000 requests/month
- Need advanced firewall
- Require 99.99% uptime SLA
- Custom security rules needed

## 📊 Security Checklist

- [x] Rate limiting implemented
- [x] Bot detection active
- [x] Security headers configured
- [x] CSP policy enforced
- [x] HTTPS only (Vercel automatic)
- [x] API keys in secrets
- [x] No sensitive data in logs
- [x] Input validation (static site)
- [x] XSS prevention
- [x] CSRF not needed (no forms)
- [x] Dependencies up to date

## 🆘 Incident Response

### If Under Active Attack

1. **Immediate**:
   ```bash
   # Pause GitHub Actions (stop auto-updates)
   # Go to Settings → Actions → Disable
   ```

2. **Analyze**:
   ```bash
   # Check Vercel logs
   vercel logs --since 1h

   # Look for patterns
   grep "429" | cut -d' ' -f1 | sort | uniq -c
   ```

3. **Mitigate**:
   - Tighten rate limits in `middleware.ts`
   - Deploy update: `vercel --prod`
   - Enable Vercel DDoS protection (Pro)

4. **Recovery**:
   - Clear rate limit cache (redeploy)
   - Re-enable GitHub Actions
   - Monitor for 24 hours

### Reporting Security Issues

**DO NOT** open public GitHub issues for security vulnerabilities.

**Instead**:
- Email: security@example.com
- Include: Description, impact, reproduction steps
- Response time: 48 hours

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security](https://vercel.com/docs/security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Rate Limiting Patterns](https://stripe.com/blog/rate-limiters)

---

**Last Updated**: 2026-01-18
**Version**: 1.0
