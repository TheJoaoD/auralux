/**
 * Product Card Skeleton
 * Premium shimmer loading animation
 * Based on front-end-spec-catalogo.md
 */

import { cn } from '@/lib/utils'

interface ProductCardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact' | 'horizontal'
}

export function ProductCardSkeleton({ variant = 'default' }: ProductCardSkeletonProps) {
  const cardStyles = {
    default: 'w-full',
    featured: 'w-[200px] md:w-[240px]',
    compact: 'w-full',
    horizontal: 'w-full flex flex-row gap-3 p-2',
  }

  const imageAspect = {
    default: 'aspect-[4/5]',
    featured: 'aspect-[4/5]',
    compact: 'aspect-square',
    horizontal: 'aspect-square w-24 shrink-0',
  }

  if (variant === 'horizontal') {
    return (
      <div className={cn('rounded-xl', cardStyles[variant])}>
        <div className={cn('rounded-lg skeleton-shimmer', imageAspect[variant])} />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 rounded skeleton-shimmer w-full" />
          <div className="h-4 rounded skeleton-shimmer w-3/4" />
          <div className="h-5 rounded skeleton-shimmer w-1/3" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-xl bg-card overflow-hidden', cardStyles[variant])}>
      {/* Image Skeleton */}
      <div className={cn('skeleton-shimmer', imageAspect[variant])} />

      {/* Product Info Skeleton */}
      <div className="p-3 space-y-2">
        {/* Category */}
        <div className="h-3 rounded skeleton-shimmer w-1/3" />

        {/* Product Name */}
        <div className="space-y-1.5">
          <div className="h-4 rounded skeleton-shimmer w-full" />
          <div className="h-4 rounded skeleton-shimmer w-2/3" />
        </div>

        {/* Price */}
        <div className="h-6 rounded skeleton-shimmer w-1/2" />
      </div>
    </div>
  )
}
