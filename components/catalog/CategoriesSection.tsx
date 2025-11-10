/**
 * Categories Section
 * Epic 2 - Story 2.2: Home do Catálogo
 *
 * Grid displaying featured categories (max 4)
 */

'use client'

import { useCategories } from '@/lib/hooks/use-catalog'
import { CategoryCard, CategoryCardSkeleton } from './CategoryCard'

export function CategoriesSection() {
  const { data: categories, isLoading, error } = useCategories()

  if (error) {
    return null // Fail silently for categories
  }

  // Limit to 4 categories for featured section
  const featuredCategories = categories?.slice(0, 4) || []

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Explorar por Categoria
          </h2>
          <p className="mt-2 text-muted-foreground">
            Encontre a fragrância perfeita para cada momento
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : // Actual Categories
              featuredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
        </div>
      </div>
    </section>
  )
}
