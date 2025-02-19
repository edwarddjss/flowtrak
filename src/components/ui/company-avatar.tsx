import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CompanyAvatarProps {
  company: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12'
}

export function CompanyAvatar({ company, className, size = 'md' }: CompanyAvatarProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [showFallback, setShowFallback] = useState(false)

  // Clean company name for URL (remove spaces, special chars, etc)
  const cleanCompanyName = company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()

  // Try to get domain from common company domains
  const domains = [
    `${cleanCompanyName}.com`,
    `${cleanCompanyName}.ai`,
    `${cleanCompanyName}.co`,
    `${cleanCompanyName}.io`,
    `${cleanCompanyName}.org`,
    `${cleanCompanyName}.net`
  ]

  const handleImageError = () => {
    if (currentUrlIndex < domains.length - 1) {
      setCurrentUrlIndex(prev => prev + 1)
    } else {
      setShowFallback(true)
    }
  }

  const logoUrl = `https://logo.clearbit.com/${domains[currentUrlIndex]}`

  return (
    <Avatar className={cn(SIZES[size], className)}>
      {!showFallback && (
        <AvatarImage 
          src={logoUrl} 
          alt={`${company} logo`}
          onError={handleImageError}
        />
      )}
      <AvatarFallback 
        className={cn(
          "bg-primary/10 font-semibold",
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        )}
      >
        {company.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  )
}
