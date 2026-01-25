/**
 * 速率限制工具
 * 防止API滥用和DDoS攻击
 */

import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        return isRateLimited ? reject() : resolve()
      }),
  }
}

/**
 * 获取客户端IP地址
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return 'unknown'
}

/**
 * 检查速率限制
 */
export async function checkRateLimit(
  request: Request,
  limit: number = 10,
  interval: number = 60000 // 1分钟
): Promise<{ success: boolean; error?: string }> {
  const limiter = rateLimit({ interval, uniqueTokenPerInterval: 500 })
  const ip = getClientIp(request)
  
  try {
    await limiter.check(limit, ip)
    return { success: true }
  } catch {
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
    }
  }
}
