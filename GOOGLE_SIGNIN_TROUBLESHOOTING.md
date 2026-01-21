# Google 登录故障排除指南

## 问题现象
点击"Sign In with Google"按钮后没有任何反应,Google登录弹窗不出现。

## 可能的原因和解决方案

### 1. 检查部署平台的环境变量配置

在你的部署平台(Vercel/Netlify等)中,确保配置了以下环境变量:

```
NEXT_PUBLIC_SUPABASE_URL=https://xjaylzxqmpeqyzqchsoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=238814919238-l3jvlh87jcgi5g2ah9ro8q24m9jluvcf.apps.googleusercontent.com
```

**重要**: 这些变量必须以 `NEXT_PUBLIC_` 开头才能在浏览器端使用!

### 2. 检查Google OAuth配置

#### 2.1 在Google Cloud Console中配置授权域名

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择你的项目
3. 进入 **APIs & Services** > **Credentials**
4. 点击你的OAuth 2.0 Client ID
5. 在 **Authorized JavaScript origins** 中添加:
   - `http://localhost:3000` (本地测试)
   - `https://你的域名.com` (生产环境)
   - `https://你的域名.vercel.app` (如果使用Vercel)

6. 在 **Authorized redirect URIs** 中添加:
   - `http://localhost:3000/auth/callback` (本地测试)
   - `https://你的域名.com/auth/callback` (生产环境)
   - `https://你的域名.vercel.app/auth/callback` (如果使用Vercel)

#### 2.2 在Supabase中配置Google OAuth

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** > **Providers**
4. 找到 **Google** 并启用
5. 填入:
   - **Client ID**: 从Google Cloud Console获取
   - **Client Secret**: 从Google Cloud Console获取
6. 在 **Site URL** 中填入你的生产环境URL: `https://你的域名.com`
7. 在 **Redirect URLs** 中添加:
   - `https://你的域名.com/auth/callback`
   - `https://你的域名.vercel.app/auth/callback`

### 3. 检查浏览器控制台错误

1. 打开浏览器开发者工具 (F12)
2. 切换到 **Console** 标签
3. 点击"Sign In with Google"按钮
4. 查看是否有错误信息

常见错误:
- `Supabase or Google OAuth not configured` - 环境变量未配置
- `Invalid origin` - Google OAuth授权域名未配置
- `redirect_uri_mismatch` - 回调URL不匹配

### 4. 检查网络请求

1. 打开浏览器开发者工具 (F12)
2. 切换到 **Network** 标签
3. 点击"Sign In with Google"按钮
4. 查看是否有失败的请求

### 5. 验证环境变量是否正确加载

在浏览器控制台中运行:
```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

如果显示 `undefined`,说明环境变量未正确配置。

### 6. 重新部署

修改环境变量后,必须重新部署应用才能生效:
- 在Vercel: 进入项目 > Settings > Environment Variables > 添加/修改后 > Deployments > 点击最新部署的三个点 > Redeploy
- 在Netlify: Site settings > Environment variables > 添加/修改后 > Deploys > Trigger deploy

### 7. 检查Supabase Auth回调URL配置

1. 登录Supabase Dashboard
2. 进入 **Authentication** > **URL Configuration**
3. 确保 **Site URL** 设置为你的生产环境URL
4. 在 **Redirect URLs** 中添加所有可能的回调URL

### 8. 临时调试方案

如果还是不行,可以在 `components/user-nav.tsx` 的 `handleSignIn` 函数中添加更多日志:

```typescript
const handleSignIn = async () => {
  console.log('Sign in button clicked')
  console.log('Supabase client:', supabase)
  console.log('Environment:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasClient: !!supabase
  })
  
  if (!supabase) {
    console.error('Supabase client not initialized')
    alert('Authentication not configured. Please check environment variables.')
    return
  }
  
  try {
    const redirectUrl = `${window.location.origin}/auth/callback`
    console.log('Redirect URL:', redirectUrl)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
    
    if (error) {
      console.error('Error signing in:', error)
      alert(`Sign in error: ${error.message}`)
    } else {
      console.log('Sign in initiated successfully')
    }
  } catch (error) {
    console.error('Exception during sign in:', error)
    alert(`Exception: ${error}`)
  }
}
```

## 快速检查清单

- [ ] 部署平台配置了 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 部署平台配置了 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 部署平台配置了 `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Google Cloud Console中添加了生产环境域名到授权来源
- [ ] Google Cloud Console中添加了回调URL
- [ ] Supabase中启用了Google Provider
- [ ] Supabase中配置了正确的Site URL和Redirect URLs
- [ ] 修改环境变量后重新部署了应用
- [ ] 浏览器控制台没有错误信息

## 最常见的问题

**问题**: 本地可以登录,生产环境不行
**原因**: Google OAuth授权域名中没有添加生产环境域名
**解决**: 在Google Cloud Console的OAuth Client中添加生产环境域名

**问题**: 点击按钮没反应
**原因**: 环境变量未配置或Supabase客户端初始化失败
**解决**: 检查部署平台的环境变量配置,确保变量名以 `NEXT_PUBLIC_` 开头

**问题**: 出现 redirect_uri_mismatch 错误
**原因**: 回调URL不在Google OAuth的授权列表中
**解决**: 在Google Cloud Console中添加正确的回调URL
