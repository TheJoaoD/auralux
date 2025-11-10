/**
 * Orders Server Actions
 * Epic 3 - Story 3.3: WhatsApp Checkout
 */

'use server'

import { createOrder, getUserOrders, type CreateOrderData } from '@/lib/services/catalog-orders'

export async function createCatalogOrder(data: CreateOrderData) {
  return createOrder(data)
}

export async function fetchUserOrders() {
  return getUserOrders()
}
