'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Chrome, CheckCircle2, ArrowRight } from 'lucide-react'

export function ChromeExtensionPromo() {
  return (
    <section id="chrome-extension" className="relative overflow-hidden border-y bg-muted/30">
      <div className="container py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <span className="bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2">
              <Chrome className="h-4 w-4" />
              Chrome Extension
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Your Job Search Assistant
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-xl">
            Track applications across any job board with one click. Never lose track of where you applied.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="relative overflow-hidden border-primary/10 bg-primary/5">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6">One-Click Application Tracking</h3>
                <ul className="space-y-5">
                  {[
                    "Automatic job detail extraction",
                    "Works with LinkedIn, Indeed & more",
                    "Track application status & follow-ups",
                    "Sync with flowtrak dashboard",
                    "Smart duplicate detection",
                    "Custom notes & reminders"
                  ].map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Add to Chrome - It's Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 h-48 w-48 bg-primary/10 rounded-full blur-3xl" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 relative"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border bg-background">
              <Image
                src="/images/chrome-extension-demo.png"
                alt="Chrome Extension Demo"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Browser Chrome Decoration */}
            <div className="absolute -top-3 -left-3 -right-3 h-12 bg-muted/80 backdrop-blur rounded-t-lg border-b flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full h-6 rounded bg-background/50" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
