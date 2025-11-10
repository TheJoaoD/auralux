# Service Layer & API Contracts

## Service Architecture

```
lib/services/
├── catalog.ts              # Product queries
├── catalog-auth.ts         # Authentication (covered above)
├── catalog-favorites.ts    # Favorites management
├── catalog-cart.ts         # Cart management
├── catalog-requests.ts     # Product requests
├── catalog-orders.ts       # Order creation
├── catalog-analytics.ts    # View tracking & analytics
└── catalog-realtime.ts     # Realtime subscriptions
```

## catalog.ts (Product Service)

```typescript
// lib/services/catalog.ts
import { createClient } from '@/lib/supabase/client'

export interface CatalogProduct {
  id: string
  name: string
  sku: string | null
  image_url: string | null
  sale_price: number
  quantity: number
  category_id: string | null
  category?: {
    id: string
    name: string
    color: string | null
  }
  catalog_details?: {
    fragrance_notes_top: string | null
    fragrance_notes_heart: string | null
    fragrance_notes_base: string | null
    occasion: string[] | null
    intensity: string | null
    longevity: string | null
    stock_return_date: string | null
  }
}

export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      product_id,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      products:product_id (
        id,
        name,
        sku,
        image_url,
        sale_price,
        quantity,
        category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .eq('featured', true)
    .order('featured_order', { ascending: true })
    .limit(6)

  if (error) throw error

  return data.map(item => ({
    ...item.products,
    catalog_details: {
      fragrance_notes_top: item.fragrance_notes_top,
      fragrance_notes_heart: item.fragrance_notes_heart,
      fragrance_notes_base: item.fragrance_notes_base,
      occasion: item.occasion,
      intensity: item.intensity,
      longevity: item.longevity,
      stock_return_date: item.stock_return_date
    }
  }))
}

export async function getNewProducts(limit = 10): Promise<CatalogProduct[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      created_at,
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data.map(item => item.products)
}

export async function getProductsByCategory(
  categoryId: string,
  page = 1,
  perPage = 20
): Promise<{ products: CatalogProduct[], total: number }> {
  const supabase = createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await supabase
    .from('catalog_items')
    .select(`
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `, { count: 'exact' })
    .eq('visible', true)
    .eq('products.category_id', categoryId)
    .range(from, to)

  if (error) throw error
  return { products: data.map(item => item.products), total: count || 0 }
}

export async function searchProducts(query: string): Promise<CatalogProduct[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .ilike('products.name', `%${query}%`)
    .limit(50)

  if (error) throw error
  return data.map(item => item.products)
}

export async function getProductDetails(productId: string): Promise<CatalogProduct | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .eq('product_id', productId)
    .single()

  if (error) return null

  return {
    ...data.products,
    catalog_details: {
      fragrance_notes_top: data.fragrance_notes_top,
      fragrance_notes_heart: data.fragrance_notes_heart,
      fragrance_notes_base: data.fragrance_notes_base,
      occasion: data.occasion,
      intensity: data.intensity,
      longevity: data.longevity,
      stock_return_date: data.stock_return_date
    }
  }
}
```

## React Query Hooks

```typescript
// lib/hooks/use-catalog.ts
import { useQuery } from '@tanstack/react-query'
import * as catalogService from '@/lib/services/catalog'

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['catalog', 'featured'],
    queryFn: catalogService.getFeaturedProducts,
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useNewProducts(limit = 10) {
  return useQuery({
    queryKey: ['catalog', 'new', limit],
    queryFn: () => catalogService.getNewProducts(limit),
    staleTime: 60 * 1000,
  })
}

export function useProductsByCategory(categoryId: string, page = 1) {
  return useQuery({
    queryKey: ['catalog', 'category', categoryId, page],
    queryFn: () => catalogService.getProductsByCategory(categoryId, page),
    staleTime: 60 * 1000,
    enabled: !!categoryId,
  })
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['catalog', 'search', query],
    queryFn: () => catalogService.searchProducts(query),
    staleTime: 60 * 1000,
    enabled: query.length >= 2,
  })
}

export function useProductDetails(productId: string) {
  return useQuery({
    queryKey: ['catalog', 'product', productId],
    queryFn: () => catalogService.getProductDetails(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId,
  })
}
```

---
