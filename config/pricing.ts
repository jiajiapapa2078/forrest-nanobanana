// Pricing configuration
// Update these product IDs to match your payment provider

export const PRICING_CONFIG = {
  // Basic plan
  basic: {
    name: "Basic",
    price: "$12",
    originalPrice: "$180",
    yearlyPrice: "$144",
    period: "per month",
    description: "Perfect for individuals and light users",
    credits: "2400 credits/year",
    images: "100 high-quality images/month",
    features: [
      "2400 credits/year",
      "100 high-quality images/month",
      "All style templates included",
      "Standard generation speed",
      "Basic customer support",
      "JPG/PNG format downloads",
      "Commercial Use License",
    ],
    cta: "Get Started",
    popular: false,
    paypalLink: null, // Free or contact sales
  },

  // Pro plan - Most Popular
  pro: {
    name: "Pro",
    price: "$19.50",
    originalPrice: "$468",
    yearlyPrice: "$234",
    period: "per month",
    description: "For professional creators and teams",
    credits: "9600 credits/year",
    images: "400 high-quality images/month",
    features: [
      "9600 credits/year",
      "400 high-quality images/month",
      "Support Seedream-4 Model",
      "Support Nanobanana-Pro Model",
      "All style templates included",
      "Priority generation queue",
      "Priority customer support",
      "JPG/PNG/WebP format downloads",
      "Batch generation feature",
      "Image editing tools (Coming soon)",
      "Commercial Use License",
    ],
    cta: "Start Pro Plan",
    popular: true,
    paypalLink: "https://www.paypal.com/ncp/payment/A8QJ6MZG7TU84",
    badge: "⚡ SAVE 50%",
  },

  // Max plan
  max: {
    name: "Max",
    price: "$80",
    originalPrice: "$1920",
    yearlyPrice: "$960",
    period: "per month",
    description: "Designed for large enterprises and professional studios",
    credits: "43200 credits/year",
    images: "1800 high-quality images/month",
    features: [
      "43200 credits/year",
      "1800 high-quality images/month",
      "Support Seedream-4 Model",
      "Support Nanobanana-Pro Model",
      "All style templates included",
      "Fastest generation speed",
      "Dedicated account manager",
      "All format downloads",
      "Batch generation feature",
      "Professional editing suite (Coming soon)",
      "Commercial Use License",
    ],
    cta: "Contact Sales",
    popular: false,
    paypalLink: null, // Contact sales
    badge: "⚡ SAVE 50%",
  },
}

// Export as array for easy iteration
export const pricingPlans = [
  PRICING_CONFIG.basic,
  PRICING_CONFIG.pro,
  PRICING_CONFIG.max,
]
