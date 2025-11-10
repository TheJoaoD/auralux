/**
 * Favorites Server Actions
 * Epic 3 - Story 3.1: Sistema de Favoritos
 */

'use server'

import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isFavorite,
  getFavoritesCount,
} from '@/lib/services/catalog-favorites'

export async function addToFavorites(productId: string) {
  return addFavorite(productId)
}

export async function removeFromFavorites(productId: string) {
  return removeFavorite(productId)
}

export async function fetchUserFavorites() {
  return getUserFavorites()
}

export async function checkIsFavorite(productId: string) {
  return isFavorite(productId)
}

export async function fetchFavoritesCount() {
  return getFavoritesCount()
}
