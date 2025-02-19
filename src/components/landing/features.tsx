'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { 
  LineChart, 
  BrainCircuit, 
  Calendar, 
  MessageSquareText,
  Briefcase,
  Target
} from 'lucide-react'

const features = [
  {
    title: "Smart Application Tracking",
    description: "Keep track of every application with automatic status updates, follow-up reminders, and detailed job information.",
    icon: Briefcase
  },
  {
    title: "AI Interview Preparation",
    description: "Practice with our AI interviewer that adapts to the job description and provides personalized feedback.",
    icon: BrainCircuit
  },
  {
    title: "Analytics & Insights",
    description: "Visualize your job search progress with detailed analytics and get insights to improve your strategy.",
    icon: LineChart
  },
  {
    title: "Interview Scheduling",
    description: "Manage all your interviews in one place with calendar integration and automated reminders.",
    icon: Calendar
  },
  {
    title: "AI Resume Feedback",
    description: "Get instant feedback on your resume and tailored suggestions for each job application.",
    icon: MessageSquareText
  },
  {
    title: "Goal Setting & Tracking",
    description: "Set weekly application goals and track your progress with visual dashboards.",
    icon: Target
  }
]

export function Features() {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Everything You Need to Land Your Dream Job
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-xl">
          Powerful features to streamline your job search and boost your chances of success.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="relative group overflow-hidden p-8 hover:shadow-lg transition-all duration-300">
              <div className="absolute -right-12 -top-12 h-48 w-48 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="mb-6 inline-block rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
