import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ImageEditor } from "@/components/image-editor"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ImageEditor />
      <Features />
      <Showcase />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
