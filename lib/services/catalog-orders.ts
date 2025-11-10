/**
 * Catalog Orders Service
 * Epic 3 - Story 3.3: WhatsApp Checkout
 *
 * Manages order creation and tracking
 */

import { createClient } from '@/lib/supabase/server'
import type { CartItem } from './catalog-cart'

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface CreateOrderData {
  items: OrderItem[]
  total_amount: number
  user_whatsapp: string
  user_name: string
}

/**
 * Create order record in database
 * Status: 'sent' (enviado via WhatsApp, aguardando confirmação do gestor)
 */
export async function createOrder(data: CreateOrderData): Promise<string> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data: order, error } = await supabase
    .from('catalog_orders')
    .insert({
      user_whatsapp: data.user_whatsapp,
      user_name: data.user_name,
      items: data.items,
      total_amount: data.total_amount,
      status: 'sent',
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`)
  }

  return order.id
}

/**
 * Convert cart items to order items format
 */
export function cartToOrderItems(cart: CartItem[]): OrderItem[] {
  return cart.map((item) => {
    const product = item.product
    if (!product) {
      throw new Error('Product data missing from cart item')
    }

    return {
      product_id: item.product_id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: product.sale_price,
      total_price: product.sale_price * item.quantity,
    }
  })
}

/**
 * Get user's orders history
 */
export async function getUserOrders() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('catalog_orders')
    .select('*')
    .eq('user_whatsapp', user.phone || user.email || '')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return data || []
}
