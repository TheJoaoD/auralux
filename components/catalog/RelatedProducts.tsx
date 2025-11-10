/**
 * Related Products Component
 * Epic 2 - Story 2.4: Detalhes do Produto
 *
 * Shows products from the same category (excluding current product)
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
    data?.products.filter((p) => p.product_id !== currentProductId).slice(0, 4) ||
    []

  if (isLoading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Produtos Relacionados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Produtos Relacionados
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
