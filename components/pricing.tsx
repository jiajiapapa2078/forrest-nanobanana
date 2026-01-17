"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BananaIcon } from "@/components/banana-icon"
import { BananaDecoration } from "@/components/banana-decoration"
import { pricingPlans } from "@/config/pricing"

export function Pricing() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    // Clear any previous errors
    setError(null)

    if (!priceId) {
      // Free plan - just redirect to editor (no loading state needed)
      window.location.href = "#editor"
      return
    }

    if (planName === "Enterprise") {
      // Contact sales (no loading state needed)
      window.location.href = "mailto:sales@nanobanana.ai"
      return
    }

    // For Pro plan, use direct Creem payment link
    // Format: https://www.creem.io/test/payment/{product_id}
    const paymentUrl = `https://www.creem.io/test/payment/${priceId}`
    window.location.href = paymentUrl
  }

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Banana decorations */}
      <BananaDecoration className="absolute top-20 left-8 opacity-30 -rotate-12 hidden lg:block" size="lg" />
      <BananaDecoration className="absolute bottom-20 right-8 opacity-25 rotate-45 hidden lg:block" size="md" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">Pricing</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Perfect Plan
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our powerful AI image editing capabilities.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-center text-sm">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border bg-card hover:shadow-xl transition-all duration-300 ${
                plan.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <BananaIcon size={32} />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/ {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <BananaIcon size={16} className="mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={isLoading === plan.priceId}
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-accent"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === plan.priceId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h4 className="text-xl font-semibold text-foreground mb-4">Have questions?</h4>
          <p className="text-muted-foreground mb-6">
            Check out our <a href="#faq" className="text-primary hover:underline">FAQ section</a> or{" "}
            <a href="mailto:support@nanobanana.ai" className="text-primary hover:underline">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
