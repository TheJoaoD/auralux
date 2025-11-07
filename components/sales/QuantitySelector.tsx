'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils/formatters'
import { Minus, Plus, Package } from 'lucide-react'
import type { Product } from '@/types'

interface QuantitySelectorProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (quantity: number) => void
}

export function QuantitySelector({
  product,
  open,
  onOpenChange,
  onAddToCart,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  if (!product) return null

  const handleIncrement = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1)
      setError('')
    } else {
      setError(`Apenas ${product.quantity} disponíveis`)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
      setError('')
    }
  }

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value)
    if (isNaN(num) || num < 1) {
      setQuantity(1)
      setError('')
    } else if (num > product.quantity) {
      setQuantity(product.quantity)
      setError(`Apenas ${product.quantity} disponíveis`)
    } else {
      setQuantity(num)
      setError('')
    }
  }

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.quantity) {
      onAddToCart(quantity)
      setQuantity(1)
      setError('')
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    setQuantity(1)
    setError('')
    onOpenChange(false)
  }

  const subtotal = product.sale_price * quantity

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] bg-[#F7F5F2] border-[#A1887F]/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#202020]">
            Adicionar ao Carrinho
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div>
            <h4 className="font-semibold text-[#202020] mb-1">{product.name}</h4>
            <p className="text-lg text-[#C49A9A] font-semibold">
              {formatCurrency(product.sale_price)}
            </p>
            <p className="text-sm text-[#A1887F] mt-1 flex items-center gap-1">
              <Package className="h-3 w-3" />
              {product.quantity} disponíveis
            </p>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-[#A1887F] mb-3">
              Quantidade
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-12 h-12 rounded-full border-2 border-[#C49A9A] text-[#C49A9A] hover:bg-[#C49A9A]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Minus className="h-5 w-5" />
              </button>

              <input
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="flex-1 text-center text-2xl font-bold text-[#202020] bg-white border-2 border-[#A1887F]/30 rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent"
              />

              <button
                onClick={handleIncrement}
                disabled={quantity >= product.quantity}
                className="w-12 h-12 rounded-full border-2 border-[#C49A9A] text-[#C49A9A] hover:bg-[#C49A9A]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Subtotal */}
          <div className="bg-[#A1887F] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#E0DCD1]">
                Subtotal:
              </span>
              <span className="text-2xl font-bold text-[#E0DCD1]">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p className="text-xs text-[#E0DCD1]/70 mt-1">
              {quantity} × {formatCurrency(product.sale_price)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-transparent border-2 border-[#A1887F] text-[#A1887F] font-semibold rounded-lg hover:bg-[#A1887F]/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 py-3 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
