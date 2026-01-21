'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [supabaseStatus, setSupabaseStatus] = useState<string>('checking...')

  useEffect(() => {
    // Check environment variables
    const vars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET',
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'NOT SET',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    }
    setEnvVars(vars)

    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          setSupabaseStatus('❌ Supabase client not initialized')
          return
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setSupabaseStatus(`❌ Error: ${error.message}`)
        } else {
          setSupabaseStatus('✅ Supabase connection OK')
        }
      } catch (error) {
        setSupabaseStatus(`❌ Exception: ${error}`)
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          🔍 Configuration Debug Page
        </h1>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Environment Variables
          </h2>
          <div className="space-y-2 font-mono text-sm">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[300px]">{key}:</span>
                <span className={value.includes('NOT SET') ? 'text-destructive' : 'text-primary'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Supabase Connection
          </h2>
          <p className="font-mono text-sm">{supabaseStatus}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Current URL
          </h2>
          <p className="font-mono text-sm text-primary">
            {typeof window !== 'undefined' ? window.location.origin : 'Loading...'}
          </p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            ⚠️ Important
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• This page should only be used for debugging</li>
            <li>• Do not share screenshots of this page publicly</li>
            <li>• Delete this page before going to production</li>
            <li>• Check PRODUCTION_GOOGLE_LOGIN_FIX.md for detailed setup instructions</li>
          </ul>
        </div>

        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
