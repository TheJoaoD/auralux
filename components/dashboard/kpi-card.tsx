"use client"

import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: "up" | "down"
}

export function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  const isPositive = trend === "up"

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon size={20} className="text-accent" />
        </div>
      </div>

      <div className={`text-sm font-medium ${isPositive ? "text-teal-400" : "text-red-400"}`}>
        {change} from last month
      </div>
    </div>
  )
}
