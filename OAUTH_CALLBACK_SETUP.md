# OAuth 回调URL配置详解

## 重要概念

Google OAuth登录流程中涉及**两个不同的回调URL**:
1. **Google的回调** - 用户授权后Google重定向到你的网站
2. **Supabase的回调** - Supabase内部使用的回调URL

## 假设你的域名是: `nanobanana.com`

### 1. Google Cloud Console 配置

登录 [Google Cloud Console](https://console.cloud.google.com/)

#### 位置: APIs & Services > Credentials > OAuth 2.0 Client ID

#### Authorized JavaScript origins (授权的JavaScript来源):
```
http://localhost:3000
https://nanobanana.com
https://nanobanana.vercel.app
```

#### Authorized redirect URIs (授权的重定向URI):
```
http://localhost:3000/auth/callback
https://nanobanana.com/auth/callback
https://nanobanana.vercel.app/auth/callback
```

**注意**: 这些是**你的网站**的URL,不是Supabase的URL!

---

### 2. Supabase Dashboard 配置

登录 [Supabase Dashboard](https://supabase.com/dashboard)

#### 位置: Authentication > Providers > Google

**启用Google Provider** 并填入:
- **Client ID**: 从Google Cloud Console获取
- **Client Secret**: 从Google Cloud Console获取

#### 位置: Authentication > URL Configuration

**Site URL** (主站点URL,只填一个):
```
https://nanobanana.com
```

**Redirect URLs** (允许的重定向URL,可以填多个):
```
https://nanobanana.com/**
https://nanobanana.vercel.app/**
http://localhost:3000/**
https://xjaylzxqmpeqyzqchsoe.supabase.co/auth/v1/callback
```

**注意**: 
- 使用 `/**` 通配符允许该域名下的所有路径
- 必须包含Supabase自己的回调URL (最后一行)

---

## 完整的登录流程

```
1. 用户点击 "Sign In with Google"
   ↓
2. 浏览器跳转到 Google 登录页面
   ↓
3. 用户在Google页面授权
   ↓
4. Google 重定向到: https://nanobanana.com/auth/callback?code=xxx
   ↓
5. 你的 /auth/callback 路由接收请求
   ↓
6. 该路由调用 Supabase API 交换 code 获取 session
   ↓
7. Supabase 验证并创建用户会话
   ↓
8. 用户登录成功,重定向到首页
```

---

## 实际配置示例

### 如果你的生产环境是 Vercel:

**Google Cloud Console:**
```
Authorized JavaScript origins:
- http://localhost:3000
- https://forrest-nanobanana.vercel.app
- https://nanobanana.com (如果有自定义域名)

Authorized redirect URIs:
- http://localhost:3000/auth/callback
- https://forrest-nanobanana.vercel.app/auth/callback
- https://nanobanana.com/auth/callback (如果有自定义域名)
```

**Supabase Dashboard:**
```
Site URL:
- https://forrest-nanobanana.vercel.app
  (或 https://nanobanana.com 如果有自定义域名)

Redirect URLs:
- https://forrest-nanobanana.vercel.app/**
- https://nanobanana.com/** (如果有自定义域名)
- http://localhost:3000/**
- https://xjaylzxqmpeqyzqchsoe.supabase.co/auth/v1/callback
```

---

## 常见错误

### 错误 1: redirect_uri_mismatch
**原因**: Google的回调URL配置不正确
**解决**: 在Google Cloud Console中添加你的域名 + `/auth/callback`

### 错误 2: Invalid Redirect URL
**原因**: Supabase的Redirect URLs配置不正确
**解决**: 在Supabase Dashboard中添加你的域名 + `/**`

### 错误 3: 本地可以登录,生产环境不行
**原因**: 只配置了localhost,没有配置生产域名
**解决**: 在Google和Supabase中都添加生产环境URL

---

## 快速检查清单

- [ ] Google Cloud Console中添加了生产域名到 Authorized JavaScript origins
- [ ] Google Cloud Console中添加了 `https://你的域名.com/auth/callback` 到 Authorized redirect URIs
- [ ] Supabase中启用了Google Provider并填入了Client ID和Secret
- [ ] Supabase的Site URL设置为生产域名
- [ ] Supabase的Redirect URLs包含了 `https://你的域名.com/**`
- [ ] Supabase的Redirect URLs包含了Supabase自己的回调URL
- [ ] 部署平台配置了所有环境变量
- [ ] 修改配置后重新部署了应用

---

## 需要帮助?

如果按照以上步骤配置后仍然无法登录:
1. 打开浏览器开发者工具 (F12)
2. 切换到Console标签
3. 点击"Sign In with Google"
4. 查看错误信息并提供给我
