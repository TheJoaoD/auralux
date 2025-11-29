'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils/formatters'
import { Clock, Loader2, Calendar } from 'lucide-react'
import type { Installment } from '@/lib/services/installmentService'

interface UpcomingInstallmentsProps {
  installments?: Installment[]
  onPayClick: (installment: Installment) => void
  isLoading?: boolean
}

export function UpcomingInstallments({
  installments,
  onPayClick,
  isLoading,
}: UpcomingInstallmentsProps) {
  const getDaysLabel = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const days = differenceInDays(due, today)

    if (days < 0) return 'Vencida'
    if (days === 0) return 'Hoje'
    if (days === 1) return 'Amanhã'
    return `${days} dias`
  }

  const getDaysBadgeColor = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const days = differenceInDays(due, today)

    if (days < 0) return 'bg-red-100 text-red-800'
    if (days === 0) return 'bg-red-100 text-red-800'
    if (days === 1) return 'bg-orange-100 text-orange-800'
    if (days <= 3) return 'bg-amber-100 text-amber-800'
    return 'bg-blue-100 text-blue-800'
  }

  if (isLoading) {
    return (
      <Card className="bg-white border-[#A1887F]/20">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#A1887F]/10">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#C49A9A]" />
            <CardTitle className="text-lg font-semibold text-[#202020]">
              Próximos Vencimentos
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 border border-[#A1887F]/20 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-[#A1887F]/20 rounded w-32 mb-2" />
                  <div className="h-3 bg-[#A1887F]/20 rounded w-24" />
                </div>
                <div className="h-8 bg-[#A1887F]/20 rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-[#A1887F]/20">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#A1887F]/10">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#C49A9A]" />
          <CardTitle className="text-lg font-semibold text-[#202020]">
            Próximos Vencimentos
          </CardTitle>
        </div>
        <Link href="/financeiro/parcelas">
          <Button
            variant="outline"
            size="sm"
            className="border-[#A1887F] text-[#A1887F] hover:bg-[#A1887F]/10"
          >
            Ver todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        {!installments?.length ? (
          <div className="py-8 text-center text-[#A1887F]">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Tudo em dia!</p>
            <p className="text-sm mt-1">Nenhum vencimento nos próximos 7 dias</p>
          </div>
        ) : (
          <div className="space-y-3">
            {installments.slice(0, 5).map(installment => {
              const remaining = installment.amount - (installment.paid_amount || 0)
              return (
                <div
                  key={installment.id}
                  className="flex items-center justify-between p-3 border border-[#A1887F]/20 rounded-lg hover:bg-[#F7F5F2]/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#202020] truncate">
                      {installment.customer?.full_name || 'Cliente'}
                    </p>
                    <p className="text-sm text-[#A1887F]">
                      {installment.installment_number}ª parcela -{' '}
                      <span className="font-semibold text-[#202020]">{formatCurrency(remaining)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <Badge className={getDaysBadgeColor(installment.due_date)}>
                      {getDaysLabel(installment.due_date)}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => onPayClick(installment)}
                      className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020]"
                    >
                      Baixa
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
