'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/formatters'

interface CustomerDebtSummaryProps {
  totalDue: number
  hasOverdue: boolean
  compact?: boolean
}

export function CustomerDebtSummary({ totalDue, hasOverdue, compact = false }: CustomerDebtSummaryProps) {
  const getStatus = () => {
    if (totalDue === 0) {
      return {
        label: 'Em dia',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-l-green-500',
        icon: CheckCircle
      }
    }
    if (hasOverdue) {
      return {
        label: 'Parcelas vencidas',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-l-red-500',
        icon: AlertTriangle
      }
    }
    return {
      label: 'Parcelas pendentes',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-l-orange-500',
      icon: Clock
    }
  }

  const status = getStatus()
  const Icon = status.icon

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
        status.bgColor,
        status.color
      )}>
        <Icon className="h-4 w-4" />
        <span>
          {totalDue > 0 ? formatCurrency(totalDue) : 'Em dia'}
        </span>
      </div>
    )
  }

  return (
    <Card className={cn('border-l-4', status.borderColor)}>
      <CardContent className={cn('p-4', status.bgColor)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Situacao Financeira</p>
            <p className={cn('text-2xl font-bold', status.color)}>
              {totalDue > 0 ? `Deve: ${formatCurrency(totalDue)}` : 'Sem pendencias'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Icon className={cn('h-6 w-6', status.color)} />
            <span className={cn('text-sm font-medium', status.color)}>
              {status.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
