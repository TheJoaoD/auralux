/**
 * New Products Section
 * Epic 2 - Story 2.2: Home do Catálogo
 *
 * Grid displaying last 10 products added to catalog
 */

'use client'

import { useNewProducts } from '@/lib/hooks/use-catalog'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

export function NewProductsSection() {
  const { data: products, isLoading, error } = useNewProducts(10)

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">
            Não foi possível carregar novidades. Tente novamente.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Novidades</h2>
          <p className="mt-2 text-muted-foreground">
            Últimos perfumes adicionados à nossa coleção
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {isLoading
            ? // Loading Skeletons
              Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : // Actual Products
              products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  )
}
