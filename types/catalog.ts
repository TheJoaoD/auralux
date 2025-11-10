/**
 * Catalog Types
 * Epic 1 - Story 1.4: Estrutura de Rotas e Layout
 */

import { Database } from './supabase'

// Catalog User types
export type CatalogUser = Database['public']['Tables']['catalog_users']['Row']
export type CatalogUserInsert =
  Database['public']['Tables']['catalog_users']['Insert']
export type CatalogUserUpdate =
  Database['public']['Tables']['catalog_users']['Update']

// Catalog Item types (extended products for catalog)
export type CatalogItem = Database['public']['Tables']['catalog_items']['Row']
export type CatalogItemInsert =
  Database['public']['Tables']['catalog_items']['Insert']
export type CatalogItemUpdate =
  Database['public']['Tables']['catalog_items']['Update']

// Catalog Favorite types
export type CatalogFavorite =
  Database['public']['Tables']['catalog_favorites']['Row']
export type CatalogFavoriteInsert =
  Database['public']['Tables']['catalog_favorites']['Insert']

// Catalog Cart types
export type CatalogCart = Database['public']['Tables']['catalog_cart']['Row']
export type CatalogCartInsert =
  Database['public']['Tables']['catalog_cart']['Insert']
export type CatalogCartUpdate =
  Database['public']['Tables']['catalog_cart']['Update']

// Catalog Request types
export type CatalogRequest =
  Database['public']['Tables']['catalog_requests']['Row']
export type CatalogRequestInsert =
  Database['public']['Tables']['catalog_requests']['Insert']
export type CatalogRequestUpdate =
  Database['public']['Tables']['catalog_requests']['Update']

// Catalog Order types
export type CatalogOrder = Database['public']['Tables']['catalog_orders']['Row']
export type CatalogOrderInsert =
  Database['public']['Tables']['catalog_orders']['Insert']

// Catalog Product View types (analytics)
export type CatalogProductView =
  Database['public']['Tables']['catalog_product_views']['Row']
export type CatalogProductViewInsert =
  Database['public']['Tables']['catalog_product_views']['Insert']

// Extended types with relations
export interface CatalogProductWithDetails extends CatalogItem {
  product: {
    id: string
    name: string
    sku: string | null
    image_url: string | null
    sale_price: number
    quantity: number
    category: {
      id: string
      name: string
      color: string | null
    } | null
  }
  is_favorite?: boolean
  in_cart?: boolean
}

export interface CatalogCartWithProduct extends CatalogCart {
  product: {
    id: string
    name: string
    image_url: string | null
    sale_price: number
    quantity: number
  }
}

export interface CatalogFavoriteWithProduct extends CatalogFavorite {
  product: {
    id: string
    name: string
    image_url: string | null
    sale_price: number
    quantity: number
  }
}

// Frontend-only types
export interface CatalogAuthState {
  isAuthenticated: boolean
  user: CatalogUser | null
  isLoading: boolean
}

export interface CatalogFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest'
}
