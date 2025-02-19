'use client'

import { Card } from '@/components/ui/card'
import { ResponsiveSankey } from '@nivo/sankey'

export function SankeySummary() {
  // Sample data for the Sankey diagram
  const data = {
    nodes: [
      { id: 'Applied', color: '#4CAF50' },
      { id: 'Phone Screen', color: '#2196F3' },
      { id: 'Technical', color: '#9C27B0' },
      { id: 'Onsite', color: '#FF9800' },
      { id: 'Offer', color: '#F44336' },
      { id: 'Accepted', color: '#4CAF50' },
      { id: 'Rejected', color: '#9E9E9E' },
    ],
    links: [
      { source: 'Applied', target: 'Phone Screen', value: 8 },
      { source: 'Applied', target: 'Rejected', value: 4 },
      { source: 'Phone Screen', target: 'Technical', value: 6 },
      { source: 'Phone Screen', target: 'Rejected', value: 2 },
      { source: 'Technical', target: 'Onsite', value: 4 },
      { source: 'Technical', target: 'Rejected', value: 2 },
      { source: 'Onsite', target: 'Offer', value: 3 },
      { source: 'Onsite', target: 'Rejected', value: 1 },
      { source: 'Offer', target: 'Accepted', value: 2 },
    ],
  }

  return (
    <Card className="p-6">
      <div className="h-[400px]">
        <ResponsiveSankey
          data={data}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          align="justify"
          colors={{ scheme: 'category10' }}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.8]],
          }}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1]],
          }}
        />
      </div>
    </Card>
  )
}
