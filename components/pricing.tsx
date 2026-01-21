"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BananaIcon } from "@/components/banana-icon"
import { BananaDecoration } from "@/components/banana-decoration"
import { pricingPlans } from "@/config/pricing"

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  const handleSubscribe = (plan: typeof pricingPlans[0]) => {
    if (plan.name === "Basic") {
      // Redirect to editor for basic plan
      window.location.href = "#editor"
      return
    }

    if (plan.name === "Max" || !plan.paypalLink) {
      // Contact sales for Max plan
      window.location.href = "mailto:sales@nanobanana.ai"
      return
    }

    // Redirect to PayPal for Pro plan
    if (plan.paypalLink) {
      window.open(plan.paypalLink, "_blank")
    }
  }

  return (
    <section id="pricing" className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      {/* Banana decorations */}
      <BananaDecoration className="absolute top-20 left-8 opacity-30 -rotate-12 hidden lg:block" size="lg" />
      <BananaDecoration className="absolute bottom-20 right-8 opacity-25 rotate-45 hidden lg:block" size="md" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🍌 Limited Time: Save 50% with Annual Billing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlimited creativity starts here
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-secondary rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly (Save 50%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 bg-card hover:shadow-2xl transition-all duration-300 ${
                plan.popular
                  ? "border-primary scale-105 shadow-xl"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}
              
              {plan.badge && (
                <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg rotate-12">
                  {plan.badge}
                </div>
              )}

              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                
                {billingCycle === "yearly" ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">/ {plan.period}</span>
                    </div>
                    <div className="text-sm">
                      <span className="line-through text-muted-foreground">{plan.originalPrice}</span>
                      <span className="text-primary font-bold ml-2">{plan.yearlyPrice}/year</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/ {plan.period}</span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{plan.credits}</div>
                  <div className="text-sm text-muted-foreground mt-1">{plan.images}</div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <BananaIcon size={16} className="mt-1 flex-shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-6 text-base font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                What are credits and how do they work?
              </h4>
              <p className="text-muted-foreground">
                2 credits generate 1 high-quality image. Credits are automatically refilled at the start of each billing cycle - monthly for monthly plans, all at once for yearly plans.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                Can I change my plan anytime?
              </h4>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                Do unused credits roll over?
              </h4>
              <p className="text-muted-foreground">
                Monthly plan credits do not roll over to the next month. Yearly plan credits are valid for the entire subscription period.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                What payment methods are supported?
              </h4>
              <p className="text-muted-foreground">
                We support PayPal and various other payment methods. All payments are processed through secure third-party payment platforms.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Have more questions? We're here to help
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:support@nanobanana.ai">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
