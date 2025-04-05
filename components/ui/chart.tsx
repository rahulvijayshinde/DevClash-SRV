"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("h-full w-full", className)} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    content?: React.ReactNode
  }
>(({ className, content, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    {content}
  </div>
))
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props} />
  ),
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltipSeries = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />,
)
ChartTooltipSeries.displayName = "ChartTooltipSeries"

const ChartTooltipItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string
    value?: string | number
    color?: string
  }
>(({ className, label, value, color, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center justify-between gap-2", className)} {...props}>
    <div className="flex items-center gap-1">
      {color && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
    {value && <span className="text-xs font-medium">{value}</span>}
  </div>
))
ChartTooltipItem.displayName = "ChartTooltipItem"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap items-center gap-4 pt-2", className)} {...props} />
  ),
)
ChartLegend.displayName = "ChartLegend"

const ChartLegendItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    name?: string
    color?: string
  }
>(({ className, name, color, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
    {color && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
    {name && <span className="text-sm text-muted-foreground">{name}</span>}
  </div>
))
ChartLegendItem.displayName = "ChartLegendItem"

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipSeries,
  ChartTooltipItem,
  ChartLegend,
  ChartLegendItem,
}

