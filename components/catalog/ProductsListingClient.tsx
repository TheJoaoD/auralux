/**
 * Products Listing Client Component
 * Premium mobile-first design with FilterSheet
 * Based on front-end-spec-catalogo.md
 */

'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { Loader2, Search, PackageX } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { FilterBar } from './FilterBar'
import { CategoryPills } from './CategoryPills'
import { FilterSheet, type FilterValues } from './FilterSheet'
import {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchSearchProducts,
  fetchSearchProductsWithCategory,
} from '@/app/catalogo/actions/catalog'
import type { PaginatedProducts } from '@/lib/services/catalog'

export function ProductsListingClient() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoria')
  const query = searchParams.get('q')

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})

  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['catalog-products', categoryId, query, filters],
    queryFn: async ({ pageParam = 1 }) => {
      if (query && categoryId) {
        return fetchSearchProductsWithCategory(query, categoryId, pageParam)
      }
      if (query) {
        return fetchSearchProducts(query, pageParam)
      }
      if (categoryId) {
        return fetchProductsByCategory(categoryId, pageParam)
      }
      return fetchAllProducts(pageParam)
    },
    getNextPageParam: (lastPage: PaginatedProducts) => {
      const nextPage = lastPage.page + 1
      return nextPage <= lastPage.totalPages ? nextPage : undefined
    },
    initialPageParam: 1,
    staleTime: 60000,
  })

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const products = data?.pages.flatMap((page) => page.products) || []
  const totalProducts = data?.pages[0]?.total || 0

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FilterBar onOpenFilters={() => setIsFilterOpen(true)} />
        <div className="mt-12 text-center">
          <PackageX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Erro ao carregar produtos</p>
          <p className="text-muted-foreground mt-1">
            Tente novamente em alguns instantes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Category Pills - Horizontal scroll */}
      <CategoryPills />

      <div className="container mx-auto px-4 py-4">
        {/* Filter Bar */}
        <FilterBar
          totalProducts={totalProducts}
          onOpenFilters={() => setIsFilterOpen(true)}
        />

        {/* Products Grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhum produto encontrado</p>
              <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                Tente ajustar sua busca ou explorar outras categorias
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasNextPage && (
                <div ref={ref} className="flex justify-center items-center py-8">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">Carregando mais...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filter Sheet - Mobile */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialValues={filters}
        totalResults={totalProducts}
      />
    </div>
  )
}
