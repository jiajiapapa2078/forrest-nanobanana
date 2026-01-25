# Nano Banana 网站安全防护指南

## 📅 创建日期: 2026年1月25日

---

## 🔒 当前安全状况评估

### ✅ 已实施的安全措施

1. **用户认证** ✅
   - Supabase JWT认证
   - Google OAuth 2.0
   - 服务端token验证

2. **API保护** ✅
   - 用户身份验证 (generate API)
   - 登录状态检查 (checkout API)
   - Webhook签名验证 (Creem)

3. **环境变量保护** ✅
   - API keys存储在`.env.local`
   - 不提交到Git仓库
   - 使用`.gitignore`保护

4. **HTTPS** ✅
   - Vercel自动提供SSL证书
   - 强制HTTPS连接

---

## ⚠️ 需要改进的安全问题

### 1. 缺少速率限制 (Rate Limiting) 🔴 高优先级
**风险**: DDoS攻击、API滥用、资源耗尽

### 2. 缺少输入验证和清理 🔴 高优先级
**风险**: XSS攻击、SQL注入、恶意代码注入

### 3. 缺少CORS配置 🟡 中优先级
**风险**: 跨域攻击、未授权访问

### 4. 缺少CSP (Content Security Policy) 🟡 中优先级
**风险**: XSS攻击、代码注入

### 5. 错误信息泄露 🟡 中优先级
**风险**: 敏感信息泄露、系统架构暴露

### 6. 缺少日志和监控 🟢 低优先级
**风险**: 无法追踪攻击、难以调试

---

## 🛡️ 安全改进方案

### 方案1: 实施速率限制 (Rate Limiting)

#### 为什么需要?
- 防止暴力破解
- 防止DDoS攻击
- 防止API滥用
- 保护OpenRouter API配额

#### 实施方案:

**选项A: 使用Vercel Edge Config + KV (推荐)**
```bash
# 安装依赖
npm install @vercel/edge-config @vercel/kv
```

**选项B: 使用upstash/ratelimit (简单易用)**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**选项C: 使用next-rate-limit (本地开发友好)**
```bash
npm install next-rate-limit lru-cache
```

#### 推荐配置:
- **图片生成API**: 10次/分钟/用户
- **登录API**: 5次/分钟/IP
- **Checkout API**: 3次/分钟/用户
- **Webhook**: 100次/分钟/IP

---

### 方案2: 输入验证和清理

#### 需要验证的输入:

1. **图片上传**:
   - 文件类型验证 (只允许图片)
   - 文件大小限制 (最大10MB)
   - 图片尺寸限制
   - MIME类型检查

2. **提示词 (Prompt)**:
   - 长度限制 (最大1000字符)
   - 特殊字符过滤
   - 恶意代码检测
   - SQL注入防护

3. **用户输入**:
   - Email格式验证
   - URL格式验证
   - HTML标签转义

#### 实施工具:
```bash
# 安装验证库
npm install zod validator dompurify
```

---

### 方案3: CORS配置

#### 当前问题:
- 没有明确的CORS策略
- 可能允许任意域名访问

#### 推荐配置:
```typescript
// 只允许自己的域名
const allowedOrigins = [
  'https://forrestnanobanana.online',
  'http://localhost:3000', // 开发环境
]
```

---

### 方案4: Content Security Policy (CSP)

#### 作用:
- 防止XSS攻击
- 防止代码注入
- 控制资源加载

#### 推荐策略:
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  connect-src 'self' https://openrouter.ai https://*.supabase.co;
  frame-src 'self' https://accounts.google.com;
`
```

---

### 方案5: 错误处理改进

#### 当前问题:
- 错误信息可能泄露敏感信息
- 堆栈跟踪暴露给用户

#### 改进方案:
```typescript
// 生产环境: 通用错误消息
// 开发环境: 详细错误信息
const errorMessage = process.env.NODE_ENV === 'production'
  ? 'An error occurred. Please try again.'
  : error.message
```

---

### 方案6: 日志和监控

#### 推荐工具:
- **Sentry**: 错误追踪
- **LogRocket**: 用户会话录制
- **Vercel Analytics**: 性能监控
- **Supabase Logs**: 数据库日志

---

## 🚀 实施优先级

### 第一阶段 (立即实施) - 1-2天

1. **速率限制** 🔴
   - 实施API速率限制
   - 防止滥用和攻击

2. **输入验证** 🔴
   - 图片上传验证
   - 提示词长度限制
   - 文件大小限制

3. **错误处理** 🔴
   - 隐藏敏感错误信息
   - 统一错误响应格式

### 第二阶段 (短期优化) - 3-5天

4. **CORS配置** 🟡
   - 限制允许的域名
   - 配置预检请求

5. **CSP头部** 🟡
   - 添加Content-Security-Policy
   - 测试和调整策略

6. **Webhook安全** 🟡
   - 验证签名 (已实施)
   - 添加重放攻击防护

### 第三阶段 (长期改进) - 1-2周

7. **日志系统** 🟢
   - 集成Sentry
   - 设置告警规则

8. **安全审计** 🟢
   - 定期安全扫描
   - 依赖包更新

9. **备份策略** 🟢
   - 数据库备份
   - 灾难恢复计划

---

## 📋 具体实施代码

### 1. 速率限制实施 (使用next-rate-limit)

```typescript
// lib/rate-limit.ts
import rateLimit from 'next-rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1分钟
  uniqueTokenPerInterval: 500, // 最多500个不同的token
})

export async function checkRateLimit(
  request: Request,
  limit: number = 10
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    await limiter.check(limit, ip)
    return { success: true }
  } catch {
    return { 
      success: false, 
      error: 'Rate limit exceeded. Please try again later.' 
    }
  }
}
```

### 2. 输入验证 (使用Zod)

```typescript
// lib/validation.ts
import { z } from 'zod'

export const imageUploadSchema = z.object({
  image: z.string()
    .refine((val) => val.startsWith('data:image/'), {
      message: 'Invalid image format'
    })
    .refine((val) => {
      // 检查base64大小 (约10MB)
      const base64Length = val.split(',')[1]?.length || 0
      const sizeInBytes = (base64Length * 3) / 4
      return sizeInBytes <= 10 * 1024 * 1024
    }, {
      message: 'Image size must be less than 10MB'
    }),
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt must be less than 1000 characters')
    .refine((val) => !/<script|javascript:/i.test(val), {
      message: 'Invalid characters in prompt'
    })
})
```

### 3. CORS配置

```typescript
// lib/cors.ts
export function corsHeaders(origin: string | null) {
  const allowedOrigins = [
    'https://forrestnanobanana.online',
    'http://localhost:3000',
  ]
  
  const isAllowed = origin && allowedOrigins.includes(origin)
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}
```

### 4. CSP头部配置

```typescript
// middleware.ts 或 next.config.mjs
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self';
      connect-src 'self' https://openrouter.ai https://*.supabase.co;
      frame-src 'self' https://accounts.google.com;
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]
```

### 5. 改进的错误处理

```typescript
// lib/error-handler.ts
export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return {
    error: isDevelopment 
      ? error.message 
      : 'An error occurred. Please try again.',
    ...(isDevelopment && { stack: error.stack })
  }
}
```

---

## 🔐 额外安全建议

### 1. 环境变量管理
- ✅ 使用`.env.local`存储敏感信息
- ✅ 不提交到Git
- ⚠️ 定期轮换API keys
- ⚠️ 使用不同的keys用于开发/生产

### 2. 依赖包安全
```bash
# 定期检查漏洞
npm audit

# 自动修复
npm audit fix

# 更新依赖
npm update
```

### 3. Supabase安全
- ✅ 使用Row Level Security (RLS)
- ✅ 限制API访问权限
- ⚠️ 定期审查数据库权限
- ⚠️ 启用数据库备份

### 4. 图片处理安全
- 验证图片格式
- 限制图片尺寸
- 使用CDN缓存
- 防止图片炸弹攻击

### 5. 用户数据保护
- 加密敏感数据
- 遵守GDPR/隐私法规
- 提供数据导出功能
- 实施数据删除策略

---

## 📊 安全检查清单

### 部署前检查:
- [ ] 所有API都有认证保护
- [ ] 实施了速率限制
- [ ] 输入验证已完成
- [ ] CORS配置正确
- [ ] CSP头部已添加
- [ ] 错误信息不泄露敏感数据
- [ ] HTTPS强制启用
- [ ] 环境变量已配置
- [ ] 依赖包无已知漏洞
- [ ] 日志系统已设置

### 定期检查 (每月):
- [ ] 审查访问日志
- [ ] 检查异常流量
- [ ] 更新依赖包
- [ ] 轮换API keys
- [ ] 备份数据库
- [ ] 测试灾难恢复

---

## 🚨 应急响应计划

### 如果发现攻击:

1. **立即行动**:
   - 暂停受影响的服务
   - 更改所有API keys
   - 检查日志找出攻击源

2. **评估损害**:
   - 检查数据是否泄露
   - 评估系统完整性
   - 确定攻击范围

3. **修复和恢复**:
   - 修补安全漏洞
   - 恢复服务
   - 通知受影响用户

4. **事后分析**:
   - 记录事件详情
   - 改进安全措施
   - 更新应急计划

---

## 📚 安全资源

### 学习资源:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Vercel Security](https://vercel.com/docs/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)

### 安全工具:
- [Snyk](https://snyk.io/) - 依赖包扫描
- [Sentry](https://sentry.io/) - 错误追踪
- [Cloudflare](https://www.cloudflare.com/) - DDoS防护
- [OWASP ZAP](https://www.zaproxy.org/) - 安全测试

---

## 💡 最佳实践总结

1. **纵深防御**: 多层安全措施
2. **最小权限**: 只授予必要的权限
3. **定期更新**: 保持依赖包最新
4. **监控告警**: 及时发现异常
5. **安全培训**: 团队安全意识
6. **备份策略**: 定期备份数据
7. **应急计划**: 准备应对攻击
8. **合规审查**: 遵守法律法规

---

## 🎯 下一步行动

### 立即实施 (今天):
1. 阅读本指南
2. 评估当前风险
3. 确定优先级

### 本周完成:
1. 实施速率限制
2. 添加输入验证
3. 改进错误处理

### 本月完成:
1. 配置CORS和CSP
2. 集成日志系统
3. 设置监控告警

---

**最后更新**: 2026年1月25日  
**安全等级**: 🟡 中等 (需要改进)  
**目标等级**: 🟢 高 (实施所有建议后)

需要帮助实施这些安全措施吗? 我可以帮你逐步实现!
