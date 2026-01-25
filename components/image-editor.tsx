"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { BananaIcon } from "@/components/banana-icon"
import { LoginWall } from "@/components/login-wall"
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Image from "next/image"

export function ImageEditor() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [generatedText, setGeneratedText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // 检查用户登录状态
  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    // 监听登录状态变化
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null)
          
          // 登录成功后滚动到编辑器
          if (session?.user) {
            setTimeout(() => {
              document.getElementById('editor')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }, 500)
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [supabase])

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt) return
    
    setIsGenerating(true)
    setError(null)
    setGeneratedImages([])
    setGeneratedText(null)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage,
          prompt: prompt,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      // Extract images from response
      if (data.images && data.images.length > 0) {
        const imageUrls = data.images.map((img: any) => img.image_url?.url || img.imageUrl?.url)
        setGeneratedImages(imageUrls.filter(Boolean))
      }
      
      // Also store text response if available
      if (data.result) {
        setGeneratedText(data.result)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  // 显示加载状态
  if (loading) {
    return (
      <section id="editor" className="py-20 bg-secondary/50">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      </section>
    )
  }

  // 未登录显示登录墙
  if (!user) {
    return <LoginWall />
  }

  // 已登录显示完整编辑器
  return (
    <section id="editor" className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Welcome Message */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wide">Get Started</h2>
            {user && (
              <span className="text-sm text-muted-foreground">
                • Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}! 👋
              </span>
            )}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Try The AI Editor</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the power of Nano Banana&apos;s natural language image editing. Transform any photo with simple
            text commands.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BananaIcon size={20} />
                Prompt Engine
              </CardTitle>
              <p className="text-sm text-muted-foreground">Transform your image with AI-powered editing</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Reference Image</label>
                <div
                  className={`relative border-2 border-dashed rounded-lg transition-colors ${
                    isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {uploadedImage ? (
                    <div className="relative aspect-video">
                      <Image
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded image"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-foreground/80 rounded-full hover:bg-foreground transition-colors"
                      >
                        <BananaIcon size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <BananaIcon size={32} />
                      </div>
                      <p className="text-sm text-foreground font-medium mb-1">
                        Drop your image here or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Main Prompt</label>
                <Textarea
                  placeholder="Describe how you want to transform your image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none bg-background"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!uploadedImage || !prompt || isGenerating}
                className="w-full bg-primary text-primary-foreground hover:bg-accent gap-2"
              >
                {isGenerating ? (
                  <>
                    <BananaIcon size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Now
                    <BananaIcon size={16} />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BananaIcon size={20} />
                Output Gallery
              </CardTitle>
              <p className="text-sm text-muted-foreground">Your ultra-fast AI creations appear here instantly</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-secondary/50 border border-border min-h-[400px] flex flex-col items-center justify-center p-4">
                {isGenerating ? (
                  <div className="text-center">
                    <BananaIcon size={48} className="mx-auto mb-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">Generating your image...</p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4 mx-auto">
                      <BananaIcon size={32} />
                    </div>
                    <p className="text-foreground font-medium mb-1">Generation Failed</p>
                    <p className="text-sm text-destructive text-center px-4">{error}</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="w-full space-y-4">
                    {generatedImages.map((imageUrl, index) => (
                      <div key={index} className="relative w-full">
                        <Image
                          src={imageUrl}
                          alt={`Generated image ${index + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-auto rounded-lg"
                          unoptimized
                        />
                      </div>
                    ))}
                    {generatedText && (
                      <div className="prose prose-sm max-w-none text-foreground bg-background/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap text-sm">{generatedText}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <BananaIcon size={32} />
                    </div>
                    <p className="text-foreground font-medium mb-1">Ready for instant generation</p>
                    <p className="text-sm text-muted-foreground text-center px-4">
                      Enter your prompt and unleash the power
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Tips */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium">Pro tip:</span> Try prompts like &quot;make it more colorful&quot;, &quot;add a sunset background&quot;, or &quot;change to watercolor style&quot;
          </p>
        </div>
      </div>
    </section>
  )
}
