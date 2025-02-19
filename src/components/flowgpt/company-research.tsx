'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"

interface CompanyResearchProps {
  onResearchAction: (data: {
    companyName: string
    industry: string
    location: string
  }) => Promise<{ success: boolean } | void>
  loading?: boolean
}

export function CompanyResearch({ onResearchAction, loading = false }: CompanyResearchProps) {
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')

  return (
    <div className="space-y-8">
      {/* Company Name Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-base font-medium">Company Name</Label>
          <p className="text-sm text-muted-foreground">
            Enter the name of the company you want to research
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-violet-600 opacity-0 blur transition group-hover:opacity-30" />
          <div className="relative">
            <Input
              placeholder="e.g. Google, Microsoft, Apple"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-10 h-12 rounded-lg bg-muted/50"
            />
            <Building className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Industry Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-base font-medium">Industry</Label>
          <p className="text-sm text-muted-foreground">
            What industry does this company operate in?
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-violet-600 opacity-0 blur transition group-hover:opacity-30" />
          <div className="relative">
            <Input
              placeholder="e.g. Technology, Healthcare, Finance"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="pl-10 h-12 rounded-lg bg-muted/50"
            />
            <Search className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Location Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-base font-medium">Location</Label>
          <p className="text-sm text-muted-foreground">
            Where is this company located?
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-violet-600 opacity-0 blur transition group-hover:opacity-30" />
          <div className="relative">
            <Input
              placeholder="e.g. San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-12 rounded-lg bg-muted/50"
            />
            <Search className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-4"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-violet-600 opacity-30 blur transition group-hover:opacity-70" />
          <Button
            className="relative w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg h-12"
            disabled={!companyName || !industry || !location || loading}
            onClick={() => onResearchAction({ companyName, industry, location })}
          >
            {loading ? 'Researching...' : 'Research Company'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
