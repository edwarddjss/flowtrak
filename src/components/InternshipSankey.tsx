'use client'

import { useMemo } from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import { Application } from '@/app/client-actions'
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
          { id: 'Applied', nodeColor: '#3B82F6', label: 'Applied', value: 0 },
          { id: 'Interview', nodeColor: '#8B5CF6', label: 'Interview', value: 0 },
          { id: 'Offer', nodeColor: '#22C55E', label: 'Offer', value: 0 },
          { id: 'Rejected', nodeColor: '#EF4444', label: 'Rejected', value: 0 }
        ],
        links: [
          { source: 'Applied', target: 'Interview', value: 0.1 },
          { source: 'Applied', target: 'Rejected', value: 0.1 },
          { source: 'Interview', target: 'Offer', value: 0.1 }
        ]
      }
    }

    // Create node map for counting
    const nodeValues: { [key: string]: number } = {
      'Applied': 0,
      'Interview': 0,
      'Offer': 0,
      'Rejected': 0
    }

    const nodes = [
      { id: 'Applied', nodeColor: '#3B82F6', label: 'Applied' },      // blue-500
      { id: 'Interview', nodeColor: '#8B5CF6', label: 'Interview' },  // violet-500
      { id: 'Offer', nodeColor: '#22C55E', label: 'Offer' },         // green-500
      { id: 'Rejected', nodeColor: '#EF4444', label: 'Rejected' }     // red-500
    ]

    const statusMap = {
      applied: 'Applied',
      interviewing: 'Interview',
      interview: 'Interview',
      offer: 'Offer',
      accepted: 'Offer',
      rejected: 'Rejected'
    }

    const transitions: { [key: string]: number } = {}
    
    applications.forEach(app => {
      const currentStatus = statusMap[app.status.toLowerCase() as keyof typeof statusMap] || 'Applied'
      const prevStatus = app.previous_status ? 
        statusMap[app.previous_status.toLowerCase() as keyof typeof statusMap] : null

      // Count nodes
      nodeValues[currentStatus] = (nodeValues[currentStatus] || 0) + 1

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

    // Apply counts to nodes
    nodes.forEach(node => {
      node.value = nodeValues[node.id] || 0
    })

    // Create links with value of at least 0.5 for visibility
    const links = Object.entries(transitions).map(([key, value]) => {
      const [source, target] = key.split('->')
      return {
        source,
        target,
        value: Math.max(value, 0.5) // Ensure minimum value for visibility
      }
    })

    // Add minimal links to ensure all nodes are visible
    nodes.forEach(node => {
      if (!links.some(link => link.source === node.id || link.target === node.id)) {
        if (node.id !== 'Applied') {
          links.push({
            source: 'Applied',
            target: node.id,
            value: 0.5
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
        nodeOpacity={0.9}
        nodeHoverOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderRadius={4}
        linkOpacity={0.5}
        linkHoverOpacity={0.8}
        linkHoverOthersOpacity={0.1}
        linkBlendMode="normal"
        enableLinkGradient={true}
        label={node => `${node.label} (${node.value || 0})`}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
        animate={true}
        motionConfig={{
          mass: 1,
          tension: 120,
          friction: 26,
          clamp: false,
          precision: 0.01,
          velocity: 0
        }}
        tooltip={({ node, link }) => (
          <div className="rounded-lg border bg-card px-4 py-3 shadow-xl transition-all">
            {node && (
              <div className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: node.nodeColor }} 
                />
                <div>
                  <span className="font-semibold">{node.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{node.value || 0} applications</span>
                    {node.id !== 'Applied' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted">
                        {Math.round(((node.value || 0) / applications.length) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {link && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: nodes.find(n => n.id === link.source)?.nodeColor }} 
                  />
                  <span className="font-semibold">{link.source}</span>
                  <span className="text-muted-foreground">→</span>
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: nodes.find(n => n.id === link.target)?.nodeColor }} 
                  />
                  <span className="font-semibold">{link.target}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pl-1">
                  <span>{Math.round(link.value)} applications</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted">
                    {Math.round((link.value / applications.length) * 100)}% of total
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}
