# Nano Banana v2.0 - 认证限制的Image Editor功能设计

## 📋 功能概述

**核心需求**: 只有注册用户可以使用Image Editor功能

**当前状态**: Image Editor对所有访客开放
**目标状态**: 未登录用户看到登录提示,已登录用户可以正常使用

---

## 🎯 用户流程

### 场景1: 未登录用户访问

```
用户访问网站
    ↓
滚动到Image Editor区域
    ↓
看到"登录墙"(Login Wall)
    ↓
显示: "Sign in to start creating"
    ↓
点击"Sign In with Google"按钮
    ↓
完成Google登录
    ↓
自动解锁Image Editor
    ↓
开始使用编辑功能
```

### 场景2: 已登录用户访问

```
用户访问网站(已登录)
    ↓
滚动到Image Editor区域
    ↓
直接看到完整的编辑器界面
    ↓
可以立即上传图片和生成
```

---

## 🎨 界面设计

### 1. 未登录状态 - 登录墙设计

#### 视觉效果:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              🍌 Nano Banana AI Editor                   │
│                                                         │
│         [模糊的编辑器界面预览背景]                        │
│                                                         │
│    ┌───────────────────────────────────────┐           │
│    │                                       │           │
│    │   🔒 Sign in to Start Creating        │           │
│    │                                       │           │
│    │   Unlock powerful AI image editing    │           │
│    │   with your Google account            │           │
│    │                                       │           │
│    │   ✨ Upload and edit images           │           │
│    │   🎨 AI-powered transformations       │           │
│    │   ⚡ Instant results                  │           │
│    │                                       │           │
│    │   [Sign In with Google 按钮]          │           │
│    │                                       │           │
│    │   Already have an account? Sign in    │           │
│    │                                       │           │
│    └───────────────────────────────────────┘           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 设计元素:
- **背景**: 模糊的编辑器界面(blur效果)
- **中央卡片**: 半透明白色/深色卡片
- **图标**: 🔒 锁定图标 + 🍌 香蕉图标
- **标题**: "Sign in to Start Creating"
- **副标题**: 简短的价值主张
- **功能列表**: 3-4个核心功能点
- **CTA按钮**: 醒目的"Sign In with Google"按钮
- **辅助文本**: "Already have an account? Sign in"

---

### 2. 已登录状态 - 完整编辑器

#### 视觉效果:
```
┌─────────────────────────────────────────────────────────┐
│  Welcome back, [用户名]! 👋                              │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  Prompt Engine   │  │  Output Gallery  │           │
│  │                  │  │                  │           │
│  │  [上传图片区域]   │  │  [生成结果区域]   │           │
│  │                  │  │                  │           │
│  │  [提示词输入]     │  │                  │           │
│  │                  │  │                  │           │
│  │  [Generate按钮]   │  │                  │           │
│  │                  │  │                  │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                         │
│  💡 Tip: Try "make it more colorful" or                │
│      "add a sunset background"                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 新增元素:
- **欢迎消息**: "Welcome back, [用户名]!"
- **使用提示**: 底部显示使用技巧
- **Credits显示**: 显示剩余credits(如果有限制)

---

## 💻 技术实现

### 1. 组件结构

```typescript
// components/image-editor.tsx

export function ImageEditor() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  // 显示加载状态
  if (loading) {
    return <LoadingState />
  }

  // 未登录显示登录墙
  if (!user) {
    return <LoginWall />
  }

  // 已登录显示完整编辑器
  return <FullEditor user={user} />
}
```

### 2. 登录墙组件

```typescript
// components/login-wall.tsx

export function LoginWall() {
  const supabase = createClient()

  const handleSignIn = async () => {
    if (!supabase) return
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <section id="editor" className="py-20 bg-secondary/50 relative">
      {/* 模糊的背景预览 */}
      <div className="absolute inset-0 opacity-30 blur-sm">
        <EditorPreview />
      </div>

      {/* 登录卡片 */}
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-md shadow-2xl">
          <CardContent className="p-12 text-center space-y-6">
            {/* 图标 */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <BananaIcon size={32} />
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                🔒
              </div>
            </div>

            {/* 标题 */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Sign in to Start Creating
              </h2>
              <p className="text-muted-foreground">
                Unlock powerful AI image editing with your Google account
              </p>
            </div>

            {/* 功能列表 */}
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <BananaIcon size={20} className="text-primary" />
                <span className="text-foreground">Upload and edit images</span>
              </div>
              <div className="flex items-center gap-3">
                <BananaIcon size={20} className="text-primary" />
                <span className="text-foreground">AI-powered transformations</span>
              </div>
              <div className="flex items-center gap-3">
                <BananaIcon size={20} className="text-primary" />
                <span className="text-foreground">Instant results</span>
              </div>
            </div>

            {/* CTA按钮 */}
            <Button
              onClick={handleSignIn}
              size="lg"
              className="w-full max-w-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                {/* Google图标 */}
              </svg>
              Sign In with Google
            </Button>

            {/* 辅助文本 */}
            <p className="text-sm text-muted-foreground">
              Free to start • No credit card required
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
```

### 3. API路由保护

```typescript
// app/api/generate/route.ts

export async function POST(request: NextRequest) {
  // 验证用户登录
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Authentication not configured' },
      { status: 500 }
    )
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.json(
      { error: 'Please sign in to use the image editor' },
      { status: 401 }
    )
  }

  // 继续处理图片生成...
}
```

---

## 🎨 样式和动画

### CSS效果

```css
/* 登录墙背景模糊效果 */
.editor-preview-blur {
  filter: blur(8px);
  opacity: 0.3;
  pointer-events: none;
}

/* 登录卡片动画 */
.login-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮悬停效果 */
.sign-in-button {
  transition: all 0.3s ease;
}

.sign-in-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
```

---

## 📱 响应式设计

### 桌面端 (>1024px)
- 登录卡片居中,最大宽度600px
- 背景模糊效果完整显示
- 按钮大尺寸

### 平板端 (768px - 1024px)
- 登录卡片宽度90%
- 适当调整间距

### 移动端 (<768px)
- 登录卡片全宽,左右padding 16px
- 减少垂直间距
- 按钮全宽
- 简化背景效果

---

## 🔐 安全考虑

### 1. 前端验证
- 检查用户登录状态
- 隐藏编辑器UI
- 显示登录提示

### 2. 后端验证
- API路由验证JWT token
- 拒绝未认证请求
- 返回401错误

### 3. 会话管理
- 使用Supabase session
- 自动刷新token
- 监听登录状态变化

---

## 📊 用户体验优化

### 1. 加载状态
```typescript
if (loading) {
  return (
    <div className="py-20 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
```

### 2. 登录后自动跳转
```typescript
// 登录成功后自动滚动到编辑器
useEffect(() => {
  if (user && !previousUser) {
    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })
  }
}, [user])
```

### 3. 错误处理
```typescript
if (authError) {
  return (
    <div className="py-20 text-center">
      <p className="text-destructive">
        Authentication error. Please try again.
      </p>
      <Button onClick={retry}>Retry</Button>
    </div>
  )
}
```

---

## 🎯 成功指标

### 用户行为指标
- **登录转化率**: 访问编辑器 → 完成登录的比例
- **编辑器使用率**: 登录用户中实际使用编辑器的比例
- **会话时长**: 用户在编辑器的停留时间

### 技术指标
- **登录成功率**: >95%
- **页面加载时间**: <2秒
- **API响应时间**: <500ms

---

## 🚀 实施步骤

### Phase 1: 基础认证 (1-2天)
1. ✅ 添加用户状态检查
2. ✅ 创建LoginWall组件
3. ✅ 添加API路由保护
4. ✅ 测试登录流程

### Phase 2: UI优化 (1天)
1. ✅ 设计登录墙视觉效果
2. ✅ 添加动画和过渡
3. ✅ 响应式适配
4. ✅ 错误状态处理

### Phase 3: 用户体验 (1天)
1. ✅ 添加欢迎消息
2. ✅ 使用提示
3. ✅ 加载状态优化
4. ✅ 自动跳转

### Phase 4: 测试和优化 (1天)
1. ✅ 功能测试
2. ✅ 性能优化
3. ✅ 安全审查
4. ✅ 用户测试

---

## 📝 代码文件清单

### 需要修改的文件:
1. `components/image-editor.tsx` - 添加认证检查
2. `app/api/generate/route.ts` - 添加API保护

### 需要创建的文件:
1. `components/login-wall.tsx` - 登录墙组件
2. `components/editor-preview.tsx` - 编辑器预览组件(模糊背景)

---

## 🎨 视觉参考

### 配色方案
- **主色**: Primary (香蕉黄)
- **强调色**: Accent
- **背景**: Card with backdrop-blur
- **文字**: Foreground / Muted-foreground

### 字体
- **标题**: Bold, 2xl-3xl
- **正文**: Regular, sm-base
- **按钮**: Semibold, base-lg

### 间距
- **卡片padding**: 12 (48px)
- **元素间距**: 6 (24px)
- **按钮高度**: lg (44px)

---

## ❓ 常见问题

### Q: 如果用户登录失败怎么办?
A: 显示错误消息,提供重试按钮,并记录错误日志。

### Q: 是否需要记住用户的编辑历史?
A: v2.0可以考虑添加历史记录功能,存储在Supabase数据库。

### Q: 免费用户和付费用户有什么区别?
A: 可以通过credits系统限制:
- Free: 10次/月
- Pro: 500次/月
- Max: 无限制

### Q: 如何处理会话过期?
A: Supabase自动处理token刷新,如果过期会触发重新登录。

---

## 🎯 下一步

1. **审查设计**: 确认UI/UX设计符合品牌风格
2. **开始实施**: 按照Phase 1-4的步骤实施
3. **用户测试**: 邀请测试用户体验登录流程
4. **迭代优化**: 根据反馈调整设计

需要我开始实施这个功能吗?
