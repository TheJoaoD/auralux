'use client'

import { useSaleWizardStore } from '@/lib/stores/saleWizardStore'
import { formatCurrency } from '@/lib/utils/formatters'
import { ShoppingCart as CartIcon, Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export function ShoppingCart() {
  const { cartItems, cartTotal, cartItemCount, updateCartQuantity, removeFromCart } =
    useSaleWizardStore()

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    try {
      updateCartQuantity(productId, newQuantity)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar quantidade')
    }
  }

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId)
    toast.success(`${productName} removido do carrinho`)
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-6 bg-[#A1887F]/10 rounded-full mb-4">
          <CartIcon className="h-12 w-12 text-[#A1887F]" />
        </div>
        <p className="text-[#202020] font-medium mb-2">Carrinho vazio</p>
        <p className="text-sm text-[#A1887F] text-center">
          Adicione produtos para continuar
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cart Items */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-lg p-4 border border-[#A1887F]/20"
          >
            <div className="flex gap-3">
              {/* Product Image */}
              {item.product.image_url ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#202020]">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[#202020] flex items-center justify-center flex-shrink-0">
                  <CartIcon className="h-6 w-6 text-[#A1887F]" />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#202020] text-sm truncate mb-1">
                  {item.product.name}
                </h4>
                <p className="text-sm text-[#C49A9A] font-semibold">
                  {formatCurrency(item.product.sale_price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded-full border border-[#C49A9A] text-[#C49A9A] hover:bg-[#C49A9A]/10 transition-colors disabled:opacity-30 flex items-center justify-center"
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <span className="text-sm font-semibold text-[#202020] w-8 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.quantity}
                    className="w-7 h-7 rounded-full border border-[#C49A9A] text-[#C49A9A] hover:bg-[#C49A9A]/10 transition-colors disabled:opacity-30 flex items-center justify-center"
                  >
                    <Plus className="h-3 w-3" />
                  </button>

                  <button
                    onClick={() => handleRemove(item.product.id, item.product.name)}
                    className="ml-auto p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-sm font-semibold text-[#202020]">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-[#A1887F] rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#E0DCD1]">
            Total ({cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'}):
          </span>
          <span className="text-2xl font-bold text-[#E0DCD1]">
            {formatCurrency(cartTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
