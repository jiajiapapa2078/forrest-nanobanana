'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'

export function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase) {
      setLoading(false)
      return
    }

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSignIn = async () => {
    console.log('=== Sign In Debug Info ===')
    console.log('Supabase client exists:', !!supabase)
    console.log('Environment variables:', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    })
    
    if (!supabase) {
      console.error('Supabase client not initialized')
      const missingVars = []
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
      
      alert(`认证配置错误。缺少环境变量: ${missingVars.join(', ')}。\n\n请在部署平台配置这些环境变量后重新部署。`)
      return
    }
    
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      console.log('Initiating Google sign in with redirect:', redirectUrl)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })
      
      if (error) {
        console.error('Error signing in:', error)
        alert(`登录失败: ${error.message}\n\n请确保:\n1. Google OAuth已在Supabase中启用\n2. 当前域名已添加到Google Cloud Console\n3. 回调URL已正确配置`)
      }
    } catch (error) {
      console.error('Exception during sign in:', error)
      alert(`发生错误: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-secondary animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignIn}
          className="bg-transparent"
        >
          Sign In with Google
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.user_metadata?.avatar_url && (
          <Image
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata?.full_name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm text-foreground hidden md:inline">
          {user.user_metadata?.full_name || user.email}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="bg-transparent"
      >
        Sign Out
      </Button>
    </div>
  )
}
