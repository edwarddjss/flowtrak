'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { 
  Building2, 
  CheckCircle2, 
  Clock,
  Users
} from 'lucide-react'

const mockData = [
  { name: 'Week 1', applications: 4 },
  { name: 'Week 2', applications: 8 },
  { name: 'Week 3', applications: 12 },
  { name: 'Week 4', applications: 15 },
  { name: 'Week 5', applications: 20 },
  { name: 'Week 6', applications: 25 },
]

const stats = [
  {
    title: "Active Applications",
    value: "25",
    change: "+12%",
    icon: Building2
  },
  {
    title: "Interview Rate",
    value: "32%",
    change: "+8%",
    icon: Users
  },
  {
    title: "Response Rate",
    value: "45%",
    change: "+15%",
    icon: CheckCircle2
  },
  {
    title: "Avg. Response Time",
    value: "2.5 days",
    change: "-1 day",
    icon: Clock
  }
]

export function DashboardDemo() {
  return (
    <section className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Powerful Analytics Dashboard
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-xl">
          Track your job search progress with beautiful visualizations and actionable insights.
        </p>
      </motion.div>

      <div className="relative mx-auto max-w-[1200px]">
        {/* Browser-like frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-lg shadow-2xl bg-card overflow-hidden"
        >
          {/* Browser Chrome */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-muted/80 backdrop-blur border-b flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full h-6 rounded bg-background/50" />
            </div>
          </div>

          {/* Dashboard Screenshot */}
          <div className="relative aspect-[16/10] mt-12">
            <Image
              src="/images/dashboard-demo.png"
              alt="Dashboard Demo"
              fill
              className="object-cover object-top"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/10" />
          </div>
        </motion.div>

        {/* Shadow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
      </div>
    </section>
  )
}
