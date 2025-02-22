import Image from 'next/image'
import { cn } from '@/lib/utils'

const COMPANY_LOGOS: Record<string, { logo: string; bg: string }> = {
  'Amazon': {
    logo: '/logos/amazon.svg',
    bg: 'bg-[#232F3E]'
  },
  'Google': {
    logo: '/logos/google.svg',
    bg: 'bg-white'
  },
  'Meta': {
    logo: '/logos/meta.svg',
    bg: 'bg-[#0668E1]'
  },
  'Microsoft': {
    logo: '/logos/microsoft.svg',
    bg: 'bg-white'
  },
  'Apple': {
    logo: '/logos/apple.svg',
    bg: 'bg-black'
  }
}

interface CompanyLogoProps {
  company: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12'
}

export function CompanyLogo({ company, size = 'md' }: CompanyLogoProps) {
  const companyInfo = COMPANY_LOGOS[company]

  if (!companyInfo) {
    return (
      <div className={cn(
        "rounded-full flex items-center justify-center bg-primary/10 text-primary font-semibold",
        SIZES[size]
      )}>
        {company.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center overflow-hidden",
      companyInfo.bg,
      SIZES[size]
    )}>
      <Image
        src={companyInfo.logo}
        alt={`${company} logo`}
        width={size === 'sm' ? 20 : size === 'md' ? 24 : 32}
        height={size === 'sm' ? 20 : size === 'md' ? 24 : 32}
        className="object-contain"
      />
    </div>
  )
}

interface ApplicationCardProps {
  id: string
  company: string
  role: string
  time: string
  status: string
  onClick?: () => void
}

export function ApplicationCard({ id, company, role, time, status, onClick }: ApplicationCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
    >
      <CompanyLogo company={company} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{company}</span>
          <span className="text-xs text-muted-foreground">· {role}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{time} ago</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10">{status}</span>
        </div>
      </div>
    </button>
  )
}

