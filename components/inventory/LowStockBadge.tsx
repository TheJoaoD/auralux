'use client'

import { AlertTriangle } from 'lucide-react'

interface LowStockBadgeProps {
  quantity: number
  threshold?: number
  variant?: 'default' | 'compact'
}

export function LowStockBadge({
  quantity,
  threshold = 5,
  variant = 'default',
}: LowStockBadgeProps) {
  const isLowStock = quantity <= threshold
  const isOutOfStock = quantity === 0

  if (!isLowStock) {
    return null
  }

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
          isOutOfStock
            ? 'bg-red-600 text-white'
            : 'bg-amber-500 text-white'
        }`}
      >
        <AlertTriangle className="h-3 w-3" />
        {isOutOfStock ? 'Sem Estoque' : 'Baixo'}
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold ${
        isOutOfStock
          ? 'bg-red-600 text-white'
          : 'bg-amber-500 text-white'
      }`}
    >
      <AlertTriangle className="h-4 w-4" />
      <span>
        {isOutOfStock ? 'Sem Estoque' : `Estoque Baixo (${quantity})`}
      </span>
    </div>
  )
}
