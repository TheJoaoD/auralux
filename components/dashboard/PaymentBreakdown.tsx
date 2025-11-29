'use client'

import { Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import type { PaymentBreakdown as PaymentBreakdownType } from '@/lib/services/salesService'

interface PaymentBreakdownProps {
  breakdown: PaymentBreakdownType | undefined
  isLoading: boolean
}

export function PaymentBreakdown({ breakdown, isLoading }: PaymentBreakdownProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#A1887F] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">Métodos de Pagamento</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-[#E0DCD1]/10 rounded-lg animate-pulse" />
              <div className="flex justify-between">
                <div className="h-3 bg-[#E0DCD1]/10 rounded w-16" />
                <div className="h-3 bg-[#E0DCD1]/10 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (!breakdown || (breakdown.pix.count === 0 && breakdown.cash.count === 0 && (breakdown.card?.count ?? 0) === 0 && breakdown.installment.count === 0)) {
    return (
      <div className="bg-[#A1887F] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">Métodos de Pagamento</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#E0DCD1]/10 rounded-full">
              <Wallet className="h-8 w-8 text-[#E0DCD1]/50" />
            </div>
          </div>
          <p className="text-[#E0DCD1]/70 text-sm text-center">
            Sem dados de pagamento
          </p>
        </div>
      </div>
    )
  }

  const methods = [
    {
      name: 'PIX',
      data: breakdown.pix,
      color: '#4CAF50',
      bgColor: 'bg-green-500',
    },
    {
      name: 'Dinheiro',
      data: breakdown.cash,
      color: '#2196F3',
      bgColor: 'bg-blue-500',
    },
    {
      name: 'Cartao',
      data: breakdown.card || { count: 0, percentage: 0, total: 0 },
      color: '#9C27B0',
      bgColor: 'bg-purple-500',
    },
    {
      name: 'Parcelado',
      data: breakdown.installment,
      color: '#FF9800',
      bgColor: 'bg-orange-500',
    },
  ]

  return (
    <div className="bg-[#A1887F] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">Métodos de Pagamento</h3>

      <div className="space-y-4">
        {methods.map((method) => (
          <div key={method.name} className="space-y-2">
            {/* Method name and percentage */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#E0DCD1]">{method.name}</span>
              <span className="text-sm font-semibold text-[#E0DCD1]">
                {method.data.percentage.toFixed(1)}%
              </span>
            </div>

            {/* Percentage bar */}
            <div className="w-full bg-[#202020]/20 rounded-full h-6 overflow-hidden">
              <div
                className={`${method.bgColor} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-300`}
                style={{ width: `${method.data.percentage}%` }}
              >
                {method.data.percentage > 15 && (
                  <span className="text-xs font-semibold text-white">
                    {method.data.count}
                  </span>
                )}
              </div>
            </div>

            {/* Count and total */}
            <div className="flex justify-between text-xs text-[#E0DCD1]/70">
              <span>
                {method.data.count} {method.data.count === 1 ? 'venda' : 'vendas'}
              </span>
              <span>{formatCurrency(method.data.total)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-[#E0DCD1]/10">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#E0DCD1]">Total</span>
          <span className="text-base font-bold text-[#E0DCD1]">
            {formatCurrency(breakdown.pix.total + breakdown.cash.total + (breakdown.card?.total ?? 0) + breakdown.installment.total)}
          </span>
        </div>
        <div className="text-xs text-[#E0DCD1]/60 text-right mt-1">
          {breakdown.pix.count + breakdown.cash.count + (breakdown.card?.count ?? 0) + breakdown.installment.count} vendas
        </div>
      </div>
    </div>
  )
}
