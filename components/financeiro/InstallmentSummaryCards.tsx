'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { DollarSign, AlertTriangle, Clock } from 'lucide-react'
import type { InstallmentSummary } from '@/lib/services/installmentService'

interface InstallmentSummaryCardsProps {
  summary?: InstallmentSummary
  isLoading?: boolean
}

export function InstallmentSummaryCards({ summary, isLoading }: InstallmentSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-[#F7F5F2] border-[#A1887F]/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-[#A1887F]/20 rounded w-24 mb-2" />
                <div className="h-8 bg-[#A1887F]/20 rounded w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'Total Pendente',
      value: summary?.totalPending || 0,
      count: summary?.pendingCount || 0,
      icon: DollarSign,
      color: 'text-[#C49A9A]',
      bgColor: 'bg-[#C49A9A]/10',
      borderColor: 'border-[#C49A9A]/20',
    },
    {
      label: 'Vencidas',
      value: summary?.totalOverdue || 0,
      count: summary?.overdueCount || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      label: 'A Vencer Esta Semana',
      value: summary?.totalDueThisWeek || 0,
      count: summary?.dueThisWeekCount || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <Card key={card.label} className={`${card.bgColor} ${card.borderColor} border-2`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm font-medium ${card.color}`}>{card.label}</p>
                  <p className="text-2xl font-bold text-[#202020] mt-1">
                    {formatCurrency(card.value)}
                  </p>
                  <p className="text-sm text-[#A1887F] mt-1">
                    {card.count} {card.count === 1 ? 'parcela' : 'parcelas'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
