/**
 * Featured Products Section
 * Epic 2 - Story 2.2: Home do Catálogo
 *
 * Horizontal swipeable carousel with up to 6 featured products
 */

'use client'

import { useFeaturedProducts } from '@/lib/hooks/use-catalog'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

export function FeaturedProductsSection() {
  const { data: products, isLoading, error } = useFeaturedProducts()

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">
            Não foi possível carregar produtos em destaque. Tente novamente.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Produtos em Destaque
          </h2>
          <p className="mt-2 text-muted-foreground">
            Nossa seleção especial de fragrâncias premium
          </p>
        </div>

        {/* Horizontal Scrollable Container */}
        <div className="relative">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] snap-start"
                >
                  <ProductCardSkeleton />
                </div>
              ))
            ) : (
              // Actual Products
              products?.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[280px] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
