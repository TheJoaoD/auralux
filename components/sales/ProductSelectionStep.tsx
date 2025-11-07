'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from '@/lib/services/productService'
import { useSaleWizardStore } from '@/lib/stores/saleWizardStore'
import { ShoppingCart } from './ShoppingCart'
import { QuantitySelector } from './QuantitySelector'
import { Search, Package, Plus, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import { toast } from 'sonner'
import Image from 'next/image'
import type { Product } from '@/types'

export function ProductSelectionStep() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuantitySelectorOpen, setIsQuantitySelectorOpen] = useState(false)
  const { goToStep, canGoToStep, addToCart } = useSaleWizardStore()

  // Fetch all products (no pagination for selector)
  const { data: products, isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: getAllProducts,
    staleTime: 30000,
  })

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setIsQuantitySelectorOpen(true)
  }

  const handleQuantityConfirm = (quantity: number) => {
    if (!selectedProduct) return

    try {
      addToCart(selectedProduct, quantity)
      toast.success(`${selectedProduct.name} adicionado ao carrinho`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar ao carrinho')
    }
  }

  const handleBack = () => {
    goToStep(1)
  }

  const handleNext = () => {
    if (canGoToStep(3)) {
      goToStep(3)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Products Section (2/3 width on desktop) */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A1887F]" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#A1887F]/50 rounded-lg overflow-hidden h-64 animate-pulse">
                <div className="h-32 bg-[#E0DCD1]/20" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-[#E0DCD1]/20 rounded" />
                  <div className="h-4 bg-[#E0DCD1]/20 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!filteredProducts || filteredProducts.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 bg-[#A1887F]/10 rounded-full mb-4">
              <Package className="h-16 w-16 text-[#A1887F]" />
            </div>
            <h4 className="text-lg font-semibold text-[#202020] mb-2">
              {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
            </h4>
            <p className="text-sm text-[#A1887F] text-center mb-6">
              {searchQuery
                ? 'Tente buscar por outro termo'
                : 'Adicione produtos no estoque para criar vendas'}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.quantity === 0
              const isLowStock = product.quantity > 0 && product.quantity <= (product.low_stock_threshold || 5)

              return (
                <div
                  key={product.id}
                  className={`bg-[#A1887F] rounded-lg overflow-hidden transition-all ${
                    isOutOfStock ? 'opacity-50' : 'hover:shadow-lg'
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative h-32 bg-[#202020]">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-[#A1887F]" />
                      </div>
                    )}

                    {/* Stock Badge */}
                    {isLowStock && !isOutOfStock && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        Baixo
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
                          Sem Estoque
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h4 className="font-medium text-[#E0DCD1] text-sm truncate mb-1">
                      {product.name}
                    </h4>
                    <p className="text-lg font-semibold text-[#C49A9A] mb-2">
                      {formatCurrency(product.sale_price)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#E0DCD1]/70">
                        {product.quantity} disponíveis
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className="w-8 h-8 rounded-full bg-[#C49A9A] hover:bg-[#B38989] text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cart Section (1/3 width on desktop) */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#202020]">Carrinho</h3>
          <ShoppingCart />

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-4 py-3 bg-transparent border-2 border-[#A1887F] text-[#A1887F] font-semibold rounded-lg hover:bg-[#A1887F]/10 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoToStep(3)}
              className="flex-1 px-4 py-3 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Quantity Selector Modal */}
      <QuantitySelector
        product={selectedProduct}
        open={isQuantitySelectorOpen}
        onOpenChange={setIsQuantitySelectorOpen}
        onAddToCart={handleQuantityConfirm}
      />
    </div>
  )
}
