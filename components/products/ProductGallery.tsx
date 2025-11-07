'use client'

import { ProductCard } from './ProductCard'
import { Package, PackagePlus } from 'lucide-react'
import type { Product } from '@/types'

interface ProductGalleryProps {
  products: Product[]
  isLoading?: boolean
  error?: Error | null
  onProductClick?: (product: Product) => void
  onAddProduct?: () => void
}

export function ProductGallery({
  products,
  isLoading = false,
  error = null,
  onProductClick,
  onAddProduct
}: ProductGalleryProps) {

  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#A1887F]/50 rounded-xl overflow-hidden h-80 animate-pulse"
          >
            <div className="h-48 bg-[#C49A9A]/30" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-[#E0DCD1]/20 rounded w-3/4" />
              <div className="h-6 bg-[#E0DCD1]/20 rounded w-1/2" />
              <div className="h-4 bg-[#E0DCD1]/20 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-[#A1887F] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-[#E0DCD1] mb-2">
            Erro ao carregar produtos
          </h3>
          <p className="text-[#E0DCD1]/70 text-sm mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-[#A1887F] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#C49A9A] rounded-full">
              <Package className="h-12 w-12 text-[#202020]" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#E0DCD1] mb-3">
            Nenhum produto cadastrado
          </h2>

          <p className="text-[#E0DCD1]/70 mb-6">
            Adicione seu primeiro produto para começar a gerenciar seu estoque
          </p>

          {onAddProduct && (
            <button
              onClick={onAddProduct}
              className="w-full bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <PackagePlus className="h-5 w-5" />
              Cadastrar Primeiro Produto
            </button>
          )}
        </div>
      </div>
    )
  }

  // Product Gallery Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  )
}
