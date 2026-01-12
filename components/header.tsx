"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BananaDecoration } from "@/components/banana-decoration"
import { BananaIcon } from "@/components/banana-icon"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BananaDecoration size="sm" className="w-8 h-8" />
            <span className="font-bold text-xl text-foreground">Nano Banana</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#editor" className="text-muted-foreground hover:text-foreground transition-colors">
              Editor
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
              Showcase
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm">
              Log in
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent">
              Try Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <BananaIcon size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <Link href="#editor" className="text-muted-foreground hover:text-foreground transition-colors">
              Editor
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
              Showcase
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Log in
              </Button>
              <Button size="sm" className="flex-1 bg-primary text-primary-foreground">
                Try Free
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
