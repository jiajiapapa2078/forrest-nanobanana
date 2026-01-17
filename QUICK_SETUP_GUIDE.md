# 快速配置指南

## 📋 需要配置的环境变量清单

| 变量名 | 获取位置 | 用途 | 必需 |
|--------|----------|------|------|
| `OPENROUTER_API_KEY` | [OpenRouter Dashboard](https://openrouter.ai) | AI 图片生成 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API | 客户端访问 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API | 服务器端数据库操作 | ✅ |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Cloud Console | Google 登录 | ✅ |
| `CREEM_API_KEY` | Creem > Developers | 创建支付会话 | ✅ |
| `CREEM_WEBHOOK_SECRET` | Creem > Webhooks | 验证 webhook | ✅ |
| `NEXT_PUBLIC_APP_URL` | 你的域名 | 回调 URL | ✅ |

## 🚀 快速开始

### 1. 获取 Supabase 密钥（3个）

访问：**Supabase Dashboard > Settings > API**

```
📍 位置：Settings（齿轮图标）> API

你会看到：
┌─────────────────────────────────────────┐
│ Project URL                             │
│ https://xxx.supabase.co          [复制] │
│                                         │
│ anon public                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI...  [复制] │
│                                         │
│ service_role ⚠️ 保密！                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI...  [复制] │
└─────────────────────────────────────────┘
```

复制到 `.env.local`：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...（anon public）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...（service_role）
```

### 2. 获取 Creem 密钥（2个）

#### 2.1 API Key
访问：**Creem Dashboard > Developers**

```env
CREEM_API_KEY=creem_test_xxxxx
```

#### 2.2 Webhook Secret
访问：**Creem Dashboard > Webhooks**
1. 创建新 webhook
2. URL: `https://your-domain.com/api/webhooks/creem`
3. 创建后会显示 Webhook Secret

```env
CREEM_WEBHOOK_SECRET=whsec_xxxxx
```

### 3. 获取 Google Client ID

访问：**Google Cloud Console > APIs & Services > Credentials**

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 4. 设置应用 URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 开发环境
# NEXT_PUBLIC_APP_URL=https://your-domain.com  # 生产环境
```

## 📝 完整的 .env.local 示例

```env
# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# Creem Payment
CREEM_API_KEY=creem_test_xxxxx
CREEM_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ 验证配置

配置完成后：

1. **重启开发服务器**
   ```bash
   npm run dev
   ```

2. **检查控制台**
   - 不应该有 "not configured" 错误
   - 不应该有 "Invalid URL" 错误

3. **测试功能**
   - ✅ Google 登录按钮显示
   - ✅ Pricing 页面显示
   - ✅ 可以点击订阅按钮

## 🔍 故障排查

### 问题：找不到 service_role key
**解决**：在 Supabase Dashboard 中，确保你在 Settings > API 页面，向下滚动查找 "service_role" 标签。

### 问题：Creem webhook secret 在哪里？
**解决**：必须先创建 webhook endpoint，创建后才会显示 secret。

### 问题：配置后还是报错
**解决**：
1. 确保重启了开发服务器
2. 检查 `.env.local` 文件中没有多余的空格
3. 确保所有密钥都正确复制（没有截断）

## 📚 详细文档

- Supabase 配置: `SUPABASE_SERVICE_ROLE_KEY_GUIDE.md`
- Creem 配置: `CREEM_SETUP.md`
- Google 登录: `SUPABASE_SETUP.md`

## 🆘 需要帮助？

如果遇到问题：
1. 检查所有密钥是否正确复制
2. 确保重启了服务器
3. 查看浏览器控制台和服务器日志
4. 参考详细文档
