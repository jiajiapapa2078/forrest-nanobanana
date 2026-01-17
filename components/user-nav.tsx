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
    if (!supabase) return
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('Error signing in:', error)
      }
    } catch (error) {
      console.error('Error signing in:', error)
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
