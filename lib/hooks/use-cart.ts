/**
 * Cart React Query Hooks
 * Epic 3 - Story 3.2: Sistema de Carrinho
 *
 * Provides optimistic updates and caching for shopping cart
 */

'use client'

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  fetchUserCart,
  fetchCartCount,
  fetchCartTotal,
  clearUserCart,
} from '@/app/catalogo/actions/cart'
import { toast } from 'sonner'
import type { CartItem } from '@/lib/services/catalog-cart'

/**
 * Get user's cart
 */
export function useCart(): UseQueryResult<CartItem[]> {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => fetchUserCart(),
    staleTime: 30000, // 30s
    gcTime: 300000, // 5min
  })
}

/**
 * Get cart items count for badge
 */
export function useCartCount(): UseQueryResult<number> {
  return useQuery({
    queryKey: ['cart', 'count'],
    queryFn: () => fetchCartCount(),
    staleTime: 30000,
    gcTime: 300000,
  })
}

/**
 * Get cart total price
 */
export function useCartTotal(): UseQueryResult<number> {
  return useQuery({
    queryKey: ['cart', 'total'],
    queryFn: () => fetchCartTotal(),
    staleTime: 30000,
    gcTime: 300000,
  })
}

/**
 * Add product to cart with optimistic update
 */
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) =>
      addProductToCart(productId, quantity),
    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['cart'] })

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(['cart'])
      const previousCount = queryClient.getQueryData(['cart', 'count'])

      // Optimistically increment count
      queryClient.setQueryData(['cart', 'count'], (old: number = 0) => old + 1)

      return { previousCart, previousCount }
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context) {
        queryClient.setQueryData(['cart'], context.previousCart)
        queryClient.setQueryData(['cart', 'count'], context.previousCount)
      }
      toast.error('Erro ao adicionar ao carrinho')
    },
    onSuccess: () => {
      toast.success('Produto adicionado ao carrinho')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

/**
 * Remove product from cart with optimistic update
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => removeProductFromCart(productId),
    onMutate: async (productId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['cart'] })

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(['cart'])

      // Optimistically update cart list
      queryClient.setQueryData(['cart'], (old: CartItem[] = []) =>
        old.filter((item) => item.product_id !== productId)
      )

      // Optimistically decrement count
      queryClient.setQueryData(['cart', 'count'], (old: number = 0) => Math.max(0, old - 1))

      return { previousCart }
    },
    onError: (_error, _productId, context) => {
      // Rollback on error
      if (context) {
        queryClient.setQueryData(['cart'], context.previousCart)
      }
      toast.error('Erro ao remover do carrinho')
    },
    onSuccess: () => {
      toast.success('Produto removido do carrinho')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

/**
 * Update cart item quantity with debounce
 */
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateProductQuantity(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['cart'] })

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(['cart'])

      // Optimistically update quantity
      queryClient.setQueryData(['cart'], (old: CartItem[] = []) =>
        old.map((item) =>
          item.product_id === productId
            ? { ...item, quantity }
            : item
        ).filter((item) => item.quantity > 0)
      )

      return { previousCart }
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context) {
        queryClient.setQueryData(['cart'], context.previousCart)
      }
      toast.error(error.message || 'Erro ao atualizar quantidade')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

/**
 * Clear entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => clearUserCart(),
    onSuccess: () => {
      queryClient.setQueryData(['cart'], [])
      queryClient.setQueryData(['cart', 'count'], 0)
      queryClient.setQueryData(['cart', 'total'], 0)
      toast.success('Carrinho limpo')
    },
    onError: () => {
      toast.error('Erro ao limpar carrinho')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
