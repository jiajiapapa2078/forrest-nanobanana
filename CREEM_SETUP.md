# Creem 支付集成配置指南

## 1. 创建 Creem 账户

1. 访问 [Creem](https://creem.io) 并注册账户
2. 完成账户验证

## 2. 获取 API 密钥和 Webhook Secret

### 2.1 获取 API 密钥

1. 登录 Creem Dashboard
2. 转到 **Developers** 部分
3. 复制你的 **API Key**
4. 在 `.env.local` 中设置：
   ```env
   CREEM_API_KEY=your-creem-api-key
   ```

### 2.2 获取 Webhook Secret

1. 在 Creem Dashboard 中转到 **Webhooks**
2. 创建新的 Webhook endpoint（见下面第4步）
3. 创建后，复制显示的 **Webhook Secret**
4. 在 `.env.local` 中设置：
   ```env
   CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
   ```

**重要说明**：
- `CREEM_API_KEY`: 用于调用 Creem API（创建 checkout session 等）
- `CREEM_WEBHOOK_SECRET`: 用于验证 webhook 请求的签名，确保请求来自 Creem
- 这两个密钥都是必需的，不能互相替换

## 3. 创建产品

在 Creem Dashboard 中创建以下产品：

### Pro Plan
- **Product ID**: `prod_pro_monthly`
- **Name**: Nano Banana Pro
- **Price**: $19/month
- **Type**: Recurring subscription
- **Billing Period**: Monthly

### Enterprise Plan
- **Product ID**: `prod_enterprise_monthly`
- **Name**: Nano Banana Enterprise
- **Price**: $99/month
- **Type**: Recurring subscription
- **Billing Period**: Monthly

## 4. 配置 Webhook

1. 在 Creem Dashboard 中转到 **Webhooks**
2. 添加新的 Webhook endpoint：
   - **URL**: `https://your-domain.com/api/webhooks/creem`
   - **Events**: 选择以下事件：
     - `checkout.completed`
     - `subscription.created`
     - `subscription.updated`
     - `subscription.cancelled`
     - `payment.succeeded`
     - `payment.failed`

## 5. 配置 Supabase

### 5.1 获取 Service Role Key

1. 在 Supabase Dashboard 中转到 **Settings** > **API**
2. 复制 **service_role** key（注意：这是敏感密钥，不要暴露）
3. 在 `.env.local` 中设置：
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

**重要说明**：
- `SUPABASE_SERVICE_ROLE_KEY`: 用于在服务器端操作 Supabase 数据库（绕过 RLS）
- 这个密钥与 Creem 的密钥完全独立，用于不同的目的
- 永远不要将此密钥暴露给客户端

### 5.2 运行数据库迁移

在 Supabase SQL Editor 中运行 `supabase/migrations/001_create_subscriptions_table.sql` 文件中的 SQL 语句。

或者使用 Supabase CLI：
```bash
supabase db push
```

## 6. 测试模式

Creem 支持测试模式，你可以：

1. 在 Creem Dashboard 中切换到 **Test Mode**
2. 使用测试 API 密钥进行开发
3. 使用测试卡号进行支付测试：
   - 成功: `4242 4242 4242 4242`
   - 失败: `4000 0000 0000 0002`

## 7. 环境变量配置

确保 `.env.local` 包含以下所有变量：

```env
# Creem Payment Configuration
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 密钥说明：

| 密钥 | 用途 | 获取位置 |
|------|------|----------|
| `CREEM_API_KEY` | 调用 Creem API 创建支付会话 | Creem Dashboard > Developers |
| `CREEM_WEBHOOK_SECRET` | 验证 webhook 请求签名 | Creem Dashboard > Webhooks（创建 webhook 后显示） |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务器端操作数据库 | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 客户端访问 Supabase | Supabase Dashboard > Settings > API |

## 8. 生产环境配置

部署到生产环境时：

1. 更新 `NEXT_PUBLIC_APP_URL` 为你的实际域名
2. 切换到 Creem 的生产模式
3. 使用生产环境的 API 密钥
4. 更新 Webhook URL 为生产环境地址
5. 确保所有敏感密钥都通过环境变量管理

## 9. 功能说明

### 订阅流程

1. 用户点击定价页面的订阅按钮
2. 系统创建 Creem checkout session
3. 用户被重定向到 Creem 支付页面
4. 支付成功后，用户被重定向回成功页面
5. Webhook 接收支付通知并更新数据库

### 订阅管理

用户可以通过 Creem Customer Portal 管理订阅：
- 查看订阅详情
- 更新支付方式
- 取消订阅
- 查看发票历史

## 10. 安全注意事项

1. **永远不要**将 Service Role Key 暴露给客户端
2. **永远不要**将 API 密钥提交到 Git
3. 使用环境变量管理所有敏感信息
4. 在生产环境中启用 HTTPS
5. 验证所有 Webhook 请求的来源

## 11. 故障排查

### Webhook 未触发
- 检查 Webhook URL 是否正确
- 确保服务器可以从外部访问
- 查看 Creem Dashboard 中的 Webhook 日志

### 支付失败
- 检查 API 密钥是否正确
- 确认产品 ID 是否匹配
- 查看浏览器控制台和服务器日志

### 数据库错误
- 确认迁移已正确运行
- 检查 Service Role Key 是否正确
- 验证 RLS 策略是否正确配置
