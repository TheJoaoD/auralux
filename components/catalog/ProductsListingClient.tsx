/**
 * Products Listing Client Component
 * Epic 2 - Story 2.3: Listagem de Produtos com Filtros
 *
 * Handles infinite scroll, filters, and search
 */

'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { FilterBar } from './FilterBar'
import { CategoryNav } from './CategoryNav'
import {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchSearchProducts,
  fetchSearchProductsWithCategory,
} from '@/app/catalogo/actions/catalog'
import type { PaginatedProducts } from '@/lib/services/catalog'

export function ProductsListingClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoria')
  const query = searchParams.get('q')

  const { ref, inView } = useInView()

  // Infinite query for products
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['catalog-products', categoryId, query],
    queryFn: async ({ pageParam = 1 }) => {
      // Combined: search + category
      if (query && categoryId) {
        return fetchSearchProductsWithCategory(query, categoryId, pageParam)
      }

      // Search only
      if (query) {
        return fetchSearchProducts(query, pageParam)
      }

      // Category only
      if (categoryId) {
        return fetchProductsByCategory(categoryId, pageParam)
      }

      // No filters: all products
      return fetchAllProducts(pageParam)
    },
    getNextPageParam: (lastPage: PaginatedProducts) => {
      const nextPage = lastPage.page + 1
      return nextPage <= lastPage.totalPages ? nextPage : undefined
    },
    initialPageParam: 1,
    staleTime: 60000, // 1 minute
  })

  // Trigger fetch when scroll trigger is visible
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Flatten pages
  const products = data?.pages.flatMap((page) => page.products) || []

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <FilterBar />
        <div className="mt-8 text-center">
          <p className="text-red-500">
            Não foi possível carregar produtos. Tente novamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CategoryNav />
      <div className="container mx-auto px-4 py-6">
        <FilterBar />

      {/* Products Grid */}
      <div className="mt-8">
        {isLoading ? (
          // Loading State
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado. Tente outra busca ou categoria.
            </p>
          </div>
        ) : (
          <>
            {/* Products */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div
                ref={ref}
                className="flex justify-center items-center py-8"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Carregando mais produtos...</span>
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  )
}
