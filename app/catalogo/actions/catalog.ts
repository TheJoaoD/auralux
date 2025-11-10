/**
 * Catalog Server Actions
 * Wrappers for catalog service functions to be used in client components
 */

'use server'

import {
  getFeaturedProducts,
  getNewProducts,
  getProductsByCategory,
  getAllProducts,
  searchProducts,
  searchProductsWithCategory,
  getProductDetails,
  getCategories,
} from '@/lib/services/catalog'

export async function fetchFeaturedProducts() {
  return getFeaturedProducts()
}

export async function fetchNewProducts(limit: number = 10) {
  return getNewProducts(limit)
}

export async function fetchProductsByCategory(
  categoryId: string,
  page: number = 1,
  perPage: number = 20
) {
  return getProductsByCategory(categoryId, page, perPage)
}

export async function fetchAllProducts(page: number = 1, perPage: number = 20) {
  return getAllProducts(page, perPage)
}

export async function fetchSearchProducts(
  query: string,
  page: number = 1,
  perPage: number = 20
) {
  return searchProducts(query, page, perPage)
}

export async function fetchSearchProductsWithCategory(
  query: string,
  categoryId: string,
  page: number = 1,
  perPage: number = 20
) {
  return searchProductsWithCategory(query, categoryId, page, perPage)
}

export async function fetchProductDetails(productId: string) {
  return getProductDetails(productId)
}

export async function fetchCategories() {
  return getCategories()
}
