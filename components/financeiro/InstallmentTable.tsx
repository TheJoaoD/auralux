'use client'

import { format, differenceInDays, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/formatters'
import { ExternalLink, CreditCard, Loader2 } from 'lucide-react'
import type { Installment } from '@/lib/services/installmentService'

interface InstallmentTableProps {
  installments: Installment[]
  onPayClick: (installment: Installment) => void
  isLoading?: boolean
}

export function InstallmentTable({
  installments,
  onPayClick,
  isLoading,
}: InstallmentTableProps) {
  const getStatusBadge = (installment: Installment) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(installment.due_date)
    dueDate.setHours(0, 0, 0, 0)
    const daysUntilDue = differenceInDays(dueDate, today)

    if (installment.status === 'paid') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Paga
        </Badge>
      )
    }

    if (installment.status === 'cancelled') {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          Cancelada
        </Badge>
      )
    }

    if (installment.status === 'overdue' || isPast(dueDate)) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Vencida
        </Badge>
      )
    }

    if (daysUntilDue <= 7 && daysUntilDue >= 0) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          Vence em {daysUntilDue === 0 ? 'hoje' : `${daysUntilDue} dias`}
        </Badge>
      )
    }

    if (installment.status === 'partial') {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Parcial
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="border-[#A1887F] text-[#A1887F]">
        Pendente
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-[#A1887F]/20 rounded-lg">
        <div className="p-8 flex flex-col items-center justify-center text-[#A1887F]">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Carregando parcelas...</p>
        </div>
      </div>
    )
  }

  if (installments.length === 0) {
    return (
      <div className="bg-white border border-[#A1887F]/20 rounded-lg">
        <div className="p-8 flex flex-col items-center justify-center text-[#A1887F]">
          <CreditCard className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhuma parcela encontrada</p>
          <p className="text-sm mt-1">Ajuste os filtros ou aguarde novas vendas parceladas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#A1887F]/20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F7F5F2] border-b border-[#A1887F]/20">
              <TableHead className="text-[#A1887F] font-semibold">Cliente</TableHead>
              <TableHead className="text-[#A1887F] font-semibold">Parcela</TableHead>
              <TableHead className="text-[#A1887F] font-semibold">Valor</TableHead>
              <TableHead className="text-[#A1887F] font-semibold">Vencimento</TableHead>
              <TableHead className="text-[#A1887F] font-semibold">Status</TableHead>
              <TableHead className="text-[#A1887F] font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installments.map(installment => {
              const remaining = installment.amount - (installment.paid_amount || 0)
              const canPay = installment.status !== 'paid' && installment.status !== 'cancelled'

              return (
                <TableRow
                  key={installment.id}
                  className="border-b border-[#A1887F]/10 hover:bg-[#F7F5F2]/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#202020]">
                        {installment.customer?.full_name || 'Cliente não identificado'}
                      </span>
                      {installment.sale?.customer_id && (
                        <Link
                          href={`/customers?id=${installment.sale.customer_id}`}
                          className="text-[#C49A9A] hover:text-[#B38989]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-[#202020]">
                        {installment.installment_number}ª parcela
                      </span>
                      {installment.sale_id && (
                        <Link
                          href={`/sales?id=${installment.sale_id}`}
                          className="text-[#C49A9A] hover:text-[#B38989]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-[#202020]">
                        {formatCurrency(installment.amount)}
                      </p>
                      {(installment.paid_amount || 0) > 0 && installment.status !== 'paid' && (
                        <p className="text-xs text-[#A1887F]">
                          Pago: {formatCurrency(installment.paid_amount || 0)} | Resta:{' '}
                          {formatCurrency(remaining)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[#202020]">
                      {format(new Date(installment.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(installment)}</TableCell>
                  <TableCell className="text-right">
                    {canPay && (
                      <Button
                        size="sm"
                        onClick={() => onPayClick(installment)}
                        className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020]"
                      >
                        Dar Baixa
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
