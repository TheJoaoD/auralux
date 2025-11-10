/**
 * Catalog React Query Hooks
 * Epic 2 - Story 2.1: Criar Serviço de Catálogo
 *
 * Wraps catalog service functions with React Query for caching and state management
 */

'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
  fetchFeaturedProducts,
  fetchNewProducts,
  fetchProductsByCategory,
  fetchSearchProducts,
  fetchProductDetails,
  fetchCategories,
} from '@/app/catalogo/actions/catalog'
import type { CatalogProduct, PaginatedProducts } from '@/lib/services/catalog'

/**
 * Get featured products (6 items)
 * Cached for 60 seconds - these change rarely
 */
export function useFeaturedProducts(): UseQueryResult<CatalogProduct[]> {
  return useQuery({
    queryKey: ['catalog', 'featured'],
    queryFn: () => fetchFeaturedProducts(),
    staleTime: 60000, // 60s - aggressive caching
    gcTime: 300000, // 5min garbage collection
  })
}

/**
 * Get newest products
 * Cached for 60 seconds
 */
export function useNewProducts(
  limit: number = 10
): UseQueryResult<CatalogProduct[]> {
  return useQuery({
    queryKey: ['catalog', 'new', limit],
    queryFn: () => fetchNewProducts(limit),
    staleTime: 60000,
    gcTime: 300000,
  })
}

/**
 * Get products by category with pagination
 * Cached per category + page
 */
export function useProductsByCategory(
  categoryId: string,
  page: number = 1,
  perPage: number = 20
): UseQueryResult<PaginatedProducts> {
  return useQuery({
    queryKey: ['catalog', 'category', categoryId, page, perPage],
    queryFn: () => fetchProductsByCategory(categoryId, page, perPage),
    staleTime: 60000,
    gcTime: 300000,
    enabled: !!categoryId, // Only run if categoryId exists
  })
}

/**
 * Search products by name
 * Only enabled when query has 2+ characters
 */
export function useSearchProducts(
  query: string,
  page: number = 1,
  perPage: number = 50
): UseQueryResult<PaginatedProducts> {
  return useQuery({
    queryKey: ['catalog', 'search', query, page, perPage],
    queryFn: () => fetchSearchProducts(query, page, perPage),
    staleTime: 30000, // 30s - search results can be slightly fresher
    gcTime: 180000, // 3min
    enabled: query.trim().length >= 2, // Only search with 2+ chars
  })
}

/**
 * Get product details by ID
 * Cached for 5 minutes - product details change rarely
 */
export function useProductDetails(
  productId: string
): UseQueryResult<CatalogProduct | null> {
  return useQuery({
    queryKey: ['catalog', 'product', productId],
    queryFn: () => fetchProductDetails(productId),
    staleTime: 300000, // 5min - product details very stable
    gcTime: 600000, // 10min
    enabled: !!productId, // Only run if productId exists
  })
}

/**
 * Get all categories with product counts
 * Cached for 5 minutes - categories change very rarely
 */
export function useCategories(): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: () => fetchCategories(),
    staleTime: 300000, // 5min
    gcTime: 600000, // 10min
  })
}

/**
 * Prefetch utilities for SSR/ISR optimization
 */
export const catalogQueryKeys = {
  featured: ['catalog', 'featured'] as const,
  new: (limit: number) => ['catalog', 'new', limit] as const,
  category: (categoryId: string, page: number, perPage: number) =>
    ['catalog', 'category', categoryId, page, perPage] as const,
  search: (query: string, limit: number) =>
    ['catalog', 'search', query, limit] as const,
  product: (productId: string) => ['catalog', 'product', productId] as const,
  categories: ['catalog', 'categories'] as const,
}
