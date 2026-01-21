# forrestnanobanana.online 环境配置指南

## 🚨 当前问题
网站显示 "Authentication is not configured" 错误,这是因为环境变量未在生产环境配置。

## ✅ 解决方案

### 第1步: 配置部署平台环境变量

你的网站域名是: **forrestnanobanana.online**

#### 如果使用 Vercel:

1. 访问 https://vercel.com/dashboard
2. 选择你的项目 `forrest-nanobanana`
3. 进入 **Settings** > **Environment Variables**
4. 添加以下变量:

```bash
# Supabase 配置 (必需)
NEXT_PUBLIC_SUPABASE_URL=https://xjaylzxqmpeqyzqchsoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYXlsenhxbXBlcXl6cWNoc29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODM0MjAsImV4cCI6MjA4Mzk1OTQyMH0.N_RdEF0A5zPTz9xYPXi4hM65qlOt91LL4SNdypc23Jk

# Google OAuth 配置 (必需)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=238814919238-l3jvlh87jcgi5g2ah9ro8q24m9jluvcf.apps.googleusercontent.com

# 应用 URL (必需)
NEXT_PUBLIC_APP_URL=https://forrestnanobanana.online

# Supabase Service Role Key (用于后端操作)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYXlsenhxbXBlcXl6cWNoc29lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM4MzQyMCwiZXhwIjoyMDgzOTU5NDIwfQ.TTxf7JhP6I5yQcyTf1bTdR0b_S7buLaq7coiR502BFs

# OpenRouter API Key (用于图片生成)
OPENROUTER_API_KEY=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

# Creem 支付配置 (可选)
CREEM_API_KEY=creem_test_4tqLUr4vNkCGcWWOEKcIdV
CREEM_WEBHOOK_SECRET=whsec_6L3lIub67Tzn9d1O0sDBhp
```

5. 确保所有变量应用到 **Production**, **Preview**, 和 **Development** 环境
6. 点击 **Save**

#### 如果使用 Netlify:

1. 访问 https://app.netlify.com/
2. 选择你的站点
3. 进入 **Site settings** > **Environment variables**
4. 点击 **Add a variable**
5. 添加上面列出的所有变量
6. 点击 **Save**

---

### 第2步: 配置 Google Cloud Console

1. 访问 https://console.cloud.google.com/
2. 选择你的项目
3. 进入 **APIs & Services** > **Credentials**
4. 点击你的 OAuth 2.0 Client ID

#### 添加授权域名:

**Authorized JavaScript origins**:
```
https://forrestnanobanana.online
http://localhost:3000
```

**Authorized redirect URIs**:
```
https://forrestnanobanana.online/auth/callback
http://localhost:3000/auth/callback
```

5. 点击 **Save**

---

### 第3步: 配置 Supabase Dashboard

1. 访问 https://supabase.com/dashboard
2. 选择你的项目 (xjaylzxqmpeqyzqchsoe)
3. 进入 **Authentication** > **Providers** > **Google**

#### 确保 Google Provider 已启用:
- ✅ Enabled 开关打开
- ✅ Client ID: `238814919238-l3jvlh87jcgi5g2ah9ro8q24m9jluvcf.apps.googleusercontent.com`
- ✅ Client Secret: (从 Google Cloud Console 获取)

4. 进入 **Authentication** > **URL Configuration**

**Site URL**:
```
https://forrestnanobanana.online
```

**Redirect URLs** (每行一个):
```
https://forrestnanobanana.online/**
http://localhost:3000/**
https://xjaylzxqmpeqyzqchsoe.supabase.co/auth/v1/callback
```

5. 点击 **Save**

---

### 第4步: 重新部署

⚠️ **重要**: 添加环境变量后必须重新部署!

#### Vercel:
1. 进入 **Deployments** 标签
2. 找到最新的部署
3. 点击右侧的 `...` 菜单
4. 选择 **Redeploy**
5. 等待部署完成

#### Netlify:
1. 进入 **Deploys** 标签
2. 点击 **Trigger deploy** 按钮
3. 选择 **Deploy site**
4. 等待部署完成

---

## 🧪 验证配置

### 1. 访问调试页面
部署完成后,访问: https://forrestnanobanana.online/debug

这个页面会显示:
- ✅ 环境变量是否正确配置
- ✅ Supabase 连接状态
- ✅ 当前 URL

### 2. 测试 Google 登录
1. 访问 https://forrestnanobanana.online
2. 点击 "Sign In with Google" 按钮
3. 应该会跳转到 Google 登录页面
4. 授权后应该能成功登录

---

## 📋 检查清单

完成以下所有步骤:

- [ ] 在部署平台添加了所有环境变量
- [ ] 环境变量应用到 Production 环境
- [ ] Google Cloud Console 添加了 forrestnanobanana.online 域名
- [ ] Google Cloud Console 添加了回调 URL
- [ ] Supabase 启用了 Google Provider
- [ ] Supabase 配置了 Site URL
- [ ] Supabase 配置了 Redirect URLs
- [ ] 重新部署了应用
- [ ] 访问 /debug 页面验证配置
- [ ] 测试 Google 登录功能

---

## ❓ 常见问题

### Q: 添加环境变量后还是显示错误?
A: 确保重新部署了应用。环境变量只在构建时加载。

### Q: 如何获取 Google Client Secret?
A: 在 Google Cloud Console > Credentials > OAuth 2.0 Client ID 页面可以看到或重新生成。

### Q: 为什么本地可以登录但线上不行?
A: 需要在 Google Cloud Console 和 Supabase 中添加生产域名。

### Q: 如何查看详细错误?
A: 按 F12 打开浏览器开发者工具,查看 Console 标签中的错误信息。

---

## 📞 需要帮助?

如果按照以上步骤操作后仍有问题:

1. 访问 https://forrestnanobanana.online/debug 查看配置状态
2. 按 F12 打开浏览器开发者工具,查看 Console 中的错误
3. 截图错误信息并提供给我

---

## 🎯 快速修复(最可能的问题)

如果你看到 "Authentication is not configured" 错误:

**原因**: 环境变量未在部署平台配置

**解决**: 
1. 在 Vercel/Netlify 添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. 重新部署
3. 刷新页面

这个问题通常5分钟内就能解决!
