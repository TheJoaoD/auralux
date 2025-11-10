/**
 * Product Card Skeleton
 * Epic 2 - Story 2.2: Home do Catálogo
 *
 * Loading skeleton for ProductCard with shimmer animation
 */

export function ProductCardSkeleton() {
  return (
    <div className="relative rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Image Skeleton - 1:1 aspect ratio */}
      <div className="relative aspect-square bg-gray-200 animate-pulse" />

      {/* Product Info Skeleton */}
      <div className="p-4 space-y-2">
        {/* Product Name - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>

        {/* Category */}
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
      </div>
    </div>
  )
}
