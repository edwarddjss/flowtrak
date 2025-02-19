'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    quote: "flowtrak helped me land my dream job at a top tech company. The AI interview practice was a game-changer.",
    author: "Sarah Chen",
    title: "Software Engineer",
    image: "/testimonials/sarah.jpg"
  },
  {
    quote: "I was able to track all my applications effortlessly and the analytics helped me understand where to focus my efforts.",
    author: "Michael Rodriguez",
    title: "Product Manager",
    image: "/testimonials/michael.jpg"
  },
  {
    quote: "The interview preparation features gave me the confidence I needed. Highly recommend for any job seeker.",
    author: "Emily Thompson",
    title: "Data Scientist",
    image: "/testimonials/emily.jpg"
  }
]

export function Testimonials() {
  return (
    <section className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Loved by Job Seekers
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-xl">
          Don't just take our word for it. Here's what our users have to say.
        </p>
      </motion.div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative overflow-hidden rounded-lg border bg-background p-8"
          >
            <div className="relative z-20">
              <div className="relative">
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
              </div>
              <div className="mt-6 flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.image} alt={testimonial.author} />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
