/**
 * Favorites React Query Hooks
 * Epic 3 - Story 3.1: Sistema de Favoritos
 *
 * Provides optimistic updates and caching for favorites
 */

'use client'

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import {
  addToFavorites,
  removeFromFavorites,
  fetchUserFavorites,
  checkIsFavorite,
  fetchFavoritesCount,
} from '@/app/catalogo/actions/favorites'
import { toast } from 'sonner'
import type { FavoriteProduct } from '@/lib/services/catalog-favorites'

/**
 * Get all user favorites
 */
export function useFavorites(): UseQueryResult<FavoriteProduct[]> {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => fetchUserFavorites(),
    staleTime: 60000, // 60s
    gcTime: 300000, // 5min
  })
}

/**
 * Get favorites count for badge
 */
export function useFavoritesCount(): UseQueryResult<number> {
  return useQuery({
    queryKey: ['favorites', 'count'],
    queryFn: () => fetchFavoritesCount(),
    staleTime: 60000,
    gcTime: 300000,
  })
}

/**
 * Check if specific product is favorited
 */
export function useIsFavorite(productId: string): UseQueryResult<boolean> {
  return useQuery({
    queryKey: ['favorite', productId],
    queryFn: () => checkIsFavorite(productId),
    staleTime: 60000,
    enabled: !!productId,
  })
}

/**
 * Add product to favorites with optimistic update
 */
export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => addToFavorites(productId),
    onMutate: async (productId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      await queryClient.cancelQueries({ queryKey: ['favorite', productId] })

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData(['favorites'])
      const previousIsFavorite = queryClient.getQueryData(['favorite', productId])

      // Optimistically update isFavorite
      queryClient.setQueryData(['favorite', productId], true)

      // Optimistically increment count
      queryClient.setQueryData(['favorites', 'count'], (old: number = 0) => old + 1)

      return { previousFavorites, previousIsFavorite }
    },
    onError: (_error, productId, context) => {
      // Rollback on error
      if (context) {
        queryClient.setQueryData(['favorites'], context.previousFavorites)
        queryClient.setQueryData(['favorite', productId], context.previousIsFavorite)
      }
      toast.error('Erro ao adicionar aos favoritos')
    },
    onSuccess: () => {
      toast.success('Adicionado aos favoritos')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

/**
 * Remove product from favorites with optimistic update
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => removeFromFavorites(productId),
    onMutate: async (productId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      await queryClient.cancelQueries({ queryKey: ['favorite', productId] })

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData(['favorites'])
      const previousIsFavorite = queryClient.getQueryData(['favorite', productId])

      // Optimistically update isFavorite
      queryClient.setQueryData(['favorite', productId], false)

      // Optimistically update favorites list
      queryClient.setQueryData(['favorites'], (old: FavoriteProduct[] = []) =>
        old.filter((fav) => fav.product_id !== productId)
      )

      // Optimistically decrement count
      queryClient.setQueryData(['favorites', 'count'], (old: number = 0) => Math.max(0, old - 1))

      return { previousFavorites, previousIsFavorite }
    },
    onError: (_error, productId, context) => {
      // Rollback on error
      if (context) {
        queryClient.setQueryData(['favorites'], context.previousFavorites)
        queryClient.setQueryData(['favorite', productId], context.previousIsFavorite)
      }
      toast.error('Erro ao remover dos favoritos')
    },
    onSuccess: () => {
      toast.success('Removido dos favoritos')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

/**
 * Toggle favorite status
 */
export function useToggleFavorite() {
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()

  return {
    toggle: (productId: string, currentStatus: boolean) => {
      if (currentStatus) {
        removeFavorite.mutate(productId)
      } else {
        addFavorite.mutate(productId)
      }
    },
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  }
}
