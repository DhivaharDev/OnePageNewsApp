import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limiting store (resets on deployment)
// For production with multiple instances, consider Upstash Redis
interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
  blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 30, // Max 30 requests per minute per IP
  blockDuration: 300000, // Block for 5 minutes if exceeded
  cleanupInterval: 300000, // Cleanup old entries every 5 minutes
}

// Known bad user agents (bots, scrapers, attackers)
const BLOCKED_USER_AGENTS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /scrape/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
  /go-http-client/i,
  /axios/i,
]

// Cleanup old entries periodically
let lastCleanup = Date.now()
function cleanupRateLimitStore() {
  const now = Date.now()
  if (now - lastCleanup > RATE_LIMIT_CONFIG.cleanupInterval) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime && (!entry.blocked || now > (entry.blockedUntil || 0))) {
        rateLimitStore.delete(key)
      }
    }
    lastCleanup = now
  }
}

function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false
  return BLOCKED_USER_AGENTS.some((pattern) => pattern.test(userAgent))
}

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as identifier
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  return `ratelimit:${ip}`
}

function checkRateLimit(request: NextRequest): {
  allowed: boolean
  remaining: number
  resetTime: number
  blocked: boolean
} {
  const key = getRateLimitKey(request)
  const now = Date.now()

  cleanupRateLimitStore()

  let entry = rateLimitStore.get(key)

  // Check if IP is currently blocked
  if (entry?.blocked && entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blocked: true,
    }
  }

  // Reset or create new entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
      blocked: false,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment request count
  entry.count++

  // Check if limit exceeded
  if (entry.count > RATE_LIMIT_CONFIG.maxRequests) {
    entry.blocked = true
    entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDuration

    console.warn(`[DDoS Protection] IP blocked: ${request.ip} - Exceeded rate limit`)

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blocked: true,
    }
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - entry.count,
    resetTime: entry.resetTime,
    blocked: false,
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('/manifest.json')
  ) {
    return NextResponse.next()
  }

  // 1. User-Agent Check (Block known bad bots)
  const userAgent = request.headers.get('user-agent')
  if (isBlockedUserAgent(userAgent)) {
    console.warn(`[DDoS Protection] Blocked user agent: ${userAgent}`)
    return new NextResponse('Forbidden', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Blocked-Reason': 'User-Agent not allowed',
      }
    })
  }

  // 2. Rate Limiting
  const rateLimitResult = checkRateLimit(request)

  if (!rateLimitResult.allowed) {
    const resetDate = new Date(rateLimitResult.resetTime).toISOString()

    return new NextResponse(
      rateLimitResult.blocked
        ? 'Too Many Requests - You have been temporarily blocked'
        : 'Too Many Requests',
      {
        status: 429,
        headers: {
          'Content-Type': 'text/plain',
          'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetDate,
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  // 3. Add rate limit headers to response
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())

  return response
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
