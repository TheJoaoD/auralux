/**
 * Product Card Component
 * Premium mobile-first design - Vitrine pública
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CatalogProduct } from '@/lib/services/catalog'

interface ProductCardProps {
  product: CatalogProduct
  variant?: 'default' | 'featured' | 'compact' | 'horizontal'
  priority?: boolean
}

export function ProductCard({
  product,
  variant = 'default',
  priority = false,
}: ProductCardProps) {
  const stockBadge = getStockBadge(product.quantity, product.stock_return_date)
  const isOutOfStock = product.quantity === 0

  // Variant-specific styles
  const cardStyles = {
    default: 'w-full',
    featured: 'w-[200px] md:w-[240px]',
    compact: 'w-full',
    horizontal: 'w-full flex flex-row',
  }

  const imageAspect = {
    default: 'aspect-[4/5]',
    featured: 'aspect-[4/5]',
    compact: 'aspect-square',
    horizontal: 'aspect-square w-24 shrink-0',
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/catalogo/produto/${product.product_id}`}
        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
      >
        <div className={cn('relative rounded-lg overflow-hidden bg-muted', imageAspect[variant])}>
          <Image
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          <p className="text-primary font-semibold mt-1">{formatPrice(product.sale_price)}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/catalogo/produto/${product.product_id}`}
      className={cn('group block relative', cardStyles[variant])}
      prefetch={true}
    >
      <div
        className={cn(
          'relative rounded-xl bg-card overflow-hidden catalog-card',
          isOutOfStock && 'opacity-75'
        )}
      >
        {/* Image Container */}
        <div className={cn('relative overflow-hidden bg-muted', imageAspect[variant])}>
          <Image
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            sizes={variant === 'featured' ? '240px' : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
            className={cn(
              'object-cover transition-transform duration-300',
              !isOutOfStock && 'group-hover:scale-105'
            )}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />

          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock Badge - Top Right */}
          {stockBadge && (
            <div className="absolute top-3 right-3">
              <Badge
                variant={stockBadge.variant}
                className="text-[10px] font-semibold px-2 py-0.5 shadow-sm"
              >
                {stockBadge.label}
              </Badge>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                Indisponível
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 space-y-1.5">
          {/* Category */}
          {product.category && (
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <p className="text-lg font-bold text-primary">
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
      variant: 'secondary',
    }
  }

  return {
    label: 'Indisponível',
    variant: 'destructive',
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
