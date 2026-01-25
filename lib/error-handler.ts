/**
 * 统一错误处理
 * 防止敏感信息泄露
 */

export interface ApiError {
  message: string
  code?: string
  statusCode: number
  details?: any
}

/**
 * 处理API错误
 */
export function handleApiError(error: any): ApiError {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // 记录错误到控制台 (生产环境应该发送到日志服务)
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  })

  // 已知错误类型
  if (error.name === 'ValidationError') {
    return {
      message: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: isDevelopment ? error.details : undefined,
    }
  }

  if (error.name === 'UnauthorizedError') {
    return {
      message: 'Authentication required',
      code: 'UNAUTHORIZED',
      statusCode: 401,
    }
  }

  if (error.name === 'ForbiddenError') {
    return {
      message: 'Access denied',
      code: 'FORBIDDEN',
      statusCode: 403,
    }
  }

  if (error.name === 'NotFoundError') {
    return {
      message: 'Resource not found',
      code: 'NOT_FOUND',
      statusCode: 404,
    }
  }

  if (error.name === 'RateLimitError') {
    return {
      message: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
    }
  }

  // 默认错误
  return {
    message: isDevelopment
      ? error.message || 'An error occurred'
      : 'An unexpected error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    details: isDevelopment ? { stack: error.stack } : undefined,
  }
}

/**
 * 创建错误响应
 */
export function createErrorResponse(error: any, statusCode?: number) {
  const apiError = handleApiError(error)
  
  return Response.json(
    {
      error: apiError.message,
      code: apiError.code,
      ...(apiError.details && { details: apiError.details }),
    },
    { status: statusCode || apiError.statusCode }
  )
}

/**
 * 自定义错误类
 */
export class ValidationError extends Error {
  details?: any
  
  constructor(message: string, details?: any) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Access denied') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * 安全日志记录 (不记录敏感信息)
 */
export function secureLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  const sanitizedData = data ? sanitizeLogData(data) : undefined
  
  const logEntry = {
    level,
    message,
    data: sanitizedData,
    timestamp: new Date().toISOString(),
  }

  if (level === 'error') {
    console.error(JSON.stringify(logEntry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logEntry))
  } else {
    console.log(JSON.stringify(logEntry))
  }
}

/**
 * 清理日志数据 (移除敏感信息)
 */
function sanitizeLogData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'api_key',
    'secret',
    'authorization',
    'cookie',
    'session',
  ]

  const sanitized = { ...data }

  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase()
    
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogData(sanitized[key])
    }
  }

  return sanitized
}
