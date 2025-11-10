/**
 * Cart Server Actions
 * Epic 3 - Story 3.2: Sistema de Carrinho
 */

'use server'

import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getUserCart,
  getCartCount,
  getCartTotal,
  clearCart,
} from '@/lib/services/catalog-cart'

export async function addProductToCart(productId: string, quantity: number = 1) {
  return addToCart(productId, quantity)
}

export async function removeProductFromCart(productId: string) {
  return removeFromCart(productId)
}

export async function updateProductQuantity(productId: string, quantity: number) {
  return updateCartQuantity(productId, quantity)
}

export async function fetchUserCart() {
  return getUserCart()
}

export async function fetchCartCount() {
  return getCartCount()
}

export async function fetchCartTotal() {
  return getCartTotal()
}

export async function clearUserCart() {
  return clearCart()
}
