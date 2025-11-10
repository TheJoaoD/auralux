/**
 * Favorites Client Component
 * Epic 3 - Story 3.1: Sistema de Favoritos
 *
 * Displays user's favorite products with remove functionality
 */

'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useFavorites, useRemoveFavorite } from '@/lib/hooks/use-favorites'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function FavoritesClient() {
  const { data: favorites, isLoading } = useFavorites()
  const removeFavorite = useRemoveFavorite()

  const handleRemove = (productId: string) => {
    removeFavorite.mutate(productId)
  }

  // Empty state
  if (!isLoading && (!favorites || favorites.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Heart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Você ainda não tem favoritos
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Explore nosso catálogo e salve seus perfumes preferidos clicando no ícone de coração
        </p>
        <Button asChild>
          <Link href="/catalogo/produtos">
            Explorar Produtos
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {favorites?.map((favorite) => {
        const product = favorite.product
        if (!product) return null

        const stockBadge = getStockBadge(product.quantity)

        return (
          <div
            key={favorite.id}
            className="group relative rounded-lg border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-lg"
          >
            {/* Product Link */}
            <Link
              href={`/catalogo/produto/${product.id}`}
              className="block"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image_url || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />

                {/* Stock Badge */}
                {stockBadge && (
                  <div className="absolute top-2 right-2">
                    <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>

                {product.category && (
                  <p className="text-xs text-gray-500">{product.category.name}</p>
                )}

                <p className="text-xl font-semibold text-primary">
                  {formatPrice(product.sale_price)}
                </p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="p-4 pt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleRemove(product.id)}
                disabled={removeFavorite.isPending}
              >
                <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                Remover
              </Button>

              <Button
                size="sm"
                className="flex-1"
                disabled={product.quantity === 0}
                asChild
              >
                <Link href={`/catalogo/produto/${product.id}`}>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Ver
                </Link>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Determine stock badge
 */
function getStockBadge(quantity: number): { label: string; variant: 'default' | 'destructive' } | null {
  if (quantity > 0) {
    return null // No badge for in stock
  }

  return { label: 'Indisponível', variant: 'destructive' }
}

/**
 * Format price
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
