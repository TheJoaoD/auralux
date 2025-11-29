/**
 * Category Pills Component
 * Horizontal scrollable category navigation
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCategories } from '@/lib/hooks/use-catalog'
import { cn } from '@/lib/utils'

export function CategoryPills() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: categories, isLoading } = useCategories()

  const currentCategory = searchParams.get('categoria')

  const handleCategoryClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (categoryId) {
      params.set('categoria', categoryId)
    } else {
      params.delete('categoria')
    }

    router.push(`/catalogo/produtos?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="sticky top-14 md:top-16 z-40 bg-background border-b border-border">
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-20 rounded-full skeleton-shimmer shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-14 md:top-16 z-40 bg-background border-b border-border">
      <div className="container mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3 -mx-4 md:mx-0">
          {/* All Products Pill */}
          <button
            onClick={() => handleCategoryClick(null)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              !currentCategory
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            Todos
          </button>

          {/* Category Pills */}
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                currentCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
