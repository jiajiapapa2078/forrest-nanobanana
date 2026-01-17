# Creem 测试模式配置说明

## 当前配置

你已经在 Creem 测试模式下创建了一个名为 "test" 的产品。代码已更新为使用这个产品 ID。

## 产品配置位置

产品 ID 配置在 `config/pricing.ts` 文件中：

```typescript
export const PRICING_CONFIG = {
  pro: {
    priceId: "test", // 你的 Creem 产品 ID
    // ...
  },
  enterprise: {
    priceId: "test", // 暂时使用相同的产品 ID
    // ...
  },
}
```

## 测试流程

### 1. 确认配置

确保 `.env.local` 中的 Creem API 密钥是测试模式的：

```env
CREEM_API_KEY=creem_test_4tqLUr4vNkCGcWWOEKcIdV
```

### 2. 测试支付流程

1. 访问 http://localhost:3000
2. 滚动到 Pricing 部分
3. 点击 "Start Pro Trial" 按钮
4. 应该会跳转到 Creem 支付页面
5. 使用测试卡号完成支付：
   - **成功卡号**: `4242 4242 4242 4242`
   - **过期日期**: 任何未来日期（如 12/25）
   - **CVC**: 任意 3 位数字（如 123）
   - **邮编**: 任意邮编

### 3. 验证成功

支付成功后：
- 应该重定向到 `/success` 页面
- 显示成功消息
- Webhook 会更新数据库（如果配置了）

## 创建更多产品

如果你想为 Pro 和 Enterprise 创建不同的产品：

### 在 Creem Dashboard 中：

1. 转到 **Products** 部分
2. 点击 **Create Product**
3. 创建产品：

**Pro 产品示例：**
- Product ID: `test-pro` 或 `nano-banana-pro`
- Name: Nano Banana Pro
- Price: $19.00
- Type: Recurring (Monthly)

**Enterprise 产品示例：**
- Product ID: `test-enterprise` 或 `nano-banana-enterprise`
- Name: Nano Banana Enterprise
- Price: $99.00
- Type: Recurring (Monthly)

### 更新配置：

在 `config/pricing.ts` 中更新产品 ID：

```typescript
export const PRICING_CONFIG = {
  pro: {
    priceId: "test-pro", // 更新为新的产品 ID
    // ...
  },
  enterprise: {
    priceId: "test-enterprise", // 更新为新的产品 ID
    // ...
  },
}
```

## 测试模式 vs 生产模式

### 测试模式（当前）

- API Key: `creem_test_...`
- 使用测试卡号
- 不会真实扣款
- 用于开发和测试

### 生产模式（部署时）

- API Key: `creem_live_...`
- 使用真实卡号
- 会真实扣款
- 需要更新环境变量

## 切换到生产模式

部署到生产环境时：

1. 在 Creem Dashboard 切换到 **Live Mode**
2. 创建生产环境的产品（使用相同的 ID）
3. 获取生产环境的 API Key
4. 更新环境变量：
   ```env
   CREEM_API_KEY=creem_live_xxxxx
   ```

## 常见问题

### Q: 为什么 Pro 和 Enterprise 使用相同的产品 ID？

**A**: 这是临时配置，用于快速测试。建议为每个计划创建独立的产品。

### Q: 测试支付会真实扣款吗？

**A**: 不会。测试模式下的支付不会真实扣款。

### Q: 如何查看测试支付记录？

**A**: 在 Creem Dashboard 的 **Transactions** 部分可以查看所有测试支付。

### Q: Enterprise 按钮为什么还是 "Contact Sales"？

**A**: 这是设计决定。你可以：
- 保持为联系销售（推荐）
- 或者改为支付按钮，修改 `config/pricing.ts` 中的 `cta` 字段

## 下一步

1. ✅ 测试 Pro 计划的支付流程
2. ⬜ 创建独立的 Enterprise 产品（可选）
3. ⬜ 配置 Webhook 接收支付通知
4. ⬜ 测试订阅管理功能
5. ⬜ 准备生产环境配置

## 需要帮助？

- 查看 Creem 文档: https://docs.creem.io
- 查看测试卡号: https://docs.creem.io/test-mode
- 查看 `CREEM_SETUP.md` 了解完整配置
