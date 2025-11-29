/**
 * Related Products Component
 * Horizontal scrollable carousel of related products
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useProductsByCategory } from '@/lib/hooks/use-catalog'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const { data, isLoading } = useProductsByCategory(categoryId, 1, 8)

  // Filter out current product
  const relatedProducts =
    data?.products.filter((p) => p.product_id !== currentProductId).slice(0, 6) ||
    []

  if (isLoading) {
    return (
      <section className="py-6">
        <h2 className="text-lg font-semibold mb-4 px-4">
          Você também vai gostar
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 -mx-4 pb-2 snap-x snap-mandatory">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-36 snap-start">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-6 -mx-4">
      <h2 className="text-lg font-semibold mb-4 px-4">
        Você também vai gostar
      </h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory">
        {relatedProducts.map((product) => (
          <div key={product.id} className="shrink-0 w-36 snap-start">
            <ProductCard product={product} variant="compact" />
          </div>
        ))}
      </div>
    </section>
  )
}
