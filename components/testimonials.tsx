import { Card, CardContent } from "@/components/ui/card"
import { BananaDecoration } from "@/components/banana-decoration"
import { BananaIcon } from "@/components/banana-icon"

const testimonials = [
  {
    name: "AIArtistPro",
    role: "Digital Creator",
    avatar: "🎨",
    content:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of the competition!",
  },
  {
    name: "ContentCreator",
    role: "UGC Specialist",
    avatar: "📱",
    content:
      "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
  },
  {
    name: "PhotoEditor",
    role: "Professional Editor",
    avatar: "📷",
    content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Banana decorations */}
      <BananaDecoration className="absolute top-16 right-16 opacity-30 rotate-12 hidden lg:block" size="md" />
      <BananaDecoration className="absolute bottom-16 left-16 opacity-25 -rotate-45 hidden lg:block" size="sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">User Reviews</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Creators Are Saying</h3>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <BananaIcon key={i} size={16} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
