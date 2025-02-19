'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface FeedbackData {
  category: string
  score: number
}

export function InterviewFeedbackChart({ data }: { data: FeedbackData[] }) {
  const chartRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove()

    // Chart dimensions
    const width = 400
    const height = 400
    const margin = 50
    const radius = Math.min(width, height) / 2 - margin

    // Create SVG
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`)

    // Scales
    const angleScale = d3.scalePoint()
      .domain(data.map(d => d.category))
      .range([0, 2 * Math.PI])

    const radiusScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius])

    // Draw background circles
    const circles = [20, 40, 60, 80, 100]
    circles.forEach(value => {
      svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radiusScale(value))
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.2)
    })

    // Draw axis lines
    data.forEach(metric => {
      const angle = angleScale(metric.category)!
      const x2 = radius * Math.cos(angle - Math.PI/2)
      const y2 = radius * Math.sin(angle - Math.PI/2)
      
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.3)

      // Add labels
      svg.append('text')
        .attr('x', (radius + 20) * Math.cos(angle - Math.PI/2))
        .attr('y', (radius + 20) * Math.sin(angle - Math.PI/2))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'currentColor')
        .text(metric.category)
    })

    // Create line generator
    const lineGenerator = d3.lineRadial<typeof data[0]>()
      .angle(d => angleScale(d.category)! - Math.PI/2)
      .radius(d => radiusScale(d.score))

    // Draw data line
    const path = svg.append('path')
      .datum(data)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2)

    // Add data points
    svg.selectAll('circle.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => radiusScale(d.score) * Math.cos(angleScale(d.category)! - Math.PI/2))
      .attr('cy', d => radiusScale(d.score) * Math.sin(angleScale(d.category)! - Math.PI/2))
      .attr('r', 4)
      .attr('fill', 'hsl(var(--primary))')

    // Add value labels
    svg.selectAll('text.value')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value')
      .attr('x', d => (radiusScale(d.score) + 15) * Math.cos(angleScale(d.category)! - Math.PI/2))
      .attr('y', d => (radiusScale(d.score) + 15) * Math.sin(angleScale(d.category)! - Math.PI/2))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'currentColor')
      .text(d => d.score)

    // Animate the chart
    const pathLength = path.node()!.getTotalLength()
    path
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0)

  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h3 className="font-semibold mb-6 text-center">Performance Radar</h3>
        <div className="flex justify-center">
          <svg ref={chartRef} />
        </div>
      </Card>
    </motion.div>
  )
}
