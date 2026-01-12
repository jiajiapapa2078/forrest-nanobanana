import { Button } from "@/components/ui/button"
import { BananaDecoration } from "@/components/banana-decoration"
import { BananaIcon } from "@/components/banana-icon"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Banana decorations */}
      <BananaDecoration className="absolute top-24 left-8 opacity-60 -rotate-12 hidden lg:block" size="lg" />
      <BananaDecoration className="absolute top-40 right-12 opacity-50 rotate-45 hidden lg:block" size="md" />
      <BananaDecoration className="absolute bottom-20 left-1/4 opacity-40 rotate-12 hidden md:block" size="sm" />
      <BananaDecoration className="absolute top-60 right-1/4 opacity-30 -rotate-45 hidden md:block" size="sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Announcement Banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
            <BananaIcon size={20} />
            <span className="text-sm font-medium text-foreground">The AI model that outperforms Flux Kontext</span>
            <BananaIcon size={16} />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">Nano Banana</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
            Transform any image with simple text prompts. Nano Banana&apos;s advanced model delivers consistent
            character editing and scene preservation that surpasses the competition.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent gap-2 text-lg px-8 py-6">
              <BananaIcon size={20} />
              Start Editing
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6 bg-transparent">
              View Examples
              <BananaIcon size={20} />
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <BananaIcon size={16} />
              <span className="text-sm text-foreground">One-shot editing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <BananaIcon size={16} />
              <span className="text-sm text-foreground">Multi-image support</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <BananaIcon size={16} />
              <span className="text-sm text-foreground">Natural language</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
