/**
 * Category Card Component
 * Epic 2 - Story 2.2: Home do Catálogo
 *
 * Displays category with background image and name overlay
 * Links to product listing filtered by category
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    color: string | null
  }
  imageUrl?: string
}

export function CategoryCard({ category, imageUrl }: CategoryCardProps) {
  // Use category color or default gradient
  const gradientStyle = category.color
    ? { backgroundColor: category.color }
    : { background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5C2 100%)' }

  return (
    <Link
      href={`/catalogo/produtos?categoria=${category.id}`}
      className="group block relative"
      prefetch={true}
    >
      <div className="relative rounded-lg overflow-hidden aspect-video transition-all hover:shadow-lg hover:scale-[1.02]">
        {/* Background Image or Color */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0" style={gradientStyle} />
        )}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Name */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg group-hover:text-primary/20 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}

/**
 * Category Card Skeleton
 */
export function CategoryCardSkeleton() {
  return (
    <div className="relative rounded-lg overflow-hidden aspect-video">
      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-6 bg-gray-300 rounded animate-pulse w-2/3" />
      </div>
    </div>
  )
}
