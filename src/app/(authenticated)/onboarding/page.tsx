'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@/lib/hooks/use-user'

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us a bit about yourself'
  },
  {
    id: 'professional',
    title: 'Professional Details',
    description: 'Share your career goals'
  },
  {
    id: 'preferences',
    title: 'Job Preferences',
    description: 'Set your job search preferences'
  }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    yearsOfExperience: '',
    currentRole: '',
    desiredRole: '',
    preferredLocations: '',
    salaryExpectation: '',
    workType: 'full-time', // 'full-time', 'part-time', 'contract', 'internship'
    remotePreference: 'hybrid' // 'remote', 'hybrid', 'onsite'
  })
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClientComponentClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user?.id,
          ...formData,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          onboarding_completed: true
        }
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={e => handleInputChange('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                placeholder="City, State"
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={e => handleInputChange('yearsOfExperience', e.target.value)}
                placeholder="2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentRole">Current Role</Label>
              <Input
                id="currentRole"
                value={formData.currentRole}
                onChange={e => handleInputChange('currentRole', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredRole">Desired Role</Label>
              <Input
                id="desiredRole"
                value={formData.desiredRole}
                onChange={e => handleInputChange('desiredRole', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredLocations">Preferred Locations</Label>
              <Input
                id="preferredLocations"
                value={formData.preferredLocations}
                onChange={e => handleInputChange('preferredLocations', e.target.value)}
                placeholder="San Francisco, New York, Remote"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryExpectation">Expected Salary</Label>
              <Input
                id="salaryExpectation"
                value={formData.salaryExpectation}
                onChange={e => handleInputChange('salaryExpectation', e.target.value)}
                placeholder="120,000"
              />
            </div>
            <div className="space-y-2">
              <Label>Work Type</Label>
              <Select
                value={formData.workType}
                onValueChange={value => handleInputChange('workType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remote Preference</Label>
              <Select
                value={formData.remotePreference}
                onValueChange={value => handleInputChange('remotePreference', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{steps[currentStep].title}</h1>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-background
                  ${index <= currentStep ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
