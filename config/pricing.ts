// Pricing configuration
// Update these product IDs to match your Creem products

export const PRICING_CONFIG = {
  // Free plan - no product ID needed
  free: {
    priceId: null,
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Nano Banana",
    features: [
      "10 generations per month",
      "Basic image editing",
      "Standard quality output",
      "Community support",
      "Watermarked images",
    ],
    cta: "Get Started",
    popular: false,
  },

  // Pro plan - update this with your Creem product ID
  pro: {
    priceId: "prod_7FzF15t0gCnP2awwIzuYNH", // Creem 产品 ID
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals and creators",
    features: [
      "500 generations per month",
      "Advanced image editing",
      "High quality output",
      "Priority support",
      "No watermarks",
      "Commercial license",
      "API access",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },

  // Enterprise plan - update this with your Creem product ID
  enterprise: {
    priceId: "prod_7FzF15t0gCnP2awwIzuYNH", // Creem 产品 ID (与Pro相同，联系销售时使用)
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and businesses",
    features: [
      "Unlimited generations",
      "Advanced image editing",
      "Ultra quality output",
      "24/7 dedicated support",
      "No watermarks",
      "Extended commercial license",
      "API access",
      "Custom integrations",
      "Team collaboration",
      "Priority processing",
    ],
    cta: "Contact Sales",
    popular: false,
  },
}

// Export as array for easy iteration
export const pricingPlans = [
  PRICING_CONFIG.free,
  PRICING_CONFIG.pro,
  PRICING_CONFIG.enterprise,
]
