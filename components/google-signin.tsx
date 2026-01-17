'use client'

import Script from 'next/script'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

declare const google: any

// Generate nonce for Google ID token sign-in
const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return [nonce, hashedNonce]
}

export function GoogleSignIn() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const initializeGoogleOneTap = async () => {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-project-url' ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'your-google-client-id') {
      console.log('Supabase or Google OAuth not configured. Skipping Google Sign-In initialization.')
      return
    }

    console.log('Initializing Google One Tap')
    const [nonce, hashedNonce] = await generateNonce()

    // Check if there's already an existing session
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session', error)
    }
    if (data.session) {
      router.refresh()
      return
    }

    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            setIsLoading(true)
            // Send ID token to Supabase
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            })

            if (error) throw error
            console.log('Successfully logged in with Google')
            router.refresh()
          } catch (error) {
            console.error('Error logging in with Google', error)
          } finally {
            setIsLoading(false)
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      })
      google.accounts.id.prompt()
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={initializeGoogleOneTap}
      />
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground">Signing in...</p>
          </div>
        </div>
      )}
    </>
  )
}
