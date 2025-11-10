/**
 * Catalog Service - Data Layer
 * Epic 2 - Story 2.1: Criar Serviço de Catálogo
 *
 * Handles all catalog product queries with RLS enforcement
 */

import { createClient } from '@/lib/supabase/server'

// Product with catalog details interface
export interface CatalogProduct {
  id: string
  product_id: string
  name: string
  sku: string | null
  image_url: string | null
  sale_price: number
  cost_price: number
  quantity: number
  category_id: string | null
  category?: {
    id: string
    name: string
    color: string | null
  } | null
  // Catalog-specific fields
  visible: boolean
  featured: boolean
  featured_order: number | null
  fragrance_notes_top: string | null
  fragrance_notes_heart: string | null
  fragrance_notes_base: string | null
  occasion: string[] | null
  intensity: string | null
  longevity: string | null
  stock_return_date: string | null
  created_at: string
}

export interface PaginatedProducts {
  products: CatalogProduct[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

/**
 * Get featured products (visible = true AND featured = true)
 * Returns up to 6 products ordered by featured_order
 */
export async function getFeaturedProducts(
  limit: number = 6
): Promise<CatalogProduct[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      product_id,
      visible,
      featured,
      featured_order,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      created_at,
      products!inner (
        id,
        name,
        sku,
        image_url,
        sale_price,
        cost_price,
        quantity,
        category_id,
        categories (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('visible', true)
    .eq('featured', true)
    .order('featured_order', { ascending: true, nullsFirst: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch featured products: ${error.message}`)
  }

  return transformCatalogItems(data)
}

/**
 * Get newest products (visible = true)
 * Returns last N products by created_at DESC
 */
export async function getNewProducts(
  limit: number = 10
): Promise<CatalogProduct[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      product_id,
      visible,
      featured,
      featured_order,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      created_at,
      products!inner (
        id,
        name,
        sku,
        image_url,
        sale_price,
        cost_price,
        quantity,
        category_id,
        categories (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch new products: ${error.message}`)
  }

  return transformCatalogItems(data)
}

/**
 * Get products by category with pagination
 */
export async function getProductsByCategory(
  categoryId: string,
  page: number = 1,
  perPage: number = 20
): Promise<PaginatedProducts> {
  const supabase = await createClient()

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Get total count
  const { count } = await supabase
    .from('catalog_items')
    .select('id', { count: 'exact', head: true })
    .eq('visible', true)
    .eq('products.category_id', categoryId)

  // Get paginated data
  const { data, error } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      product_id,
      visible,
      featured,
      featured_order,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      created_at,
      products!inner (
        id,
        name,
        sku,
        image_url,
        sale_price,
        cost_price,
        quantity,
        category_id,
        categories (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('visible', true)
    .eq('products.category_id', categoryId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(
      `Failed to fetch products by category: ${error.message}`
    )
  }

  const totalPages = Math.ceil((count || 0) / perPage)

  return {
    products: transformCatalogItems(data),
    total: count || 0,
    page,
    perPage,
    totalPages,
  }
}

/**
 * Search products by name (ILIKE) with pagination
 */
export async function searchProducts(
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<PaginatedProducts> {
  if (!query || query.trim().length < 2) {
    return {
      products: [],
      total: 0,
      page,
      perPage,
      totalPages: 0,
    }
  }

  const supabase = await createClient()

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Get total count
  const { count } = await supabase
    .from('catalog_items')
    .select('id', { count: 'exact', head: true })
    .eq('visible', true)
    .ilike('products.name', `%${query}%`)

  const { data, error } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      product_id,
      visible,
      featured,
      featured_order,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      created_at,
      products!inner (
        id,
        name,
        sku,
        image_url,
        sale_price,
        cost_price,
        quantity,
        category_id,
        categories (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('visible', true)
    .ilike('products.name', `%${query}%`)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to search products: ${error.message}`)
  }

  const totalPages = Math.ceil((count || 0) / perPage)

  return {
    products: transformCatalogItems(data),
    total: count || 0,
    page,
    perPage,
    totalPages,
  }
}

/**
 * Get product details by ID
 */
export async function getProductDetails(
  productId: string
): Promise<CatalogProduct | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      product_id,
      visible,
      featured,
      featured_order,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      created_at,
      products!inner (
        id,
        name,
        sku,
        image_url,
        sale_price,
        cost_price,
        quantity,
        category_id,
        categories (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('visible', true)
    .eq('product_id', productId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    throw new Error(`Failed to fetch product details: ${error.message}`)
  }

  const transformed = transformCatalogItems([data])
  return transformed[0] || null
}

/**
 * Get all categories with product count
 */
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      id,
      name,
      color,
      products!inner (
        id,
        catalog_items!inner (
          visible
        )
      )
    `
    )
    .eq('products.catalog_items.visible', true)

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data
}

/**
 * Get all products with pagination (no filters)
 * Used for default product listing page
 */
export async function getAllProducts(
  page: number = 1,
  perPage: number = 20
): Promise<PaginatedProducts> {
  const supabase = await createClient()

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Get total count
  const { count } = await supabase
    .from('catalog_items')
    .select('id', { count: 'exact', head: true })
    .eq('visible', true)

  // Get paginated data
  const { data, error } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      product_id,
      visible,
      featured,
      featured_order,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      created_at,
      products!inner (
        id,
        name,
        sku,
        image_url,
        sale_price,
        cost_price,
        quantity,
        category_id,
        categories (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch all products: ${error.message}`)
  }

  const totalPages = Math.ceil((count || 0) / perPage)

  return {
    products: transformCatalogItems(data),
    total: count || 0,
    page,
    perPage,
    totalPages,
  }
}

/**
 * Search products by name with category filter
 * Combines search + category filtering
 */
export async function searchProductsWithCategory(
  query: string,
  categoryId: string,
  page: number = 1,
  perPage: number = 20
): Promise<PaginatedProducts> {
  if (!query || query.trim().length < 2) {
    // Fallback to category-only filter
    return getProductsByCategory(categoryId, page, perPage)
  }

  const supabase = await createClient()

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Get total count
  const { count } = await supabase
    .from('catalog_items')
    .select('id', { count: 'exact', head: true })
    .eq('visible', true)
    .eq('products.category_id', categoryId)
    .ilike('products.name', `%${query}%`)

  // Get paginated data
  const { data, error } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      product_id,
      visible,
      featured,
      featured_order,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      created_at,
      products!inner (
        id,
        name,
        sku,
        image_url,
        sale_price,
        cost_price,
        quantity,
        category_id,
        categories (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('visible', true)
    .eq('products.category_id', categoryId)
    .ilike('products.name', `%${query}%`)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(
      `Failed to search products with category: ${error.message}`
    )
  }

  const totalPages = Math.ceil((count || 0) / perPage)

  return {
    products: transformCatalogItems(data),
    total: count || 0,
    page,
    perPage,
    totalPages,
  }
}

// Helper function to transform Supabase nested response
function transformCatalogItems(data: any[]): CatalogProduct[] {
  return data.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    name: item.products.name,
    sku: item.products.sku,
    image_url: item.products.image_url,
    sale_price: item.products.sale_price,
    cost_price: item.products.cost_price,
    quantity: item.products.quantity,
    category_id: item.products.category_id,
    category: item.products.categories,
    visible: item.visible,
    featured: item.featured,
    featured_order: item.featured_order,
    fragrance_notes_top: item.fragrance_notes_top,
    fragrance_notes_heart: item.fragrance_notes_heart,
    fragrance_notes_base: item.fragrance_notes_base,
    occasion: item.occasion,
    intensity: item.intensity,
    longevity: item.longevity,
    stock_return_date: item.stock_return_date,
    created_at: item.created_at,
  }))
}
