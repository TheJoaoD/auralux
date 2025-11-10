/**
 * Category Navigation Component
 * Epic 2 - Story 2.5: Sistema de Categorias e Navegação
 *
 * Horizontal scrollable category chips for easy navigation
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { useCategories } from '@/lib/hooks/use-catalog'

export function CategoryNav() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: categories, isLoading } = useCategories()

  const selectedCategory = searchParams.get('categoria')

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      router.push(`/catalogo/produtos?categoria=${categoryId}`)
    } else {
      router.push('/catalogo/produtos')
    }
  }

  if (isLoading) {
    return (
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {/* All Products Chip */}
          <Badge
            variant={!selectedCategory ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap hover:bg-primary/10 transition-colors"
            onClick={() => handleCategoryClick(null)}
          >
            Todos os Produtos
          </Badge>

          {/* Category Chips */}
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap hover:bg-primary/10 transition-colors"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
