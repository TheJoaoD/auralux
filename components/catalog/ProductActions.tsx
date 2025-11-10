/**
 * Product Actions Component
 * Epic 2 - Story 2.4: Detalhes do Produto
 *
 * Sticky bottom bar with Favorite and Add to Cart buttons
 */

'use client'

import { useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCatalogAuth } from '@/lib/providers/catalog-auth-provider'
import type { CatalogProduct } from '@/lib/services/catalog'

interface ProductActionsProps {
  product: CatalogProduct
}

export function ProductActions({ product }: ProductActionsProps) {
  const { isAuthenticated, openAuthModal } = useCatalogAuth()
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }

    // Toggle favorite (would call API here)
    setIsFavorite(!isFavorite)

    // Show toast (implement with toast library)
    console.log(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }

    // Add to cart (would call API here)
    console.log('Produto adicionado ao carrinho')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-3">
          {/* Favorite Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleFavoriteClick}
            className="flex-1 gap-2"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
            {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Button>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 gap-2 bg-primary hover:bg-primary"
            disabled={product.quantity === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            {product.quantity === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
          </Button>
        </div>
      </div>
    </div>
  )
}
