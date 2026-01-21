# PayPal 支付集成说明

## 当前实现

Pricing页面已经集成了PayPal支付链接。

### 支付流程

1. **Basic计划** - 免费,点击按钮跳转到编辑器
2. **Pro计划** - $19.50/月,点击按钮打开PayPal支付页面
3. **Max计划** - $80/月,点击按钮发送邮件联系销售

### Pro计划PayPal链接

当前配置的PayPal支付链接:
```
https://www.paypal.com/ncp/payment/A8QJ6MZG7TU84
```

这个链接在 `config/pricing.ts` 文件中配置。

## 功能特点

### 1. 年付/月付切换
- 用户可以在月付和年付之间切换
- 年付显示50%折扣优惠
- 切换按钮位于定价卡片上方

### 2. 定价展示
- **月付模式**: 显示月度价格
- **年付模式**: 显示月度价格 + 原价划线 + 年付优惠价

### 3. 计划对比
每个计划显示:
- 计划名称和描述
- 价格(月付/年付)
- Credits额度
- 每月可生成图片数量
- 详细功能列表
- CTA按钮

### 4. 支付按钮行为

#### Basic计划
```typescript
if (plan.name === "Basic") {
  window.location.href = "#editor"
  return
}
```

#### Pro计划
```typescript
if (plan.paypalLink) {
  window.open(plan.paypalLink, "_blank")
}
```

#### Max计划
```typescript
if (plan.name === "Max" || !plan.paypalLink) {
  window.location.href = "mailto:sales@nanobanana.ai"
  return
}
```

## 如何更新PayPal链接

### 方法1: 修改配置文件

编辑 `config/pricing.ts`:

```typescript
pro: {
  // ... 其他配置
  paypalLink: "https://www.paypal.com/ncp/payment/YOUR_NEW_PAYMENT_ID",
}
```

### 方法2: 添加多个PayPal链接

如果你想为不同的计划使用不同的PayPal链接:

```typescript
export const PRICING_CONFIG = {
  basic: {
    // ...
    paypalLink: null, // 免费计划
  },
  pro: {
    // ...
    paypalLink: "https://www.paypal.com/ncp/payment/PRO_PAYMENT_ID",
  },
  max: {
    // ...
    paypalLink: "https://www.paypal.com/ncp/payment/MAX_PAYMENT_ID",
  },
}
```

## PayPal支付链接类型

### 1. PayPal.me 链接
格式: `https://paypal.me/username/amount`
- 简单快速
- 适合一次性支付
- 不支持订阅

### 2. PayPal订阅链接
格式: `https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=PLAN_ID`
- 支持定期订阅
- 自动续费
- 需要在PayPal后台创建订阅计划

### 3. PayPal支付按钮链接
格式: `https://www.paypal.com/ncp/payment/PAYMENT_ID`
- 当前使用的类型
- 灵活配置
- 支持多种支付选项

## 创建PayPal订阅计划

如果你想使用真正的订阅功能:

1. 登录 [PayPal Developer Dashboard](https://developer.paypal.com/)
2. 进入 **Products & Pricing**
3. 创建新产品:
   - Product Name: Nano Banana Pro
   - Product Type: Digital Goods
4. 创建定价计划:
   - Plan Name: Pro Monthly / Pro Yearly
   - Billing Cycle: Monthly / Yearly
   - Price: $19.50 / $234
5. 获取Plan ID并更新配置

## FAQ部分

Pricing页面底部包含FAQ部分,回答常见问题:
- Credits如何工作
- 是否可以随时更改计划
- 未使用的Credits是否结转
- 支持哪些支付方式

## 样式特点

参考 imgeditor.co/pricing 的设计:
- 渐变背景
- 卡片悬停效果
- "Most Popular"标签
- "SAVE 50%"徽章
- 月付/年付切换器
- Credits和图片数量高亮显示
- FAQ网格布局

## 测试建议

1. **本地测试**:
   - 访问 http://localhost:3000
   - 滚动到Pricing部分
   - 测试月付/年付切换
   - 点击各个计划按钮

2. **支付测试**:
   - 点击Pro计划按钮
   - 确认PayPal页面正确打开
   - 使用PayPal沙盒账号测试支付

3. **响应式测试**:
   - 在不同屏幕尺寸下测试
   - 确保移动端显示正常

## 未来改进建议

1. **集成PayPal SDK**
   - 在页面内嵌入支付流程
   - 更好的用户体验
   - 支付完成后自动更新用户状态

2. **Webhook集成**
   - 接收PayPal支付通知
   - 自动激活用户订阅
   - 更新数据库记录

3. **用户仪表板**
   - 显示当前订阅状态
   - 查看Credits余额
   - 管理订阅(升级/降级/取消)

4. **多货币支持**
   - 根据用户地区显示不同货币
   - 自动汇率转换

## 相关文件

- `config/pricing.ts` - 定价配置
- `components/pricing.tsx` - Pricing组件
- `app/page.tsx` - 主页(包含Pricing部分)
