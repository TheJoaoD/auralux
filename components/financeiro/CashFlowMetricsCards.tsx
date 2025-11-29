'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { DollarSign, Calendar, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import type { CashFlowMetrics } from '@/lib/services/cashFlowService'

interface CashFlowMetricsCardsProps {
  metrics?: CashFlowMetrics
  isLoading?: boolean
}

export function CashFlowMetricsCards({ metrics, isLoading }: CashFlowMetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-[#F7F5F2] border-[#A1887F]/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-[#A1887F]/20 rounded w-20 mb-2" />
                <div className="h-8 bg-[#A1887F]/20 rounded w-28 mb-2" />
                <div className="h-3 bg-[#A1887F]/20 rounded w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'Caixa Hoje',
      value: metrics?.today || 0,
      subtitle: `Semana: ${formatCurrency(metrics?.thisWeek || 0)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      href: null,
    },
    {
      label: 'Caixa do Mês',
      value: metrics?.thisMonth || 0,
      subtitle: `Total de entradas`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      href: null,
    },
    {
      label: 'A Receber',
      value: metrics?.pendingReceivables || 0,
      subtitle: 'Parcelas pendentes',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      href: '/financeiro/parcelas',
    },
    {
      label: 'Vencidas',
      value: metrics?.overdueReceivables || 0,
      subtitle: 'Requer atenção',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/financeiro/parcelas?status=overdue',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon
        const content = (
          <Card className={`${card.bgColor} ${card.borderColor} border-2 ${card.href ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm font-medium ${card.color}`}>{card.label}</p>
                  <p className="text-2xl font-bold text-[#202020] mt-1">
                    {formatCurrency(card.value)}
                  </p>
                  <p className="text-xs text-[#A1887F] mt-1">{card.subtitle}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )

        if (card.href) {
          return (
            <Link key={card.label} href={card.href}>
              {content}
            </Link>
          )
        }

        return <div key={card.label}>{content}</div>
      })}
    </div>
  )
}
