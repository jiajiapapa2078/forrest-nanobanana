'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BananaIcon } from "@/components/banana-icon"
import { createClient } from '@/lib/supabase/client'

export function LoginWall() {
  const supabase = createClient()

  const handleSignIn = async () => {
    if (!supabase) {
      alert('认证未配置。请联系管理员。')
      return
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('Error signing in:', error)
        alert(`登录失败: ${error.message}`)
      }
    } catch (error) {
      console.error('Exception during sign in:', error)
      alert('登录时发生错误,请重试')
    }
  }

  return (
    <section id="editor" className="py-20 bg-secondary/50 relative min-h-[600px]">
      {/* 模糊的背景预览 */}
      <div className="absolute inset-0 opacity-20 blur-md pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid lg:grid-cols-2 gap-8 h-full">
            <div className="bg-card/50 rounded-lg h-[400px]"></div>
            <div className="bg-card/50 rounded-lg h-[400px]"></div>
          </div>
        </div>
      </div>

      {/* 登录卡片 */}
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-md shadow-2xl animate-fadeInUp">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            {/* 图标 */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <BananaIcon size={32} />
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl">
                🔒
              </div>
            </div>

            {/* 标题 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Sign in to Start Creating
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Unlock powerful AI image editing with your Google account
              </p>
            </div>

            {/* 功能列表 */}
            <div className="space-y-3 text-left max-w-md mx-auto py-4">
              <div className="flex items-center gap-3">
                <BananaIcon size={20} className="text-primary flex-shrink-0" />
                <span className="text-foreground text-sm md:text-base">Upload and edit images with AI</span>
              </div>
              <div className="flex items-center gap-3">
                <BananaIcon size={20} className="text-primary flex-shrink-0" />
                <span className="text-foreground text-sm md:text-base">AI-powered transformations</span>
              </div>
              <div className="flex items-center gap-3">
                <BananaIcon size={20} className="text-primary flex-shrink-0" />
                <span className="text-foreground text-sm md:text-base">Instant results in seconds</span>
              </div>
            </div>

            {/* CTA按钮 */}
            <Button
              onClick={handleSignIn}
              size="lg"
              className="w-full max-w-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign In with Google
            </Button>

            {/* 辅助文本 */}
            <p className="text-xs md:text-sm text-muted-foreground">
              Free to start • No credit card required
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
