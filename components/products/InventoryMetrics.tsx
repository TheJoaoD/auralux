'use client'

import { Box, DollarSign, AlertTriangle } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils/formatters'

interface InventoryMetricsProps {
  products: Product[]
}

export function InventoryMetrics({ products }: InventoryMetricsProps) {
  // Calculate metrics
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0)
  const totalValue = products.reduce((sum, p) => sum + p.sale_price * p.quantity, 0)
  const lowStockCount = products.filter(
    (p) => p.quantity <= p.low_stock_threshold
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Quantity */}
      <div className="bg-[#A1887F] rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#C49A9A] flex items-center justify-center flex-shrink-0">
            <Box className="h-6 w-6 text-[#202020]" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#E0DCD1]">{totalQuantity}</p>
            <p className="text-sm text-[#E0DCD1]/70">Itens em Estoque</p>
          </div>
        </div>
      </div>

      {/* Total Value */}
      <div className="bg-[#A1887F] rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#C49A9A] flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-6 w-6 text-[#202020]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#E0DCD1]">
              {formatCurrency(totalValue)}
            </p>
            <p className="text-sm text-[#E0DCD1]/70">Valor Total do Estoque</p>
          </div>
        </div>
      </div>

      {/* Low Stock Count */}
      <div className="bg-[#A1887F] rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              lowStockCount > 0 ? 'bg-red-600' : 'bg-[#C49A9A]'
            }`}
          >
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <p
              className={`text-3xl font-bold ${
                lowStockCount > 0 ? 'text-red-400' : 'text-[#E0DCD1]'
              }`}
            >
              {lowStockCount}
            </p>
            <p className="text-sm text-[#E0DCD1]/70">
              Produtos com Estoque Baixo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
