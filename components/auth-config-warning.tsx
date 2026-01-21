'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthConfigWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [missingVars, setMissingVars] = useState<string[]>([])

  useEffect(() => {
    const supabase = createClient()
    
    if (!supabase) {
      const missing: string[] = []
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
      
      setMissingVars(missing)
      setShowWarning(true)
    }
  }, [])

  if (!showWarning) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground mb-2">认证未配置</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Google登录功能需要配置以下环境变量:
          </p>
          <ul className="text-xs font-mono text-destructive space-y-1 mb-3">
            {missingVars.map(v => (
              <li key={v}>• {v}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            <a
              href="/debug"
              className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90"
            >
              查看调试信息
            </a>
            <button
              onClick={() => setShowWarning(false)}
              className="text-xs bg-secondary text-foreground px-3 py-1 rounded hover:bg-secondary/80"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
