# 如何获取 SUPABASE_SERVICE_ROLE_KEY

## 步骤 1: 登录 Supabase Dashboard

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录你的账户
3. 选择你的项目（在这个例子中是你已经创建的项目）

## 步骤 2: 进入 API Settings

1. 在左侧菜单栏中，点击 **Settings**（设置）图标（齿轮图标）
2. 在设置菜单中，点击 **API**

## 步骤 3: 找到 Service Role Key

在 API Settings 页面，你会看到几个不同的密钥：

### Project API keys 部分包含：

1. **Project URL** 
   - 这是你的 `NEXT_PUBLIC_SUPABASE_URL`
   - 格式: `https://xjaylzxqmpeqyzqchsoe.supabase.co`

2. **anon public** (公开密钥)
   - 这是你的 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 可以在客户端使用
   - 受 Row Level Security (RLS) 策略限制

3. **service_role** (服务角色密钥) ⭐ **这就是你需要的！**
   - 这是你的 `SUPABASE_SERVICE_ROLE_KEY`
   - **只能在服务器端使用**
   - **绕过所有 RLS 策略**
   - **非常敏感，不要暴露给客户端**

## 步骤 4: 复制 Service Role Key

1. 找到标记为 **service_role** 的密钥
2. 点击右侧的 **复制** 图标（或 "Reveal" 按钮先显示密钥）
3. 密钥格式类似：
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYXlsenhxbXBlcXl6cWNoc29lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM4MzQyMCwiZXhwIjoyMDgzOTU5NDIwfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

## 步骤 5: 添加到 .env.local

将复制的密钥添加到你的 `.env.local` 文件：

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYXlsenhxbXBlcXl6cWNoc29lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM4MzQyMCwiZXhwIjoyMDgzOTU5NDIwfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## 重要安全提示 ⚠️

### ✅ 可以做的：
- 在服务器端代码中使用（API routes, Server Components）
- 存储在环境变量中
- 用于 webhook 处理
- 用于管理员操作

### ❌ 不能做的：
- **永远不要**在客户端代码中使用
- **永远不要**提交到 Git 仓库
- **永远不要**在浏览器中暴露
- **永远不要**在公开的代码中硬编码

## 验证配置

配置完成后，重启你的开发服务器：

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

## 常见问题

### Q: 我找不到 service_role 密钥？
**A**: 确保你在正确的项目中，并且有足够的权限。service_role 密钥应该在 Settings > API 页面的 "Project API keys" 部分。

### Q: 密钥很长，是正常的吗？
**A**: 是的！service_role 密钥通常是一个很长的 JWT token，这是正常的。

### Q: 我可以重新生成这个密钥吗？
**A**: 可以，但这会使所有使用旧密钥的应用失效。只在密钥泄露时才重新生成。

### Q: 这个密钥和 anon key 有什么区别？
**A**: 
- **anon key**: 用于客户端，受 RLS 策略限制
- **service_role key**: 用于服务器端，绕过所有 RLS 策略，拥有完全访问权限

## 下一步

配置完 `SUPABASE_SERVICE_ROLE_KEY` 后，你还需要：

1. 运行数据库迁移创建 `user_subscriptions` 表
2. 配置 Creem API 密钥
3. 配置 Creem Webhook Secret

参考 `CREEM_SETUP.md` 文件了解完整的配置流程。
