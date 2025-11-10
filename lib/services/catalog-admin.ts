/**
 * Catalog Admin Service
 * Epic 4 - Story 4.1 & 4.2: Admin Catalog Management
 *
 * Manages catalog administration operations
 */

import { createClient } from '@/lib/supabase/server'

export interface CatalogMetrics {
  totalProducts: number
  featuredProducts: number
  pendingRequests: number
  ordersToday: number
}

export interface AdminProduct {
  id: string
  name: string
  category: string | null
  sale_price: number
  quantity: number
  image_url: string | null
  catalog_visible: boolean
  catalog_featured: boolean
}

export interface ProductsListParams {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Get catalog dashboard metrics
 */
export async function getCatalogMetrics(): Promise<CatalogMetrics> {
  const supabase = await createClient()

  // Total visible products
  const { count: totalProducts } = await supabase
    .from('catalog_items')
    .select('*', { count: 'exact', head: true })
    .eq('visible', true)

  // Featured products
  const { count: featuredProducts } = await supabase
    .from('catalog_items')
    .select('*', { count: 'exact', head: true })
    .eq('featured', true)

  // Pending requests
  const { count: pendingRequests } = await supabase
    .from('catalog_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Orders today
  const today = new Date().toISOString().split('T')[0]
  const { count: ordersToday } = await supabase
    .from('catalog_orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today)

  return {
    totalProducts: totalProducts || 0,
    featuredProducts: featuredProducts || 0,
    pendingRequests: pendingRequests || 0,
    ordersToday: ordersToday || 0,
  }
}

/**
 * Get products list for admin management
 */
export async function getAdminProductsList(params: ProductsListParams = {}) {
  const {
    page = 1,
    pageSize = 50,
    search = '',
    category = '',
    sortBy = 'name',
    sortOrder = 'asc',
  } = params

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      category_id,
      categories!category_id(name),
      sale_price,
      quantity,
      image_url,
      catalog_items!left(visible, featured)
    `, { count: 'exact' })

  // Search filter
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  // Category filter
  if (category) {
    query = query.eq('category_id', category)
  }

  // Sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  // Transform data to include catalog status
  const products: AdminProduct[] = (data || []).map((product: any) => ({
    id: product.id,
    name: product.name,
    category: product.categories?.name || null,
    sale_price: product.sale_price,
    quantity: product.quantity,
    image_url: product.image_url,
    catalog_visible: product.catalog_items?.[0]?.visible || false,
    catalog_featured: product.catalog_items?.[0]?.featured || false,
  }))

  return {
    products,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

/**
 * Toggle product visibility in catalog
 * Auto-creates catalog_items entry if it doesn't exist
 */
export async function toggleProductVisibility(
  productId: string,
  visible: boolean
): Promise<void> {
  const supabase = await createClient()

  // Check if catalog_item exists
  const { data: existing } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('catalog_items')
      .update({ visible, updated_at: new Date().toISOString() })
      .eq('product_id', productId)

    if (error) {
      throw new Error(`Failed to update visibility: ${error.message}`)
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('catalog_items')
      .insert({ product_id: productId, visible })

    if (error) {
      throw new Error(`Failed to create catalog item: ${error.message}`)
    }
  }
}

/**
 * Toggle product featured status in catalog
 */
export async function toggleProductFeatured(
  productId: string,
  featured: boolean
): Promise<void> {
  const supabase = await createClient()

  // If setting to featured, get max featured_order
  let featuredOrder = null
  if (featured) {
    const { data: maxOrder } = await supabase
      .from('catalog_items')
      .select('featured_order')
      .eq('featured', true)
      .order('featured_order', { ascending: false })
      .limit(1)
      .single()

    featuredOrder = (maxOrder?.featured_order ?? -1) + 1
  }

  // Check if catalog_item exists
  const { data: existing } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('catalog_items')
      .update({
        featured,
        featured_order: featuredOrder,
        updated_at: new Date().toISOString()
      })
      .eq('product_id', productId)

    if (error) {
      throw new Error(`Failed to update featured: ${error.message}`)
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('catalog_items')
      .insert({ product_id: productId, featured, featured_order: featuredOrder })

    if (error) {
      throw new Error(`Failed to create catalog item: ${error.message}`)
    }
  }
}

/**
 * Get all categories for filter
 */
export async function getProductCategories(): Promise<Array<{ id: string; name: string }>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data || []
}
