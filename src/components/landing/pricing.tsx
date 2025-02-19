'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started with your job search",
    features: [
      "Track up to 10 active applications",
      "Basic interview preparation",
      "Application analytics",
      "Email notifications"
    ]
  },
  {
    name: "Pro",
    price: "12",
    description: "For serious job seekers who want to maximize their chances",
    features: [
      "Unlimited applications",
      "Advanced AI interview practice",
      "Detailed analytics and insights",
      "Priority support",
      "Custom application fields",
      "Interview scheduling",
      "Resume tracking"
    ]
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-xl">
          Choose the plan that's right for your job search journey
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex"
          >
            <Card className="flex flex-col p-8 w-full">
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight">${plan.price}</span>
                  <span className="ml-2 text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="mt-8 space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/auth/signin">
                  <Button size="lg" variant={i === 0 ? "outline" : "default"} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
