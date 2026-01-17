import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if Supabase is configured
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-project-url' || supabaseAnonKey === 'your-anon-key') {
    return null
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
