/**
 * Catalog Favorites Service
 * Epic 3 - Story 3.1: Sistema de Favoritos
 *
 * Manages user favorite products with RLS enforcement
 */

import { createClient } from '@/lib/supabase/server'

export interface FavoriteProduct {
  id: string
  user_whatsapp: string
  product_id: string
  created_at: string
  product?: {
    id: string
    name: string
    sale_price: number
    image_url: string | null
    quantity: number
    category?: {
      id: string
      name: string
    }
  }
}

/**
 * Add product to user's favorites
 * RLS ensures only authenticated user can add to their favorites
 */
export async function addFavorite(productId: string): Promise<void> {
  const supabase = await createClient()

  // Get current user from auth context
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('catalog_favorites')
    .insert({
      product_id: productId,
      user_whatsapp: user.phone || user.email || '',
    })

  if (error) {
    // Ignore duplicate constraint errors (already favorited)
    if (error.code !== '23505') {
      throw new Error(`Failed to add favorite: ${error.message}`)
    }
  }
}

/**
 * Remove product from user's favorites
 */
export async function removeFavorite(productId: string): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('catalog_favorites')
    .delete()
    .eq('product_id', productId)
    .eq('user_whatsapp', user.phone || user.email || '')

  if (error) {
    throw new Error(`Failed to remove favorite: ${error.message}`)
  }
}

/**
 * Get all user's favorite products with product details
 */
export async function getUserFavorites(): Promise<FavoriteProduct[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('catalog_favorites')
    .select(`
      id,
      user_whatsapp,
      product_id,
      created_at,
      product:products!inner(
        id,
        name,
        sale_price,
        image_url,
        quantity,
        category:categories(
          id,
          name
        )
      )
    `)
    .eq('user_whatsapp', user.phone || user.email || '')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch favorites: ${error.message}`)
  }

  return data || []
}

/**
 * Check if a product is in user's favorites
 */
export async function isFavorite(productId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('catalog_favorites')
    .select('id')
    .eq('product_id', productId)
    .eq('user_whatsapp', user.phone || user.email || '')
    .single()

  if (error) {
    // Not found is not an error for this check
    if (error.code === 'PGRST116') {
      return false
    }
    throw new Error(`Failed to check favorite: ${error.message}`)
  }

  return !!data
}

/**
 * Get count of user's favorites
 */
export async function getFavoritesCount(): Promise<number> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  const { count, error } = await supabase
    .from('catalog_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_whatsapp', user.phone || user.email || '')

  if (error) {
    console.error('Failed to get favorites count:', error)
    return 0
  }

  return count || 0
}
