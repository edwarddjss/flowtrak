'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Briefcase, Building, GraduationCap, Clock, CheckCircle, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentCard } from '@/components/ui/content-card'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils'

interface TargetJobProps {
  onSubmitAction: (data: {
    title: string
    company: string
    experienceLevel: 'entry' | 'mid' | 'senior'
    yearsRequired: string
  }) => Promise<{ success: boolean } | void>
  loading?: boolean
}

const experienceLevels = [
  {
    value: 'entry',
    label: 'Entry Level',
    description: '0-2 years of experience',
    icon: GraduationCap,
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    value: 'mid',
    label: 'Mid Level',
    description: '2-5 years of experience',
    icon: Clock,
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    value: 'senior',
    label: 'Senior Level',
    description: '5+ years of experience',
    icon: Briefcase,
    color: 'from-purple-500/20 to-pink-500/20'
  }
]

const popularCompanies = [
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta',
  'Netflix', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn'
]

const popularTitles = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Engineer',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer'
]

export function TargetJob({ onSubmitAction, loading = false }: TargetJobProps) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior'>('entry')
  const [yearsRequired, setYearsRequired] = useState('')
  const [showSuggestions, setShowSuggestions] = useState<'title' | 'company' | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title && company && experienceLevel && yearsRequired) {
      try {
        await onSubmitAction({
          title,
          company,
          experienceLevel,
          yearsRequired
        })
        setSubmitted(true)
      } catch (error) {
        console.error('Error submitting target job:', error)
      }
    }
  }

  const filteredTitles = popularTitles.filter(t => 
    t.toLowerCase().includes(title.toLowerCase())
  ).slice(0, 5)

  const filteredCompanies = popularCompanies.filter(c => 
    c.toLowerCase().includes(company.toLowerCase())
  ).slice(0, 5)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Job Title Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <Label className="text-lg font-medium">Target Position</Label>
        </div>

        <div className="relative">
          <ContentCard
            gradient
            glass
            interactive
            className="overflow-visible"
          >
            <div className="relative">
              <Input
                placeholder="e.g. Software Engineer"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setShowSuggestions('title')
                }}
                onFocus={() => setShowSuggestions('title')}
                className="h-12 bg-background/50 border-muted/30 pl-10"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            </div>

            <AnimatePresence>
              {showSuggestions === 'title' && title && filteredTitles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 z-50"
                >
                  <ContentCard className="p-2 shadow-lg">
                    {filteredTitles.map((suggestion, i) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setTitle(suggestion)
                          setShowSuggestions(null)
                        }}
                        className="flex items-center gap-2 w-full p-2 text-sm rounded-md hover:bg-primary/10 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-primary" />
                        {suggestion}
                      </button>
                    ))}
                  </ContentCard>
                </motion.div>
              )}
            </AnimatePresence>
          </ContentCard>
        </div>
      </div>

      {/* Company Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          <Label className="text-lg font-medium">Target Company</Label>
        </div>

        <div className="relative">
          <ContentCard
            gradient
            glass
            interactive
            className="overflow-visible"
          >
            <div className="relative">
              <Input
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value)
                  setShowSuggestions('company')
                }}
                onFocus={() => setShowSuggestions('company')}
                className="h-12 bg-background/50 border-muted/30 pl-10"
              />
              <Building className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            </div>

            <AnimatePresence>
              {showSuggestions === 'company' && company && filteredCompanies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 z-50"
                >
                  <ContentCard className="p-2 shadow-lg">
                    {filteredCompanies.map((suggestion, i) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setCompany(suggestion)
                          setShowSuggestions(null)
                        }}
                        className="flex items-center gap-2 w-full p-2 text-sm rounded-md hover:bg-primary/10 transition-colors"
                      >
                        <Building className="w-4 h-4 text-primary" />
                        {suggestion}
                      </button>
                    ))}
                  </ContentCard>
                </motion.div>
              )}
            </AnimatePresence>
          </ContentCard>
        </div>
      </div>

      {/* Experience Level Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <Label className="text-lg font-medium">Experience Level</Label>
        </div>

        <RadioGroup
          value={experienceLevel}
          onValueChange={(value: 'entry' | 'mid' | 'senior') => setExperienceLevel(value)}
          className="grid gap-4 md:grid-cols-3"
        >
          {experienceLevels.map((level) => {
            const Icon = level.icon
            return (
              <ContentCard
                key={level.value}
                gradient
                glass
                interactive
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all",
                  experienceLevel === level.value && "ring-2 ring-primary"
                )}
              >
                <RadioGroupItem
                  value={level.value}
                  id={level.value}
                  className="sr-only"
                />
                <Label
                  htmlFor={level.value}
                  className="block p-6 cursor-pointer"
                >
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-0 rounded-full bg-gradient-to-br opacity-20",
                      level.color
                    )} />
                    <div className="relative bg-background/50 rounded-full p-3 w-fit backdrop-blur-sm ring-1 ring-white/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {level.description}
                    </div>
                  </div>

                  {experienceLevel === level.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                    </motion.div>
                  )}
                </Label>
              </ContentCard>
            )
          })}
        </RadioGroup>
      </div>

      {/* Years Required Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <Label className="text-lg font-medium">Years Required</Label>
        </div>

        <ContentCard
          gradient
          glass
          interactive
        >
          <Input
            type="number"
            placeholder="e.g. 3"
            value={yearsRequired}
            onChange={(e) => setYearsRequired(e.target.value)}
            className="h-12 bg-background/50 border-muted/30"
            min="0"
            max="20"
          />
        </ContentCard>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-12 relative overflow-hidden group"
          disabled={!title || !company || !experienceLevel || !yearsRequired || loading}
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? 'Saving...' : 'Save Target Job'}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-80" />
        </Button>

        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-500 flex items-center gap-2 mt-4"
          >
            <CheckCircle className="w-4 h-4" />
            Target job preferences saved successfully
          </motion.p>
        )}
      </div>
    </form>
  )
}
