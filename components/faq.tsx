"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BananaDecoration } from "@/components/banana-decoration"

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "It's a revolutionary AI image editing model that transforms photos using natural language prompts. This is currently the most powerful image editing model available, with exceptional consistency. It offers superior performance for consistent character editing and scene preservation.",
  },
  {
    question: "How does it work?",
    answer:
      'Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it". It processes your text prompt and generates perfectly edited images.',
  },
  {
    question: "How is it better than competitors?",
    answer:
      "This model excels in character consistency, scene blending, and one-shot editing. Users report it preserves facial features exceptionally well and seamlessly integrates edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent AI influencers.",
  },
  {
    question: "Can I use it for commercial projects?",
    answer:
      "Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.",
  },
  {
    question: "What types of edits can it handle?",
    answer:
      'The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions like "place in a blizzard" or "create the whole face" while maintaining photorealistic quality.',
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can try Nano Banana through our web interface with a generous free tier. Simply upload your image, enter a text prompt describing your desired edits, and watch as Nano Banana AI transforms your photo with incredible accuracy and consistency.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Banana decorations */}
      <BananaDecoration className="absolute top-20 left-8 opacity-30 -rotate-12 hidden lg:block" size="lg" />
      <BananaDecoration className="absolute bottom-20 right-8 opacity-25 rotate-45 hidden lg:block" size="md" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">FAQs</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
