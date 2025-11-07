'use client'

import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  value: string | number
  subtitle: string
  iconColor?: string
}

export function MetricCard({
  icon: Icon,
  value,
  subtitle,
  iconColor = '#C49A9A',
}: MetricCardProps) {
  return (
    <div className="bg-[#A1887F] rounded-xl p-5 shadow-sm">
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-[#E0DCD1]">{value}</p>
          <p className="text-sm text-[#E0DCD1]/70 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
