import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BananaDecoration } from "@/components/banana-decoration"
import { BananaIcon } from "@/components/banana-icon"
import Image from "next/image"

const showcaseItems = [
  {
    image: "/ai-generated-mountain-landscape-with-snow-peaks.jpg",
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
  },
  {
    image: "/ai-generated-beautiful-garden-with-flowers.jpg",
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Nano Banana technology",
  },
  {
    image: "/ai-generated-tropical-beach-sunset.jpg",
    title: "Real-time Beach Synthesis",
    description: "Nano Banana delivers photorealistic results at lightning speed",
  },
  {
    image: "/ai-generated-northern-lights-aurora.jpg",
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with Nano Banana AI",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Banana decorations */}
      <BananaDecoration className="absolute top-10 left-12 opacity-40 -rotate-12 hidden lg:block" size="md" />
      <BananaDecoration className="absolute bottom-10 right-12 opacity-35 rotate-45 hidden lg:block" size="lg" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">Showcase</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Lightning-Fast AI Creations</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">See what Nano Banana generates in milliseconds</p>
        </div>

        {/* Showcase Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {showcaseItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/90 backdrop-blur-sm">
                  <BananaIcon size={16} />
                  <span className="text-xs font-medium text-background">Nano Banana Speed</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Experience the power of Nano Banana yourself</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent gap-2">
            <BananaIcon size={20} />
            Try Nano Banana Generator
          </Button>
        </div>
      </div>
    </section>
  )
}
