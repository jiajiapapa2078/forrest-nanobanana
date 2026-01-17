# Creem 测试模式故障排除

## 当前状态
- ✅ Creem API Key 已配置: `creem_test_4tqLUr4vNkCGcWWOEKcIdV`
- ✅ 产品ID设置为: `test`
- ✅ Webhook Secret 已配置
- ✅ Supabase 认证已配置

## 问题诊断步骤

### 1. 确认用户已登录
点击"Start Pro Trial"按钮前,请确保:
- 右上角显示了你的Google账号头像
- 如果没有登录,请先点击"Sign in with Google"登录

### 2. 检查Creem产品配置
在Creem测试模式控制台中确认:
- 产品名称是否确实为 `test`
- 产品ID是否为 `test` (不是产品名称,而是API中使用的ID)
- 产品状态是否为"Active"(激活状态)

### 3. 获取正确的产品ID
如果"test"不是正确的产品ID:

1. 登录 Creem 控制台: https://dashboard.creem.io
2. 切换到测试模式(Test Mode)
3. 进入 Products 页面
4. 找到你创建的产品
5. 复制产品的 **Product ID** (不是产品名称)
6. 更新 `config/pricing.ts` 文件中的 `priceId`

### 4. 查看详细错误日志
当点击"Start Pro Trial"按钮时:
1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 点击按钮
4. 查看控制台中的错误信息

同时查看服务器日志:
- 在运行 `npm run dev` 的终端窗口中查看输出
- 寻找 "Creem API response" 相关的日志

### 5. 常见错误及解决方案

#### 错误: "Please sign in to subscribe"
**原因**: 用户未登录
**解决**: 点击右上角的"Sign in with Google"按钮登录

#### 错误: "Payment configuration error. The product may not exist in Creem"
**原因**: 产品ID不正确或产品不存在
**解决**: 
1. 检查Creem控制台中的产品ID
2. 更新 `config/pricing.ts` 中的 `priceId`
3. 确保产品状态为Active

#### 错误: 403 Forbidden
**原因**: API密钥权限不足或产品ID错误
**解决**:
1. 确认API密钥是测试模式的密钥
2. 确认产品ID正确
3. 确认产品在测试模式下可访问

#### 错误: "Payment system not configured"
**原因**: 环境变量未正确设置
**解决**: 检查 `.env.local` 文件中的 `CREEM_API_KEY`

### 6. 测试API连接
你可以使用以下curl命令测试Creem API连接:

```bash
curl -X POST https://api.creem.io/v1/checkouts \
  -H "Content-Type: application/json" \
  -H "x-api-key: creem_test_4tqLUr4vNkCGcWWOEKcIdV" \
  -d '{
    "product": "test",
    "success_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/pricing",
    "customer_email": "test@example.com"
  }'
```

如果返回403错误,说明产品ID不正确。

### 7. 下一步操作
1. 确认已登录Google账号
2. 打开浏览器开发者工具(F12)
3. 点击"Start Pro Trial"按钮
4. 查看Console中的错误信息
5. 查看服务器终端中的日志
6. 根据错误信息进行相应调整

## 需要提供的信息
如果问题仍未解决,请提供:
1. 浏览器Console中的完整错误信息
2. 服务器终端中的日志输出
3. Creem控制台中产品的截图(显示产品ID)
4. 是否已成功登录(右上角是否显示头像)
