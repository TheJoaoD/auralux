"use client"

import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function InstallmentOverview() {
  const stats = [
    {
      label: "Active Plans",
      value: "12",
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Paid This Month",
      value: "₦28,400",
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Overdue",
      value: "3",
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Total Outstanding",
      value: "₦156,800",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
