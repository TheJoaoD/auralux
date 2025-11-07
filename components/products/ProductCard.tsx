'use client'

import { Package, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils/formatters'
import { LowStockBadge } from '@/components/inventory/LowStockBadge'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

function getReadableTextColor(hex: string) {
  const sanitized = hex.replace('#', '')
  if (sanitized.length !== 6) {
    return '#202020'
  }
  const r = parseInt(sanitized.slice(0, 2), 16)
  const g = parseInt(sanitized.slice(2, 4), 16)
  const b = parseInt(sanitized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.65 ? '#202020' : '#F7F5F2'
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isLowStock = product.quantity <= product.low_stock_threshold
  const profitMargin = product.profit_margin || 0
  const profitAmount =
    product.profit_amount ?? product.sale_price - product.cost_price
  const categoryColor = product.category?.color
  const categoryTextColor = categoryColor
    ? getReadableTextColor(categoryColor)
    : '#202020'

  return (
    <button
      onClick={() => onClick?.(product)}
      className="w-full bg-[#A1887F] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 text-left group flex flex-col"
    >
      {/* Product Image */}
      <div className="relative w-full h-48 bg-[#202020]/10">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-[#BDBDBD]" />
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && (
          <div className="absolute top-2 left-2">
            <LowStockBadge
              quantity={product.quantity}
              threshold={product.low_stock_threshold}
              variant="compact"
            />
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <div
            className="absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm"
            style={{
              backgroundColor: categoryColor || '#C49A9A',
              color: categoryTextColor,
            }}
          >
            {product.category.name}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="text-lg font-semibold text-[#E0DCD1] truncate group-hover:text-[#C49A9A] transition-colors mb-2">
          {product.name}
        </h3>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-[#E0DCD1]/50 mb-3">
            SKU: {product.sku}
          </p>
        )}

        {/* Prices */}
        <div className="space-y-1 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#E0DCD1]">
              {formatCurrency(product.sale_price)}
            </span>
          </div>
          <p className="text-sm text-[#E0DCD1]/70">
            Custo: {formatCurrency(product.cost_price)}
          </p>
        </div>

        {/* Profit Detail */}
        <div className="flex items-center gap-2 text-sm text-[#E0DCD1]/80 mb-3">
          <TrendingUp className="h-4 w-4 text-[#C49A9A]" />
          <span>
            Lucro:{' '}
            <span className="font-semibold text-[#E0DCD1]">
              {profitMargin.toFixed(1)}%
            </span>
            {profitAmount > 0 && (
              <span className="ml-1 text-[#E0DCD1]/70">
                ({formatCurrency(profitAmount)})
              </span>
            )}
          </span>
        </div>

        {/* Bottom Info */}
        <div className="mt-auto pt-3 border-t border-[#E0DCD1]/10 flex items-center justify-between gap-2">
          {/* Quantity */}
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4 text-[#C49A9A]" />
            <span className="text-sm font-medium text-[#E0DCD1]">
              {product.quantity} un.
            </span>
          </div>

          {/* Profit Margin */}
          <div
            className={`px-2 py-1 rounded-md flex items-center gap-1 ${
              profitMargin > 30 ? 'bg-[#C49A9A]' : 'bg-[#E0DCD1]/20'
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 ${
                profitMargin > 30 ? 'text-[#202020]' : 'text-[#E0DCD1]'
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                profitMargin > 30 ? 'text-[#202020]' : 'text-[#E0DCD1]'
              }`}
            >
              Lucro {profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
