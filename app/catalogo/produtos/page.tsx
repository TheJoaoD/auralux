/**
 * Products Listing Page
 * Epic 2 - Story 2.3: Listagem de Produtos com Filtros
 *
 * Full product catalog with filters, search, and infinite scroll
 */

import { Suspense } from 'react'
import { ProductsListingClient } from '@/components/catalog/ProductsListingClient'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsListingClient />
    </Suspense>
  )
}
