/**
 * Favorites Page
 * Epic 3 - Story 3.1: Sistema de Favoritos
 *
 * Displays user's favorite products
 */

import { Suspense } from 'react'
import { FavoritesClient } from '@/components/catalog/FavoritesClient'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'

export const metadata = {
  title: 'Meus Favoritos | Auralux Catálogo',
  description: 'Seus produtos favoritos salvos',
}

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Meus Favoritos</h1>
        <p className="mt-2 text-muted-foreground">
          Perfumes salvos para consulta futura
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <FavoritesClient />
      </Suspense>
    </div>
  )
}
