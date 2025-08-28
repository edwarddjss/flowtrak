import { ReactNode } from 'react'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { FileText, Search, Clipboard } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="w-full max-w-md space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          {icon || (
            <div className="relative">
              <Clipboard className="h-8 w-8 text-primary absolute opacity-20" style={{ transform: 'rotate(-5deg) translateX(-6px)' }} />
              <FileText className="h-8 w-8 text-primary relative z-10" />
              <Search className="h-4 w-4 text-primary absolute right-0 bottom-0 z-20" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </Card>
  )
} 