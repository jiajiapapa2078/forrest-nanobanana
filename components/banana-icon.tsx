"use client"

import Image from "next/image"

export function BananaIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/banana.png"
      alt="Banana"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  )
}
