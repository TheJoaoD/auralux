/**
 * Catalog Admin Server Actions
 * Epic 4 - Story 4.1 & 4.2: Admin Catalog Management
 */

'use server'

import {
  getCatalogMetrics,
  getAdminProductsList,
  toggleProductVisibility,
  toggleProductFeatured,
  getProductCategories,
  type ProductsListParams,
} from '@/lib/services/catalog-admin'

export async function fetchCatalogMetrics() {
  return getCatalogMetrics()
}

export async function fetchAdminProducts(params: ProductsListParams = {}) {
  return getAdminProductsList(params)
}

export async function updateProductVisibility(productId: string, visible: boolean) {
  return toggleProductVisibility(productId, visible)
}

export async function updateProductFeatured(productId: string, featured: boolean) {
  return toggleProductFeatured(productId, featured)
}

export async function fetchCategories() {
  return getProductCategories()
}
