/**
 * 安全头部配置
 * 防止XSS、点击劫持等攻击
 */

/**
 * Content Security Policy
 */
export function getCSPHeader(): string {
  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      'https://accounts.google.com',
      'https://www.googletagmanager.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'blob:', 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://openrouter.ai',
      'https://*.supabase.co',
      'https://www.google-analytics.com',
    ],
    'frame-src': ["'self'", 'https://accounts.google.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  }

  return Object.entries(csp)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

/**
 * 所有安全头部
 */
export function getSecurityHeaders() {
  return {
    // Content Security Policy
    'Content-Security-Policy': getCSPHeader(),
    
    // 防止点击劫持
    'X-Frame-Options': 'DENY',
    
    // 防止MIME类型嗅探
    'X-Content-Type-Options': 'nosniff',
    
    // XSS保护
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer策略
    'Referrer-Policy': 'origin-when-cross-origin',
    
    // 权限策略
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    
    // HSTS (强制HTTPS)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }
}

/**
 * CORS头部
 */
export function getCorsHeaders(origin: string | null) {
  const allowedOrigins = [
    'https://forrestnanobanana.online',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  const isAllowed = origin && allowedOrigins.includes(origin)

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24小时
  }
}

/**
 * API响应头部
 */
export function getApiHeaders(origin: string | null = null) {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    ...getCorsHeaders(origin),
  }
}
