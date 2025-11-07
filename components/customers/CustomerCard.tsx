'use client'

import { User, ShoppingBag } from 'lucide-react'
import type { Customer } from '@/types'
import { formatCurrency } from '@/lib/utils/formatters'

interface CustomerCardProps {
  customer: Customer
  onClick?: (customer: Customer) => void
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <button
      onClick={() => onClick?.(customer)}
      className="w-full bg-[#A1887F] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 text-left min-h-[120px] flex flex-col justify-between group"
    >
      <div className="flex items-start gap-4 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C49A9A] flex items-center justify-center">
          <User className="h-6 w-6 text-[#202020]" />
        </div>

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#E0DCD1] truncate group-hover:text-[#C49A9A] transition-colors">
            {customer.full_name}
          </h3>
          <p className="text-sm text-[#E0DCD1]/70 mt-0.5">
            {customer.whatsapp}
          </p>
          {customer.email && (
            <p className="text-xs text-[#E0DCD1]/50 mt-1 truncate">
              {customer.email}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-[#E0DCD1]/10">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-[#C49A9A]" />
          <span className="text-sm font-medium text-[#E0DCD1]">
            {customer.purchase_count} {customer.purchase_count === 1 ? 'compra' : 'compras'}
          </span>
        </div>
        <div className="h-4 w-px bg-[#E0DCD1]/20" />
        <span className="text-sm font-semibold text-[#C49A9A]">
          {formatCurrency(customer.total_purchases)}
        </span>
      </div>
    </button>
  )
}
