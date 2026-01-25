# 产品PRD创建指南

## 🎯 推荐Skill: doc-coauthoring

**doc-coauthoring** 是专门用于协作创建文档的Skill,非常适合创建PRD(Product Requirements Document)。

## 📋 doc-coauthoring Skill 概述

### 适用场景
- ✅ 编写产品需求文档(PRD)
- ✅ 创建技术规范
- ✅ 起草决策文档
- ✅ 编写提案
- ✅ 创建RFC(Request for Comments)

### 核心优势
- 结构化的三阶段工作流
- 主动引导和提问
- 确保文档对读者友好
- 支持迭代优化

## 🔄 三阶段工作流

### 阶段1: 上下文收集 (Context Gathering)
**目标**: 收集所有相关信息

**初始问题**:
1. 这是什么类型的文档?(PRD, 技术规范, 决策文档等)
2. 主要受众是谁?
3. 期望的影响是什么?
4. 是否有模板或特定格式?
5. 其他约束或上下文?

**信息收集**:
- 项目背景和问题
- 相关团队讨论
- 为什么不使用替代方案
- 组织上下文
- 时间压力或约束
- 技术架构或依赖
- 利益相关者关注点

**支持方式**:
- 自由倾倒信息(stream-of-consciousness)
- 链接到团队频道或文档
- 上传现有文档

---

### 阶段2: 优化和结构化 (Refinement & Structure)
**目标**: 通过迭代构建每个部分

**工作方式**:
- 逐节构建文档
- 头脑风暴和编辑
- 确保逻辑清晰
- 优化表达

---

### 阶段3: 读者测试 (Reader Testing)
**目标**: 用全新的Claude测试文档

**测试内容**:
- 文档是否清晰易懂
- 是否有盲点
- 读者能否理解意图
- 是否需要补充信息

---

## 📝 PRD标准结构

### 1. 概述 (Overview)
- 产品名称
- 产品愿景
- 目标用户
- 核心价值主张

### 2. 背景 (Background)
- 问题陈述
- 市场机会
- 竞品分析
- 为什么现在做

### 3. 目标 (Goals)
- 业务目标
- 用户目标
- 成功指标(KPI)

### 4. 用户故事 (User Stories)
- 作为[角色]
- 我想要[功能]
- 以便[价值]

### 5. 功能需求 (Functional Requirements)
- 核心功能列表
- 功能优先级
- 详细描述

### 6. 非功能需求 (Non-Functional Requirements)
- 性能要求
- 安全要求
- 可用性要求
- 可扩展性要求

### 7. 用户体验 (User Experience)
- 用户流程图
- 线框图/原型
- 交互设计

### 8. 技术要求 (Technical Requirements)
- 技术栈
- 架构设计
- 集成需求
- 数据模型

### 9. 时间线 (Timeline)
- 里程碑
- 发布计划
- 依赖关系

### 10. 风险和假设 (Risks & Assumptions)
- 潜在风险
- 缓解策略
- 关键假设

### 11. 附录 (Appendix)
- 参考资料
- 术语表
- 相关文档链接

---

## 🚀 使用doc-coauthoring创建PRD

### 步骤1: 触发Skill
在Claude中说:
```
"I want to write a PRD for [your product]"
"Help me create a product requirements document"
"Let's draft a PRD using the doc-coauthoring workflow"
```

### 步骤2: 回答初始问题
Claude会问你:
- 文档类型: PRD
- 受众: 产品团队、工程团队、设计团队
- 期望影响: 清晰传达产品需求,指导开发
- 模板: 使用标准PRD模板(或提供自定义模板)

### 步骤3: 信息倾倒
自由地提供所有相关信息:
```
我们正在开发一个AI图片编辑应用...
目标用户是内容创作者...
核心功能是通过文本提示编辑图片...
竞品有Photoshop, Canva...
我们的优势是AI驱动,更简单...
```

### 步骤4: 迭代优化
Claude会帮你:
- 组织信息
- 补充缺失部分
- 优化表达
- 确保逻辑清晰

### 步骤5: 读者测试
用新的Claude会话测试文档,确保:
- 没有上下文的人也能理解
- 没有遗漏关键信息
- 表达清晰准确

---

## 💡 最佳实践

### 1. 准备充分
在开始前收集:
- 用户研究数据
- 竞品分析
- 技术可行性评估
- 业务目标

### 2. 明确受众
不同受众需要不同的细节:
- **高管**: 关注业务价值和ROI
- **产品团队**: 关注用户需求和优先级
- **工程团队**: 关注技术实现和架构
- **设计团队**: 关注用户体验和交互

### 3. 使用视觉辅助
- 用户流程图
- 线框图
- 架构图
- 数据流图

### 4. 量化目标
- 使用具体的KPI
- 设定可衡量的成功标准
- 定义验收标准

### 5. 迭代更新
- PRD是活文档
- 随着项目进展更新
- 记录变更历史

---

## 🎯 针对Nano Banana的PRD示例

### 使用doc-coauthoring创建

```
我想为Nano Banana创建一个PRD

【阶段1: 上下文收集】
产品: Nano Banana - AI图片编辑应用
受众: 产品团队、工程团队、设计团队
目标: 指导v2.0版本开发

背景信息:
- 当前有基础的图片上传和AI生成功能
- 使用Gemini 2.5 Flash Image API
- 已集成Google登录和PayPal支付
- 目标用户是内容创作者和设计师
- 核心价值是简单易用的AI图片编辑

【阶段2: 结构化】
Claude会帮助组织成:
1. 产品概述
2. 用户故事
3. 功能需求
4. 技术架构
5. 时间线
...

【阶段3: 测试】
用新的Claude测试文档可读性
```

---

## 🔧 其他相关Skills

### 如果doc-coauthoring不够用:

1. **docx Skill** - 创建Word格式的PRD
   - 适合需要正式文档格式
   - 支持复杂排版

2. **pptx Skill** - 创建PRD演示文稿
   - 适合向高管汇报
   - 视觉化呈现

3. **skill-creator** - 创建自定义PRD模板Skill
   - 为团队标准化PRD格式
   - 包含公司特定的要求

---

## 📚 PRD模板示例

### 简化版PRD模板
```markdown
# [产品名称] PRD

## 1. 概述
- **产品**: 
- **版本**: 
- **日期**: 
- **作者**: 

## 2. 目标
- **业务目标**: 
- **用户目标**: 
- **成功指标**: 

## 3. 用户故事
- 作为[角色],我想要[功能],以便[价值]

## 4. 功能需求
### 4.1 核心功能
- [ ] 功能1
- [ ] 功能2

### 4.2 次要功能
- [ ] 功能3
- [ ] 功能4

## 5. 非功能需求
- 性能: 
- 安全: 
- 可用性: 

## 6. 技术要求
- 技术栈: 
- 架构: 
- 集成: 

## 7. 时间线
- 里程碑1: 
- 里程碑2: 
- 发布日期: 

## 8. 风险
- 风险1: 
- 缓解策略: 
```

---

## 🎬 快速开始

### 在Claude Code中:
```
/plugin install example-skills@anthropic-agent-skills
```

### 然后说:
```
"Use the doc-coauthoring skill to help me write a PRD for Nano Banana v2.0"
```

### 或者直接说:
```
"I want to write a PRD for my AI image editing app. 
Let's use the structured doc-coauthoring workflow."
```

---

## ❓ 常见问题

### Q: doc-coauthoring和直接写PRD有什么区别?
A: doc-coauthoring提供结构化的三阶段工作流,确保不遗漏关键信息,并通过读者测试验证文档质量。

### Q: 我可以使用自己的PRD模板吗?
A: 可以!在阶段1提供你的模板,Claude会按照你的模板结构工作。

### Q: 如何确保PRD的质量?
A: 使用阶段3的读者测试,用全新的Claude会话测试文档,模拟真实读者的体验。

### Q: PRD写完后如何导出?
A: 可以复制文本,或使用docx/pdf Skills生成正式文档格式。

---

## 🎯 总结

**创建PRD的最佳Skill**: **doc-coauthoring**

**优势**:
- ✅ 结构化工作流
- ✅ 主动引导和提问
- ✅ 确保文档质量
- ✅ 支持迭代优化
- ✅ 读者测试验证

**适合**:
- 产品需求文档(PRD)
- 技术规范
- 决策文档
- 提案和RFC

立即开始使用doc-coauthoring创建你的PRD吧!
