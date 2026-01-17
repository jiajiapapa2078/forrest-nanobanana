# Supabase Google 登录配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建一个新项目
2. 记录你的项目 URL 和 anon key

## 2. 配置 Google OAuth

### 2.1 在 Google Cloud Console 创建 OAuth 客户端

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 转到 "APIs & Services" > "Credentials"
5. 点击 "Create Credentials" > "OAuth client ID"
6. 选择 "Web application"
7. 添加授权的重定向 URI：
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (用于本地开发)
8. 记录 Client ID 和 Client Secret

### 2.2 在 Supabase 中配置 Google Provider

1. 在 Supabase Dashboard 中，转到 Authentication > Providers
2. 启用 Google provider
3. 输入你的 Google Client ID 和 Client Secret
4. 保存配置

## 3. 配置环境变量

在项目根目录的 `.env.local` 文件中添加以下配置：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 4. 配置重定向 URL

在 Supabase Dashboard 中：
1. 转到 Authentication > URL Configuration
2. 在 "Redirect URLs" 中添加：
   - `http://localhost:3000/auth/callback` (本地开发)
   - `https://your-domain.com/auth/callback` (生产环境)

## 5. 测试登录

1. 重启开发服务器：`npm run dev`
2. 访问 `http://localhost:3000`
3. Google One-Tap 登录提示应该会自动出现
4. 点击登录并授权

## 功能说明

- **Google One-Tap**: 自动显示 Google 登录提示
- **服务器端认证**: 使用 Supabase SSR 进行安全的服务器端认证
- **会话管理**: 自动刷新令牌和管理用户会话
- **用户信息显示**: 在 Header 中显示用户头像和名称
- **登出功能**: 点击 "Sign Out" 按钮退出登录

## 安全注意事项

1. 永远不要将 `.env.local` 文件提交到 Git
2. 在生产环境中使用环境变量管理服务
3. 定期轮换 API 密钥
4. 配置适当的 CORS 和重定向 URL 白名单
