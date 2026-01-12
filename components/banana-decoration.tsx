"use client"

import { useId } from "react"

export function BananaDecoration({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const gradientId = useId()
  const tipId = useId()
  
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE135" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#E6B800" />
          </linearGradient>
          <linearGradient id={tipId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#6B5344" />
          </linearGradient>
        </defs>
        {/* Banana body */}
        <path
          d="M20 70 Q10 50 25 25 Q40 5 60 10 Q80 15 85 35 Q90 55 75 70 Q60 85 40 80 Q25 78 20 70"
          fill={`url(#${gradientId})`}
          stroke="#D4A800"
          strokeWidth="1"
        />
        {/* Banana tip */}
        <ellipse cx="28" cy="22" rx="6" ry="4" fill={`url(#${tipId})`} transform="rotate(-30 28 22)" />
        {/* Banana stem */}
        <path d="M75 68 Q82 72 85 78" fill="none" stroke="#6B5344" strokeWidth="4" strokeLinecap="round" />
        {/* Highlight */}
        <path
          d="M35 35 Q45 25 55 30"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function BananaBunch({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <BananaDecoration className="absolute -rotate-12" size="md" />
      <BananaDecoration className="absolute left-8 top-4 rotate-12" size="sm" />
      <BananaDecoration className="absolute left-4 top-10 rotate-45" size="sm" />
    </div>
  )
}
