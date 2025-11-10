/**
 * Product Card Component
 * Epic 2 - Story 2.2: Home do Catálogo
 * Epic 3 - Story 3.1: Integrated favorites
 *
 * Displays product information in a card format with:
 * - Product image (lazy loaded with blur placeholder)
 * - Stock badges (Em breve / Indisponível)
 * - Product name and price
 * - Favorite icon (requires authentication)
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CatalogProduct } from '@/lib/services/catalog'
import { useCatalogAuth } from '@/lib/providers/catalog-auth-provider'
import { useIsFavorite, useToggleFavorite } from '@/lib/hooks/use-favorites'

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const { isAuthenticated, openAuthModal } = useCatalogAuth()
  const { data: isFavorite = false } = useIsFavorite(product.product_id)
  const { toggle, isLoading } = useToggleFavorite()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()

    if (!isAuthenticated) {
      openAuthModal()
      return
    }

    toggle(product.product_id, isFavorite)
  }

  // Determine stock badge
  const stockBadge = getStockBadge(product.quantity, product.stock_return_date)

  return (
    <Link
      href={`/catalogo/produto/${product.product_id}`}
      className="group block relative"
      prefetch={true}
    >
      <div className="relative rounded-lg border border-border bg-white overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
        {/* Image Container - 1:1 aspect ratio */}
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          <Image
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />

          {/* Stock Badge - Top Right */}
          {stockBadge && (
            <div className="absolute top-2 right-2">
              <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
            </div>
          )}

          {/* Favorite Button - Top Left */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-white/90 hover:bg-white transition-colors"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              }`}
            />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Product Name - Truncate 2 lines */}
          <h3 className="font-medium text-foreground line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          {/* Category */}
          {product.category && (
            <p className="text-xs text-muted-foreground">{product.category.name}</p>
          )}

          {/* Price */}
          <p className="text-xl font-semibold text-primary">
            {formatPrice(product.sale_price)}
          </p>
        </div>
      </div>
    </Link>
  )
}

/**
 * Determine stock badge based on quantity and return date
 */
function getStockBadge(
  quantity: number,
  stockReturnDate: string | null
): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } | null {
  if (quantity > 0) {
    return null // No badge if in stock
  }

  if (stockReturnDate) {
    return {
      label: 'Em breve',
      variant: 'secondary', // Warning yellow
    }
  }

  return {
    label: 'Indisponível',
    variant: 'destructive', // Error red
  }
}

/**
 * Format price to Brazilian Real currency
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
