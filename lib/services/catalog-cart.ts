/**
 * Catalog Cart Service
 * Epic 3 - Story 3.2: Sistema de Carrinho
 *
 * Manages shopping cart with stock validation and RLS enforcement
 */

import { createClient } from '@/lib/supabase/server'

export interface CartItem {
  id: string
  user_whatsapp: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    sale_price: number
    image_url: string | null
    quantity: number
    sku: string | null
    category?: {
      id: string
      name: string
    }
  }
}

/**
 * Add product to cart or update quantity if already exists
 */
export async function addToCart(productId: string, quantity: number = 1): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Validate stock availability
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('quantity')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    throw new Error('Product not found')
  }

  if (product.quantity < quantity) {
    throw new Error(`Estoque limitado a ${product.quantity} unidades`)
  }

  if (product.quantity === 0) {
    throw new Error('Produto fora de estoque')
  }

  const userPhone = user.phone || user.email || ''

  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from('catalog_cart')
    .select('id, quantity')
    .eq('product_id', productId)
    .eq('user_whatsapp', userPhone)
    .single()

  if (existing) {
    // Update existing quantity
    const newQuantity = existing.quantity + quantity

    if (newQuantity > product.quantity) {
      throw new Error(`Estoque limitado a ${product.quantity} unidades`)
    }

    const { error } = await supabase
      .from('catalog_cart')
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      throw new Error(`Failed to update cart: ${error.message}`)
    }
  } else {
    // Insert new item
    const { error } = await supabase
      .from('catalog_cart')
      .insert({
        product_id: productId,
        user_whatsapp: userPhone,
        quantity,
      })

    if (error) {
      throw new Error(`Failed to add to cart: ${error.message}`)
    }
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productId: string): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('catalog_cart')
    .delete()
    .eq('product_id', productId)
    .eq('user_whatsapp', user.phone || user.email || '')

  if (error) {
    throw new Error(`Failed to remove from cart: ${error.message}`)
  }
}

/**
 * Update cart item quantity with stock validation
 */
export async function updateCartQuantity(productId: string, quantity: number): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    return removeFromCart(productId)
  }

  // Validate stock
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('quantity')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    throw new Error('Product not found')
  }

  if (quantity > product.quantity) {
    throw new Error(`Estoque limitado a ${product.quantity} unidades`)
  }

  const { error } = await supabase
    .from('catalog_cart')
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq('product_id', productId)
    .eq('user_whatsapp', user.phone || user.email || '')

  if (error) {
    throw new Error(`Failed to update quantity: ${error.message}`)
  }
}

/**
 * Get user's cart with product details
 */
export async function getUserCart(): Promise<CartItem[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('catalog_cart')
    .select(`
      id,
      user_whatsapp,
      product_id,
      quantity,
      created_at,
      updated_at,
      product:products!inner(
        id,
        name,
        sale_price,
        image_url,
        quantity,
        sku,
        category:categories(
          id,
          name
        )
      )
    `)
    .eq('user_whatsapp', user.phone || user.email || '')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch cart: ${error.message}`)
  }

  return data || []
}

/**
 * Get cart items count
 */
export async function getCartCount(): Promise<number> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  const { count, error } = await supabase
    .from('catalog_cart')
    .select('*', { count: 'exact', head: true })
    .eq('user_whatsapp', user.phone || user.email || '')

  if (error) {
    console.error('Failed to get cart count:', error)
    return 0
  }

  return count || 0
}

/**
 * Get cart total (sum of all items' price * quantity)
 */
export async function getCartTotal(): Promise<number> {
  const cart = await getUserCart()

  return cart.reduce((total, item) => {
    if (item.product) {
      return total + (item.product.sale_price * item.quantity)
    }
    return total
  }, 0)
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('catalog_cart')
    .delete()
    .eq('user_whatsapp', user.phone || user.email || '')

  if (error) {
    throw new Error(`Failed to clear cart: ${error.message}`)
  }
}
