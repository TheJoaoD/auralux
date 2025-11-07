'use client'

import { Package, PackagePlus } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import type { Sale } from '@/lib/services/salesService'

interface RecentSalesListProps {
  sales: Sale[] | undefined
  isLoading: boolean
  onAddSale?: () => void
}

export function RecentSalesList({ sales, isLoading, onAddSale }: RecentSalesListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#A1887F] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">Vendas Recentes</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-[#F7F5F2] rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#A1887F]/20 rounded w-1/3" />
                  <div className="h-3 bg-[#A1887F]/20 rounded w-1/2" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-[#A1887F]/20 rounded w-20" />
                  <div className="h-4 bg-[#A1887F]/20 rounded w-16 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (!sales || sales.length === 0) {
    return (
      <div className="bg-[#A1887F] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">Vendas Recentes</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#C49A9A] rounded-full">
              <Package className="h-12 w-12 text-[#202020]" />
            </div>
          </div>
          <p className="text-[#E0DCD1] font-medium mb-2">Nenhuma venda ainda</p>
          <p className="text-[#E0DCD1]/70 text-sm text-center mb-6">
            Clique em "+ Nova Venda" para começar
          </p>
          {onAddSale && (
            <button
              onClick={onAddSale}
              className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <PackagePlus className="h-5 w-5" />
              Criar Primeira Venda
            </button>
          )}
        </div>
      </div>
    )
  }

  // Payment method badge helper
  const getPaymentBadge = (paymentMethod: string, installmentCount?: number | null) => {
    switch (paymentMethod) {
      case 'pix':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            PIX
          </span>
        )
      case 'cash':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Dinheiro
          </span>
        )
      case 'installment':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            {installmentCount}x
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-[#A1887F] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#E0DCD1]">Vendas Recentes</h3>
        {/* Future: "Ver Todas" link */}
      </div>

      <div className="space-y-3">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="bg-[#F7F5F2] rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-[#202020] truncate">
                  {sale.customer?.full_name || 'Cliente não identificado'}
                </h4>
                <p className="text-sm text-[#A1887F]/80 mt-1">
                  {formatDateTime(sale.created_at)}
                </p>
                {/* Product summary */}
                {sale.sale_items && sale.sale_items.length > 0 && (
                  <p className="text-xs text-[#A1887F]/60 mt-1">
                    {sale.sale_items.length === 1
                      ? `${sale.sale_items[0].quantity}x ${sale.sale_items[0].product_name}`
                      : `${sale.sale_items.length} produtos (${sale.sale_items.reduce((sum, item) => sum + item.quantity, 0)} itens)`}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-semibold text-[#C49A9A]">
                  {formatCurrency(sale.total_amount)}
                </p>
                <div className="mt-2">
                  {getPaymentBadge(sale.payment_method, sale.installment_count)}
                </div>
              </div>
            </div>

            {/* Show actual received if different (installment case) */}
            {sale.actual_amount_received && sale.actual_amount_received !== sale.total_amount && (
              <div className="mt-2 pt-2 border-t border-[#A1887F]/10">
                <p className="text-xs text-[#A1887F]/70">
                  Valor recebido: {formatCurrency(sale.actual_amount_received)}{' '}
                  <span className="text-amber-600">
                    (-{formatCurrency(sale.discount_amount || 0)} taxas)
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
