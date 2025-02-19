'use client'

import { useMemo } from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import { Application } from '@/types'
import { Card } from './ui/card'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InternshipSankeyProps {
  applications: Application[]
  isLoading?: boolean
}

export function InternshipSankey({ applications = [], isLoading }: InternshipSankeyProps) {
  const { nodes, links } = useMemo(() => {
    if (!applications?.length) {
      return {
        nodes: [
          { id: 'Applied', nodeColor: '#3B82F6', label: 'Applied' },
          { id: 'Interview', nodeColor: '#8B5CF6', label: 'Interview' },
          { id: 'Offer', nodeColor: '#22C55E', label: 'Offer' },
          { id: 'Rejected', nodeColor: '#EF4444', label: 'Rejected' }
        ],
        links: [
          { source: 'Applied', target: 'Interview', value: 0.1 },
          { source: 'Applied', target: 'Rejected', value: 0.1 },
          { source: 'Interview', target: 'Offer', value: 0.1 }
        ]
      }
    }

    const nodes = [
      { id: 'Applied', nodeColor: '#3B82F6', label: 'Applied' },      // blue-500
      { id: 'Interview', nodeColor: '#8B5CF6', label: 'Interview' },  // violet-500
      { id: 'Offer', nodeColor: '#22C55E', label: 'Offer' },         // green-500
      { id: 'Rejected', nodeColor: '#EF4444', label: 'Rejected' }     // red-500
    ]

    const statusMap = {
      applied: 'Applied',
      interview: 'Interview',
      offer: 'Offer',
      rejected: 'Rejected'
    }

    const transitions: { [key: string]: number } = {}
    
    applications.forEach(app => {
      const currentStatus = statusMap[app.status.toLowerCase() as keyof typeof statusMap] || 'Applied'
      const prevStatus = app.previous_status ? 
        statusMap[app.previous_status.toLowerCase() as keyof typeof statusMap] : null

      if (prevStatus) {
        const key = `${prevStatus}->${currentStatus}`
        transitions[key] = (transitions[key] || 0) + 1
      } else {
        if (currentStatus !== 'Applied') {
          const key = `Applied->${currentStatus}`
          transitions[key] = (transitions[key] || 0) + 1
        }
      }
    })

    const links = Object.entries(transitions).map(([key, value]) => {
      const [source, target] = key.split('->')
      return {
        source,
        target,
        value: Math.max(value, 0.1) // Ensure minimum value for visibility
      }
    })

    // Add minimal links to ensure all nodes are visible
    nodes.forEach(node => {
      if (!links.some(link => link.source === node.id || link.target === node.id)) {
        if (node.id !== 'Applied') {
          links.push({
            source: 'Applied',
            target: node.id,
            value: 0.1
          })
        }
      }
    })

    return { nodes, links }
  }, [applications])

  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading application data...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="h-[400px]">
      <ResponsiveSankey
        data={{ nodes, links }}
        margin={{ top: 40, right: 160, bottom: 40, left: 160 }}
        align="justify"
        colors={node => node.nodeColor}
        nodeOpacity={0.8}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderRadius={3}
        linkOpacity={0.5}
        linkHoverOthersOpacity={0.1}
        linkBlendMode="multiply"
        enableLinkGradient={true}
        label={node => node.label}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
        animate={true}
        motionConfig="gentle"
        tooltip={({ node, link }) => (
          <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-lg">
            {node && (
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: node.nodeColor }} 
                />
                <div>
                  <span className="font-medium">{node.label}</span>
                  <span className="text-muted-foreground"> • </span>
                  <span className="text-muted-foreground">{node.value || 0} applications</span>
                </div>
              </div>
            )}
            {link && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{link.source}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{link.target}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{Math.round(link.value)} applications</span>
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}
