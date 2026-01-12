import { Card, CardContent } from "@/components/ui/card"
import { BananaDecoration } from "@/components/banana-decoration"
import { BananaIcon } from "@/components/banana-icon"

const features = [
  {
    title: "Natural Language Editing",
    description:
      "Edit images using simple text prompts. Nano Banana AI understands complex instructions like GPT for images.",
  },
  {
    title: "Character Consistency",
    description:
      "Maintain perfect character details across edits. This model excels at preserving faces and identities.",
  },
  {
    title: "Scene Preservation",
    description: "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to competitors.",
  },
  {
    title: "One-Shot Editing",
    description:
      "Perfect results in a single attempt. Nano Banana solves one-shot image editing challenges effortlessly.",
  },
  {
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows.",
  },
  {
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Banana decorations */}
      <BananaDecoration className="absolute top-20 right-8 opacity-30 rotate-12 hidden lg:block" size="lg" />
      <BananaDecoration className="absolute bottom-20 left-8 opacity-25 -rotate-12 hidden lg:block" size="md" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">Core Features</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Nano Banana?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nano Banana is the most advanced AI image editor available. Revolutionize your photo editing with natural
            language understanding.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <BananaIcon size={24} />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
