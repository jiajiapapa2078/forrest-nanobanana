# 安全功能实施指南

## 📦 需要安装的依赖

```bash
# 速率限制
npm install lru-cache

# 输入验证
npm install zod

# 类型定义
npm install --save-dev @types/lru-cache
```

## 📁 已创建的安全文件

### 1. `lib/rate-limit.ts` - 速率限制
- 防止API滥用
- 基于IP的请求限制
- 可配置的时间窗口和限制次数

### 2. `lib/validation.ts` - 输入验证
- 图片上传验证 (格式、大小、尺寸)
- 提示词验证 (长度、恶意代码检测)
- HTML/SQL清理函数
- 恶意内容检测

### 3. `lib/security-headers.ts` - 安全头部
- Content Security Policy (CSP)
- CORS配置
- 防止点击劫持
- XSS保护

### 4. `lib/error-handler.ts` - 错误处理
- 统一错误响应格式
- 敏感信息过滤
- 安全日志记录
- 自定义错误类

## 🔧 如何应用到现有API

### 步骤1: 安装依赖

```bash
npm install lru-cache zod --registry=https://registry.npmmirror.com
npm install --save-dev @types/lru-cache --registry=https://registry.npmmirror.com
```

### 步骤2: 更新 `app/api/generate/route.ts`

在文件顶部添加导入:

```typescript
import { checkRateLimit } from '@/lib/rate-limit'
import { imageUploadSchema } from '@/lib/validation'
import { createErrorResponse, UnauthorizedError, RateLimitError, ValidationError } from '@/lib/error-handler'
```

在 POST 函数开始处添加:

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. 速率限制检查
    const rateLimitResult = await checkRateLimit(request, 10) // 10次/分钟
    if (!rateLimitResult.success) {
      throw new RateLimitError(rateLimitResult.error)
    }

    // 2. 用户认证 (已有)
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new UnauthorizedError('Please sign in to use the image editor')
    }

    // 3. 输入验证
    const body = await request.json();
    const validationResult = imageUploadSchema.safeParse(body)
    
    if (!validationResult.success) {
      throw new ValidationError('Invalid input', validationResult.error.errors)
    }

    const { image, prompt } = validationResult.data

    // ... 继续原有逻辑
  } catch (error: any) {
    return createErrorResponse(error)
  }
}
```

### 步骤3: 更新 `middleware.ts` 添加安全头部

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { getSecurityHeaders } from '@/lib/security-headers'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  // 添加安全头部
  const securityHeaders = getSecurityHeaders()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 步骤4: 更新 `next.config.mjs` 添加安全头部

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

## 🧪 测试安全功能

### 测试速率限制:

```bash
# 快速发送多个请求
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/generate \
    -H "Content-Type: application/json" \
    -d '{"image":"data:image/png;base64,test","prompt":"test"}' &
done
```

预期: 前10个请求成功,后5个返回429错误

### 测试输入验证:

```bash
# 测试恶意提示词
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,test","prompt":"<script>alert(1)</script>"}'
```

预期: 返回400错误,提示"Invalid characters detected"

### 测试文件大小限制:

上传一个超过10MB的图片,预期返回400错误

## 📊 监控和日志

### 使用安全日志:

```typescript
import { secureLog } from '@/lib/error-handler'

// 记录信息
secureLog('info', 'User generated image', { userId: user.id })

// 记录警告
secureLog('warn', 'Rate limit approaching', { ip: clientIp, count: 8 })

// 记录错误
secureLog('error', 'API call failed', { error: error.message })
```

### 集成Sentry (可选):

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🎯 安全检查清单

实施后检查:

- [ ] 速率限制已应用到所有API
- [ ] 输入验证已添加
- [ ] 安全头部已配置
- [ ] 错误处理已统一
- [ ] 敏感信息不会泄露
- [ ] 日志记录已实施
- [ ] 本地测试通过
- [ ] 生产环境测试通过

## 🚨 注意事项

1. **速率限制**: 根据实际使用情况调整限制
2. **CSP策略**: 可能需要根据第三方服务调整
3. **错误消息**: 生产环境不要暴露详细错误
4. **日志**: 不要记录密码、token等敏感信息
5. **测试**: 在生产环境部署前充分测试

## 📚 下一步

1. 安装依赖
2. 更新API路由
3. 测试功能
4. 部署到生产环境
5. 监控和调整

需要帮助实施吗? 我可以帮你逐步完成!
